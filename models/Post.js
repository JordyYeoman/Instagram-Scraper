const mongoose = require("mongoose");

// Schema for each document that will be added to mongodb
const imageDataSchema = mongoose.Schema({
  imgDesc: String,
  imgLikes: Number,
  imgPostTime: {
    d: String,
    t: String,
    f: String,
    y: { dayDesc: String, daySegment: Number },
  },
  userName: String,

  date: {
    type: Date,
    default: Date.now,
  },
});

// Below we have the mongoose model, give it a name
// & the Schema AKA - How we want it to be structured.
module.exports = mongoose.model("ImageData", imageDataSchema);
