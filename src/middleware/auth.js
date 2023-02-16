const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");
const validator = require("../Validations/Validator");

//________________________________|| AUTHENTICATION ||________________________________

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "Token is missing" });
    }
    decodedToken = jwt.verify(token, "Group7", (err, decode) => {
      if (err) {
        return res
          .status(400)
          .send({ status: false, message: "Token is not correct!" });
      }
      req.decode = decode;
      next();
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//________________________________|| AUTHORIZATION ||________________________________

const Authorisation = async function (req, res, next) {
  try {
    let bookId = req.params.bookId;

    if (!validator.isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid bookId" });
    }

    let CheckingBook = await bookModel.findOne({ _id: bookId });
    if (!validator.isValid(CheckingBook)) {
      return res
        .status(404)
        .send({ status: false, message: "this book is not found" });
    }
    if (CheckingBook.userId != req.decode.userId) {
      return res
        .status(403)
        .send({ status: false, message: "you are not Authorized person" });
    } else {
      next();
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { authentication, Authorisation };

// const authen = async function(req,res,next) {
//   let token = req.headers["x-api-key"]
//   if(!token) return res.status(400).send({status:false,msg:"token is missing"})
//   jwt.verify(token,"bhuvnesh",(err,decode)=>{
//     if(err) return res.status(400).send({status:false,msg:"token is invqalid"})
//     req.decode=decode
//     next()
//   })
// }
// const authori  = async function(req,res,next) {
// try{  let bookId =  req.params.bookId
//   if(!bookId) return res.status(400).send({status:false,msg:"bookId is required"})
//   let checkBookId = await bookModel.find({_id:bookId})
//   if(!checkBookId) return res.status(404).send({status:false,msg:"bookId is not present"})
//   if(checkBookId.userId != req.decode.userId) return res.status(403).send({status:false,msg:"not Authorized person"})
//   else{
//     next()
//   }}catch(error){
//     return res.status(500).send({status:false,msg:error.message})
//   }
// }
// module.exports={authen,authori}

// const auth1  = async function(req,res,next){
// let token = req.headers["x-api-key"]
// if(!token) return res.status(400).send({status:false,msg:"token is missing"})
// jwt.verify(token,"bhuvnesh",(err,decode)=>{
//   if(err) return res.status(401).send({status:false,msg:err.message})
//   req.decode=decode
//   next()
// })
// }

// const autz1 = async function(req,res,next){
//   let bookId = req.params.bookId
//   if(!bookId) return res.status(400).send({status:false,msg:'bookId is not present'})
//   let findBook = await bookModel.find({_id:bookId})
//   if(!findBook) return res.status(404).send({status:false,msg:'bookId is not present'})
//   if(findBook.userId!=req.decode.userId) return res.status(403).send({status:false,msg:"not Authorized person"})
//   else{
//     next()
//   }
//}
