

const { google } = require("googleapis");
const path = require("path");

const credentials=require('./credentials.json');

// Required scopes for Sheets 
const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets"
  
];

// auth for read+write
function getAuth() {
  return new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "credentials.json"),
    scopes: SCOPES,
  });
}
// Read input sheet
async function readSheetData() {
  try {
  //  console.log("reading sheet..");

    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      
      spreadsheetId:'1z-8uWnglOyLb7TWUgiVoJmLxjEWFYvDLazQlx0cZ98E',
      range: "Sheet1!A:C", // Adjust range if needed
    });

    console.log(" Sheet data fetched");

    return res.data.values || [];
  } catch (err) {
    console.error(" Error reading sheet:", err.message);

    return [];
  }
}

//  Write scraped data back into sheet( d,e,f)

// async function writeSheetData(row, scraped) {

//   try {

//     // console.log(`Writing to row ${row}...`);

//     const auth = getAuth();
//     const sheets = google.sheets({ version: "v4", auth });

//     await sheets.spreadsheets.values.update({
//       spreadsheetId: process.env.SHEET_ID,
//       range: `Sheet1!D${row}:F${row}`, // Writes into columns D-F
//       valueInputOption: "RAW",
//       requestBody: {
//         values: [[scraped.volume, scraped.competition, scraped.score]],
//       },
//     });

//     console.log("Row updated in sheet");

//   } catch (err) {
//     console.error("Error writing to sheet:", err.message);
//   }


// }

// Write batch scraped data into sheet
async function writeBatchData(startRow, batchResults) {
  try {
    console.log(` Writing batch starting from row ${startRow}...`);

    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const values = batchResults.map(scrap => [
      scrap.volume,
      scrap.competition,
      scrap.score,
    ]);

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID,
      range: `Sheet1!D${startRow}:F${startRow + batchResults.length - 1}`,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    console.log("✅ Batch updated in sheet");
  } catch (err) {
    console.error("❌ Error writing batch:", err.message);
  }
}




module.exports = { readSheetData,writeBatchData };
