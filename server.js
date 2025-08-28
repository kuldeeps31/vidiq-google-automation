
require("dotenv").config();
const { readSheetData, writeBatchData } = require("./sheets");
const { appendToDoc } = require("./docs");
const { scrapeVidIQ } = require("./vidiqScraper");
const puppeteer = require("puppeteer"); 


// batching for handling large data (10k) to divide into chunks
const BATCH_SIZE = 50;



async function main() {

  try {
    // console.log(" Process started...");


    // Read all rows from sheet
    const rows = await readSheetData();

    if (!rows || rows.length < 2) throw new Error("No data found in sheet");

    console.log(`Total rows fetched: ${rows.length}`);

    //  Google Doc ID (column C row 2)
    const docId = rows[1][2];
    if (!docId) throw new Error("Doc ID not found in sheet");


    //  Batch processing for handling large data(10k_)
    for (let start = 1; start < rows.length; start += BATCH_SIZE) {

      const batch = rows.slice(start, start + BATCH_SIZE);
     console.log(batch.length);
     console.log(` Processing rows ${start + 1} to ${start + batch.length}`);

      let data="";
      let batchResults = [];

      // Launch browser only once for the batch
const browser = await puppeteer.launch({ headless: true });  //for prod headless true for fast UI
// const browser = await puppeteer.launch({ headless: false, slowMo: 50 });   //for dev or test
  const page = await browser.newPage();


      for (let i = 0; i < batch.length; i++) {

        const rowIndex = start + i;
        const keyword = batch[i][0];
        const vidiqUrl = batch[i][1];

        if (!keyword || !vidiqUrl) {
          console.log(` Skipping row ${rowIndex + 1} (missing keyword/url)`);
          batchResults.push({ volume: "0", competition: "N/A", score: "0" });
          continue;
        }

        console.log(` Scraping for keyword: "${keyword}"`);

        //Scrape data
        const scrap = await scrapeVidIQ(page,vidiqUrl, keyword);
        batchResults.push(scrap);

        //  Buffer data for Google Doc
        
        data += `
Keyword: ${keyword}
Search Volume: ${scrap.volume}
Competition: ${scrap.competition}
Overall Score: ${scrap.score}
------------------------------`;
      }

        await browser.close(); // Close browser after batch is done

      //  Write batch results back to Sheet
      await writeBatchData(start + 1, batchResults);

      //  Append whole batch to Google Doc
      if (data.trim()) {
        await appendToDoc(docId, data);
      }
    }

    console.log(" Process completed successfully!");
  } catch (err) {
    console.error(" Error in main():", err.message);
  }
}

main();


