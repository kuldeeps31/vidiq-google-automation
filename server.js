// require("dotenv").config();

// const {readSheetData,writeSheetData}=require('./sheets');
// const {appendToDoc}=require('./docs');
// const {scrapeVidIQ}=require("./vidiqScraper");


// async function main(){

// try{

//     console.log("start");
//     // read all row from sheet

//     const rows=await readSheetData();
//     if(!row || row.length < 2){
//         throw new error("no data found");
//     }




//     //google doc id for column crow 2
//     const docId=rows[1][2];
//     if(!docId) throw new error("doc id not found in sheet");


//     //loop through each row

//     for(let i=1;i<rows.length;i++){ //skip header roe
//         const keyword=rows[i][0];
//         const vidiqUrl=rows[i][1];

//         if(!keyword || !vidiqUrl) continue;

//         // scrap data from vidiq
//         const scrap=await scrapeVidIQ(vidiqUrl,keyword);

//         //write back into google sheet
//         await writeSheetData(i+1,scrap);


//         //apend into gogle docs

//         const data=`
//         keyword:${keyword}
//         Search Volume:${scrap.volume}
//         Competition:${scrap.competition}
//         Overall Score:${scrap.score}
//         `;

//         await appendToDoc(docId,data);
//     }
//     console.log("processs completed");

//     }catch(err){
//         console.error("error->",err);
//     }
// }



// main();



// require("dotenv").config();
// const fs=require("fs");

// const { readSheetData, writeSheetData } = require("./sheets");
// const { appendToDoc } = require("./docs");
// const { scrapeVidIQ } = require("./vidiqScraper");

// // batching for handling large data
// const BATCH_SIZE=50;



// async function main() {

//   try {
//     console.log("🚀 Process started...");

//     // ✅ Read all rows from sheet
//     const rows = await readSheetData();

//     // ❌ Error: tumne "row" likha tha instead of "rows"
//     if (!rows || rows.length < 2) {
//       throw new Error("No data found in sheet");
//     }

//     // ✅ Google Doc ID (column C row 2)
//     const docId = rows[1][2];
//     if (!docId) throw new Error("Doc ID not found in sheet");

//     // ✅ Loop through each row (skip header row 0)
//     for (let i = 1; i < rows.length; i++) {
//       const keyword = rows[i][0];
//       const vidiqUrl = rows[i][1];

//       if (!keyword || !vidiqUrl) {
//         console.log(`⚠️ Skipping row ${i + 1} (missing keyword/url)`);
//         continue;
//       }

//       console.log(`🔍 Scraping for keyword: "${keyword}"`);

//       // ✅ Scrap data from vidiq
//       const scrap = await scrapeVidIQ(vidiqUrl, keyword);

//       // ✅ Write back into Google Sheet
//       await writeSheetData(i + 1, scrap); // i+1 -> because rows[1] is Sheet row 2

//       // ✅ Prepare data for Google Docs
//       const data = `
// Keyword: ${keyword}
// Search Volume: ${scrap.volume}
// Competition: ${scrap.competition}
// Overall Score: ${scrap.score}
// ------------------------------
// `;

//       // ✅ Append into Google Docs
//       await appendToDoc(docId, data);
//     }

//     console.log("✅ Process completed successfully!");
//   } catch (err) {
//     console.error("❌ Error in main():", err.message);
//   }
// }

// main();

require("dotenv").config();

const { readSheetData, writeBatchData } = require("./sheets");
const { appendToDoc } = require("./docs");
const { scrapeVidIQ } = require("./vidiqScraper");

// batching for handling large data
const BATCH_SIZE = 50;

async function main() {
  try {
    console.log("🚀 Process started...");

    // ✅ Read all rows from sheet
    const rows = await readSheetData();
    if (!rows || rows.length < 2) throw new Error("No data found in sheet");

  console.log(`Total rows fetched: ${rows.length}`);

    // ✅ Google Doc ID (column C row 2)
    const docId = rows[1][2];
    if (!docId) throw new Error("Doc ID not found in sheet");


    // ✅ Batch processing
    for (let start = 1; start < rows.length; start += BATCH_SIZE) {

      const batch = rows.slice(start, start + BATCH_SIZE);

      console.log(`⚡ Processing rows ${start + 1} to ${start + batch.length}`);

      let data = "";
      let batchResults = [];

      for (let i = 0; i < batch.length; i++) {
        const rowIndex = start + i;
        const keyword = batch[i][0];
        const vidiqUrl = batch[i][1];

        if (!keyword || !vidiqUrl) {
          console.log(`⚠️ Skipping row ${rowIndex + 1} (missing keyword/url)`);
          batchResults.push({ volume: "0", competition: "N/A", score: "0" });
          continue;
        }

        console.log(`🔍 Scraping for keyword: "${keyword}"`);

        // ✅ Scrape data
        const scrap = await scrapeVidIQ(vidiqUrl, keyword);
        batchResults.push(scrap);

        // ✅ Buffer data for Google Doc
        data += `
Keyword: ${keyword}
Search Volume: ${scrap.volume}
Competition: ${scrap.competition}
Overall Score: ${scrap.score}
------------------------------`;
      }

      // ✅ Write batch results back to Sheet
      await writeBatchData(start + 1, batchResults);

      // ✅ Append whole batch to Google Doc
      if (data.trim()) {
        await appendToDoc(docId, data);
      }
    }

    console.log("✅ Process completed successfully!");
  } catch (err) {
    console.error("❌ Error in main():", err.message);
  }
}

main();
