
const puppeteer = require("puppeteer");
const fs=require("fs");


// for login->it failed
// async function loginVidIQ(page) {
//   await page.goto("https://vidiq.com/login", { waitUntil: "networkidle2" });
 

//   await page.type("input[data-testid='form-input-email']", process.env.VIDIQ_EMAIL, { delay: 50 });
//   await page.type("input[data-testid='form-input-password']", process.env.VIDIQ_PASSWORD, { delay: 50 });

//   await Promise.all([
//     page.click("button[data-testid='login-button']"),
//     page.waitForNavigation({ waitUntil: "networkidle2" }),
//   ]);

//   console.log("ogged into VidIQ");
// }



async function scrapeVidIQ(page,url, keyword) {
  

  // 1. Go to VidIQ page
  await page.goto(url, { waitUntil: "networkidle2" });


  // 2. Check keyword in search bar (update selector as per site)

  try {
    const searchBarValue = await page.$eval("input[name='search']", el => el.value);
   
    if (!searchBarValue.includes(keyword)) {
      console.warn(` Keyword not matching: expected ${keyword}, found ${searchBarValue}`);
    }
  } catch (err) {
    console.warn("keyword  matchedd...");
  }

 
 //scrapping the value to {volume,competition,score}
    const volume = await page.$eval("td .pl-large", el => el.innerText.trim()).catch(() => "0");
    const competition = await page.$eval("td .css-0", el => el.innerText.trim()).catch(() => "N/A");
    const score = await page.$eval("div[data-testid='score'] p", el => el.innerText.trim()).catch(() => "0");


  
  // await browser.close();

  return {
    volume: parseInt(volume) || 0,
    competition: parseInt(competition) || 0,
    score: parseInt(score) || 0,
  };
}


module.exports = { scrapeVidIQ };





