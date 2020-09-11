const puppeteer = require("puppeteer");
//require("./server");
require("dotenv").config();
const fetch = require("node-fetch");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Server Code
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

// Scraper Code
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://instagram.com");

  await page.waitForSelector("input");

  // To run querySelectorAll with puppeteer use .$$
  // Once inputs have appeared on page - enter username & password
  const inputs = await page.$$("input");
  await inputs[0].type(`${process.env.USERLOGIN}`);
  await inputs[1].type(`${process.env.PASSWORD}`);

  // Locate and press the login button
  const logInButton = (await page.$$("button"))[1];
  logInButton.click();

  // Wait for page to finish loading
  await page.waitForNavigation();

  const ACCOUNT_NAMES = [
    "cruisin_overland",
    // "arts_amara",
    // "furni.mods",
    // "jordy_yeoman",
    // "amara_blackwell",
  ];

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const imgStringDescLength = 50;

  // Initialize empty Array for containing all image data objects
  const imageData = [];

  for (let ACCOUNT_NAME of ACCOUNT_NAMES) {
    const userName = ACCOUNT_NAME;
    await page.goto(`https://instagram.com/${ACCOUNT_NAME}`);
    await page.waitForSelector("img");
    const imgSrc = await page.$eval("img", (el) => el.getAttribute("src"));
    //     const headerData = await page.$$eval("header li", (els) =>
    //       els.map((el) => el.textContent)
    //     );
    //     const name = await page
    //       .$eval("header h1", (el) => el.textContent)
    //       .catch((err) => true);
    //     const desc = await page
    //       .$eval(".-vDIg span", (el) => el.textContent)
    //       .catch((err) => true);
    //     const link = await page
    //       .$eval(".-vDIg a", (el) => el.textContent)
    //       .catch((err) => true);
    //     const profile = { imgSrc, headerData, name, desc, userName, link };
    //     console.log({ profile });
    //   }

    // Loop through each image and collect data
    for (let i = 0; i < 1; i++) {
      await (await page.$$("article a"))[i].click();
      await page.waitForSelector(".C4VMK > span");

      const imgDesc = (
        await page.$eval(".C4VMK > span", (el) => el.textContent)
      ).substring(0, imgStringDescLength);

      const imgLikes =
        parseInt(
          await page
            .$eval(".Nm9Fw > button > span", (el) => el.textContent)
            .catch((err) => true)
        ) + 1;

      // Make sure image is loaded
      await page.waitForSelector("time");

      // Collect the post time & convert to local date & time
      const f = await page.$eval("time", (el) => el.getAttribute("datetime"));

      const date = new Date(f);

      // Get the day of the week when the post was made
      const d = weekday[date.getDay()];
      // Get the time the post was made - returns string eg - "7:38AM"
      const t = date.toLocaleTimeString("en", {
        timeStyle: "short",
        hour12: true,
        timeZone: "UTC",
      });

      // Section the post time into 1 of 4 categories
      // Early Morning
      // Late Morning
      // Early Afternoon
      // Late Afternoon

      const z = parseInt(f.substring(11, 13));
      let y = undefined;
      // Categorize into day segments
      if (z < 9) {
        y = {
          dayDesc: "Early Morning Before 9AM",
          daySegment: 1,
        };
      } else if (z > 9 && z < 12) {
        y = {
          dayDesc: "Late Morning After 9AM Before 12",
          daySegment: 2,
        };
      } else if (z > 12 && z < 20) {
        y = {
          dayDesc: "Early Arvo After 12PM Before 8PM",
          daySegment: 3,
        };
      } else {
        y = {
          dayDesc: "Late Arvo After 8PM Before 12AM/Midnight",
          daySegment: 4,
        };
      }

      // Collect all information into one object
      const imgPostTime = { d, t, f, y };

      const imageStats = { imgDesc, imgLikes, imgPostTime, userName, imgSrc };

      imageData.push(imageStats);

      await page.waitForSelector("div.Igw0E button.wpO6b");
      await (await page.$("div.Igw0E button.wpO6b")).click();
    }

    // , imgLikes, imgPostTime
  }

  // Push to local database
  //db.imageDataScrapes.save(imageData);

  // Push to MongoDB
  const options = {
    method: "POST",
    body: JSON.stringify(imageData),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch("http://localhost:9001/posts", options);
  await browser.close();
})();

//
//
//
//
//
//
//
//
//
//
//
//
//
//
// ## CODE FOR LIKING 2 MOST RECENT PHOTOS ##

// const ACCOUNT_NAME = "cruisin_overland";
//   // Go to a specific users profile page
//   await page.goto(`https://instagram.com/${ACCOUNT_NAME}`);

//   // Wait for page to finish loading
//   await page.waitForSelector("article a");

//   await (await page.$("article a")).click();

//   // Wait for the like button to appear
//   await page.waitFor(2000);
//   await (await page.$$("button"))[6].click();

//   // Close currently opened image
//   await (await page.$$("button"))[12].click();

//   // Open second image
//   await (await page.$$("article a"))[1].click();

//   // Wait for the like button to appear
//   await page.waitFor(2000);
//   await (await page.$$("button"))[6].click();

//   await page.waitFor(5000);
