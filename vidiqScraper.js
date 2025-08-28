
const puppeteer = require("puppeteer");

async function scrapeVidIQ(url, keyword) {
  
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 }); // debug ke liye
  const page = await browser.newPage();

  // 1. Go to VidIQ page
  await page.goto(url, { waitUntil: "networkidle2" });


  // 2. Check keyword in search bar (update selector as per site)

  try {
    const searchBarValue = await page.$eval("input[name='search']", el => el.value);
    // console.log(searchBarValue);
    // console.log(keyword);

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


  
  await browser.close();


  return {
    volume: parseInt(volume) || 0,
    competition: parseInt(competition) || 0,
    score: parseInt(score) || 0,
  };
}

module.exports = { scrapeVidIQ };


