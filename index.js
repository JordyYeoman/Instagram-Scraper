const puppeteer = require("puppeteer");
const secrets = require("../secrets");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://instagram.com");

  await page.waitForSelector("input");

  // To run querySelectorAll with puppeteer use .$$

  // Once inputs have appeared on page - enter username & password
  const inputs = await page.$$("input");
  await inputs[0].type(secrets.USERNAME);
  await inputs[1].type(secrets.PASSWORD);

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

  const imgStringDescLength = 45;

  for (let ACCOUNT_NAME of ACCOUNT_NAMES) {
    const userName = ACCOUNT_NAME;
    await page.goto(`https://instagram.com/${ACCOUNT_NAME}`);
    await page.waitForSelector("img");
    //     const imgSrc = await page.$eval("img", (el) => el.getAttribute("src"));
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

    // Last 3 Photo post times &

    await (await page.$("article a")).click();
    await page.waitForSelector(".C4VMK > span");

    const imgDesc = (
      await page.$eval(".C4VMK > span", (el) => el.textContent)
    ).substring(0, imgStringDescLength);

    const imgLikes =
      parseInt(
        await page.$eval(".Nm9Fw > button > span", (el) => el.textContent)
      ) + 1;

    // Make sure image is loaded
    await page.waitForSelector("time");

    // Collect the post time & convert to local date & time
    const date = new Date(
      await page.$eval("time", (el) => el.getAttribute("datetime"))
    );

    // Get the day of the week when the post was made
    const d = weekday[date.getDay()];
    // Get the time the post was made
    const t = date.toLocaleTimeString("en", {
      timeStyle: "short",
      hour12: true,
      timeZone: "UTC",
    });
    const h = date.toLocaleTimeString("en", {
      timeStyle: "short",
      hour12: true,
      timeZone: "UTC",
    });

    // Section the post time into 1 of 4 categories
    // Early Morning
    // Late Morning
    // Early Afternoon
    // Late Afternoon

    const z = parseInt(h.substring(0, 2));
    let y = undefined;
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

    const imgPostTime = { d, t, y };

    const imageStats = { imgDesc, imgLikes, imgPostTime };
    console.log(imageStats);
    // , imgLikes, imgPostTime
    //await browser.close();
  }
})();

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
