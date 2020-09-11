const express = require("express");
const router = express.Router();
const ImageData = require("../models/Post");

router.get("/", async (req, res) => {
  // Leaving the Post.find() method empty
  // means we want to return the entire collection of data
  try {
    const posts = await ImageData.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  console.log("I got a request");
  // Array of data that needs to be inserted to MongoDB
  const data = req.body;

  ImageData.insertMany(data)
    .then((result) => {
      console.log("result ", result);
      res.status(200).json({ success: "new documents added!", data: result });
    })
    .catch((err) => {
      console.error("error ", err);
      res.status(400).json({ err });
    });
});

module.exports = router;

// const post = new ImageData({
//   imgDesc: req.body.imgDesc,
//   imgLikes: req.body.imgLikes,
//   imgPostTime: {
//     d: req.body.imgPostTime.d,
//     t: req.body.imgPostTime.t,
//     f: req.body.imgPostTime.f,
//     y: {
//       dayDesc: req.body.imgPostTime.y.dayDesc,
//       daySegment: req.body.imgPostTime.y.daySegment,
//     },
//   },
//   userName: req.body.userName,
// });
