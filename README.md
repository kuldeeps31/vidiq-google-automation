# vidiq-automation-tool


## Objective

The Node.js automation tool that:
1. Reads keywords and VidIQ links from Google Sheet  
2. Logs into VidIQ (via Puppeteer)  
3. Scrapes **Search Volume, Competition, Score**  
4. Writes results back to Google Sheet (columns D, E, F)  
5. Appends formatted results to Google Doc  

---

## File Structure
- `server.js` → Main entry point  
- `sheets.js` → Google Sheets API functions (read/write)  
- `docs.js` → Google Docs API functions (append)  
- `vidiqScraper.js` → Scraping + Login logic  
- `.env` → Credentials & environment config  
- `.gitignore`  
- `credentials.json` → Google service account key  

---

## Google Cloud Console Setup (Sheets + Docs API)

1. **Create Google Cloud Project**  
   - Go to [Google Cloud Console](https://console.cloud.google.com/)  
   - Click on **New Project** → Enter project name (e.g., `automation-node`) → Create  

2. **Enable APIs**  
   - Select project → Navigation Menu → APIs & Services → Library  
   - Enable: **Google Sheets API** & **Google Docs API**  

3. **Create Service Account**  
   - Navigation Menu → IAM & Admin → Service Accounts  
   - Click **Create Service Account**  
   - Enter name (e.g., `automation-node`)  
   - Assign role: **Editor**  
   - Open the Service Account → Go to **Keys** tab → Add Key → Create new key → Choose **JSON** → Download  

4. **Add credentials.json**  
   - Put downloaded JSON file in project root as `credentials.json`  
   - Reference its path in `.env`  

5. **Share Google Sheet & Doc**  
   - Open your Google Sheet and Doc  
   - Click **Share** → Add the `client_email` from `credentials.json` → Give **Editor** access  

---

## Clone Repo & Install Dependencies
```bash
git clone https://github.com/kuldeeps31/vidiq-google-automation.git
cd vidiq-google-automation
npm install




# .ENV
# VidIQ login
VIDIQ_EMAIL=your-vidiq-email
VIDIQ_PASSWORD=your-vidiq-password

# Google Sheet & Docs IDs
SHEET_ID=your-google-sheet-id
DOCS_ID=your-google-doc-id

# Google service account credentials
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_CLIENT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC123...\n-----END PRIVATE-----"




## RUN THE AUTOMATION
node server.js
