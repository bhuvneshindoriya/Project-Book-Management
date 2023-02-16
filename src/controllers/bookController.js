const bookModel = require("../models/bookModel.js");
const userModel = require("../models/userModel.js");
const reviewModel = require("../models/reviewModel");
const validator = require("../Validations/Validator");

//____________________________|| CREATE BOOKS ||____________________________

const createBooks = async (req, res) => {
  try {
    let bookData = req.body;
    let { title, userId, ISBN, category, subcategory, excerpt, releasedAt } =
      bookData;
      if(userId!=req.decode.userId) return res.status(403).send({status:false,message:"you are not authorized"})
    if (!validator.isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Title Must be Present" });
    }

    let isUniqueTitle = await bookModel.findOne({ title: title });
    if (isUniqueTitle) {
      return res
        .status(400)
        .send({ status: false, message: "this title is being used" });
    }

    if (!excerpt) {
      return res
        .status(400)
        .send({ status: false, message: "Excerpt Must be Present" })
    }

    if (!validator.isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "This is not a valid user id" });
    }

    let findUser = await userModel.findOne({ _id: userId });
    if (!validator.isValid(findUser)) {
      return res
        .status(404)
        .send({ status: false, message: "User with this Id does not exist" });
    }

    if (!validator.isValidISBN(ISBN)) {
      return res.status(400).send({
        status: false,
        message: "Please provide a valid isbn number",
      });
    }

    let isUniqueISBN = await bookModel.findOne({ ISBN: ISBN });

    if (isUniqueISBN) {
      return res
        .status(400)
        .send({ status: false, message: "This ISBN is already being used" });
    }

    if (!category) {
      return res
        .status(400)
        .send({ status: false, message: "category is a required field" });
    }

    if (!subcategory) {
      return res
        .status(400)
        .send({ status: false, message: "subcategory is Mandatory" });
    }

    if (!releasedAt) {
      return res
        .status(400)
        .send({ status: false, message: "releasedAt is Mandatory" });
    }

    if (!validator.isValidDate(releasedAt)) {
      return res
        .status(400)
        .send({ status: false, message: "Date format is not valid" });
    }

    let saveBook = await bookModel.create(bookData);
    return res.status(201).send({
      status: true,
      message: "you book has been saved",
      data: saveBook,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getBooks = async (req, res) => {
  try {
    let data = req.query;
    let filter = {
      isdeleted: false,
      ...data,
    };

    const { category, subcategory, authorId } = data;
    if (authorId) {
      let verifyAuthorId = await userModel.find({ authorId: authorId });
      if (verifyAuthorId.length == 0) {
        return res
          .status(400)
          .send({ status: false, msg: "No blogs in this AuthorId exist" });
      }
    }
    if (category) {
      let verifyCategory = await bookModel.find({ category: category });
      if (verifyCategory.length == 0) {
        return res
          .status(400)
          .send({ status: false, msg: "No blogs in this category exist" });
      }
    }

    if (subcategory) {
      let verifySubcategory = await bookModel.find({
        subcategory: subcategory,
      });
      if (!verifySubcategory) {
        return res
          .status(400)
          .send({ status: false, msg: "No blogs in this Subcategory exist" });
      }
    }
    let findBook = await bookModel
      .find(filter)
      .select({
        _id: 1,
        title: 1,
        excerpt: 1,
        userId: 1,
        category: 1,
        releasedAt: 1,
        reviews: 1,
      })
      .sort({ title: 1 });

    if (!findBook) {
      return res
        .status(404)
        .send({ status: false, message: "No books with this query exists" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "Book List", data: findBook });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//____________________________|| GET BOOKS BY PARAMS ||____________________________

const getBookById = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    if (!validator.isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "this is not a valid bookId " });
    }

    let findBook = await bookModel.findOne({ _id: bookId }).lean();

    if (!findBook) {
      return res.status(404).send({
        status: false,
        message: "No document exists with this book Id",
      });
    }

    if (findBook.isDeleted === true) {
      return res.status(404).send({
        status: false,
        message: "This book has been deleted by the user",
      });
    }

    let findReview = await reviewModel.find({
      bookId: findBook._id,
      isDeleted: false,
    });

    findBook["reviewsData"] = findReview;

    return res
      .status(200)
      .json({
        status: true,
        message: "Book details is successful",
        data: findBook,
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

//____________________________|| UPDATE BOOKS ||____________________________

const updateBook = async function (req, res) {
  try {
    let data = req.body;
    let bookId = req.params.bookId;

    if (!validator.isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "this is not a valid bookId " });
    }

    let checkBook = await bookModel.findOne({ _id: bookId });

    if (!validator.isValid(checkBook)) {
      return res
        .status(404)
        .send({ status: false, message: "No book with this Id exists" });
    }

    if (checkBook.isDeleted == true) {
      return res
        .status(404)
        .send({ status: false, message: "this book has been deleted by you" });
    }

    const { title, releasedAt, ISBN, excerpt } = data;

    if (title) {
      let findTitle = await bookModel.findOne({ title: title });
      if (findTitle) {
        return res.status(400).send({
          status: false,
          message: "This title is already in use, try another one",
        });
      }
    }

    if (ISBN) {
      if (!validator.isValidISBN(ISBN)) {
        return res.status(400).send({
          status: false,
          message: "Please provide a valid isbn number",
        });
      }

      let isUniqueISBN = await bookModel.findOne({ ISBN: ISBN });

      if (isUniqueISBN) {
        return res
          .status(400)
          .send({ status: false, message: "This ISBN is already being used" });
      }
    }

    if (releasedAt) {
      if (!validator.isValidDate(releasedAt)) {
        return res
          .status(400)
          .send({ status: false, message: "Date format is not valid" });
      }
    }

    if (excerpt) {
      if (!validator.isValid(excerpt)) {
        return res
          .status(400)
          .send({ status: false, message: "Excerpt is Mandatory" });
      }
    }

    let findBook = await bookModel.findOneAndUpdate(
      { _id: bookId },
      { $set: { ...data }, updatedAt: Date.now() },
      { new: true, upsert: true }
    );

    return res.status(200).send({
      status: true,
      message: "Updated successfully",
      data: findBook,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//____________________________|| DELETE BOOKS ||____________________________

const deleteBook = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "please provide a bookId in params" });
    }

    let findbookId = await bookModel.findById(bookId);
    if (!findbookId) {
      return res
        .status(404)
        .send({ status: false, msg: "bookId doesn't exists" });
    }

    const checkBookId = await bookModel.findOne({
      _id: bookId,
      isDeleted: false,
    });

    if (!checkBookId) {
      return res.status(404).send({ status: false, message: "book already deleted" });
    }

    let deletedBook = await bookModel.findByIdAndUpdate(
      { _id: bookId },
      { $set: { isDeleted: true } },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "book sucessfully deleted", deletedBook });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

//____________________________|| EXPORTING MODULE TO ROUTE.JS ||____________________________

module.exports = { createBooks, getBooks, getBookById, updateBook, deleteBook };

