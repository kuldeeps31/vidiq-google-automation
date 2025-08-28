

const { google } = require("googleapis");
const path = require("path");

// Scopes required for Sheets + Docs
const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/documents",
];


// Auth 
function getAuth() {
  return new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "credentials.json"),
    scopes: SCOPES,
  });
}


// Append text into a Google Doc
async function appendToDoc(docId, text) {
  try {
    const auth = getAuth();
    const docs = google.docs({ version: "v1", auth });

    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 }, // Insert at start of doc
              text: text,
            },
          },
        ],
      },
    });

    console.log("Data added to Google Docs");
  } catch (err) {
    console.error(" Error appending to doc:", err.message);
  }
}



module.exports = { appendToDoc };
