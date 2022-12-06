require("dotenv").config();
const express = require("express");
const route = require("./routes/route.js");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const multer=require('multer')
app.use(multer().any())

mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));
app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
