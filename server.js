const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Setup Express Server
var app = express();
var port = process.env.PORT || 9001;

// Middlwares
app.use(bodyParser.json());
app.use(cors());

//Import Routes
const postsRoute = require("./routes/posts");
app.use("/posts", postsRoute);

// Connect to database
(async () => {
  await mongoose
    .connect(`${process.env.DB_CONNECTION}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Connected to database !!");
    })
    .catch((err) => {
      console.log("Connection failed !!" + err.message);
    });
})();

// Routes
app.get("/", (req, res) => {
  res.send("It's over 9000!");
});

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
