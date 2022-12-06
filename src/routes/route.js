const express = require("express");
const {uploadFile}=require("../AWS/aws-s3");
const router = express.Router();

// ________________________________|| CONTROLLERS ||________________________________-----

const bookController = require("../controllers/bookController.js"); // BOOK CONTROLLER
const reviewController = require("../controllers/reviewController.js"); // REVIEW CONTROLLER
const userController = require("../controllers/userController.js"); // USER CONTROLLER

//________________________________|| MIDDLEWARE ||___________________________________

const {
  authentication,
  Authorisation,
  bookAuthorization,
} = require("../middleware/auth.js");

// ________________________________|| USER ||________________________________

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

// ________________________________|| BOOK ||________________________________

router.post("/books", authentication, bookController.createBooks);
router.get("/books", authentication, bookController.getBooks);
router.get(
  "/books/:bookId",
  authentication,
  Authorisation,
  bookController.getBookById
);
router.put(
  "/books/:bookId",
  authentication,
  Authorisation,
  bookController.updateBook
);
router.delete(
  "/books/:bookId",
  authentication,
  Authorisation,
  bookController.deleteBook
);

// ________________________________|| REVIEW ||________________________________

router.post("/books/:bookId/review", reviewController.createReview);
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview);

// ________________________________|| ROUTER VALIDATION ||________________________________-----

router.post("/write-file-aws", async function (req, res) {
  try {
    let files = req.files;
    if (files && files.length > 0) {
      //upload to s3 and get the uploaded link
      // res.send the link back to frontend/postman
      let uploadedFileURL = await uploadFile(files[0]);
      res
        .status(201)
        .send({ msg: "file uploaded succesfully", data: uploadedFileURL });
    } else {
      res.status(400).send({ msg: "No file found" });
    }
  } catch (err) {
    res.status(500).send({ msg: err });
  }
});

router.all("/*", function (req, res) {
  res.status(400).send({
    status: false,
    message: "Make Sure Your Endpoint is Correct !!!",
  });
});

module.exports = router;
