

<!-- vidiq-automation-tool -->


<!-- objective... -->

The node.js automation tool
1->read keywords and vidiq links from google sheet
2->login into VIDiq(via puppeteer);
3->scrapes search volume,competition,score
4->writes result back to goodle sheet ,d,e,f
5->append formaated result to google doc


<!-- file structure -->
server.js -main entry poinnt
sheets.js -google sheet API funtion(read,write)
docs.js -  google docs API function(append);
.env - credentials
.gitignore
readme.md
vidiqScraper.js =scraping + login
credentials.json->json key



<!-- google cloud console setup (sheets + docs API) -->
1-->make  google cloud project
  ->go to google cloud console
  ->click on new project
  ->enter project name (like automation-node) and  create

2->Enable the APis

->select project go to navigaton menu->APIs and services->library
->enable->google docs & google sheet


3->create service account

->Navigation menu-> IAM and Admin ->service account
->click on create service account
->enter service name (like automation-node)
->seleect the role ->editor
->after that click on service account and then on the top go to key tab->Add key ->create new key->select json
->download the json format

4->put the downlaod json in root as (credentials.json)
->now specify the path in .env 

5->Share the sheet and docs
->open the google sheet and google docs
->click on the share button at  top right
->now (credentials.json->client_email) put this email and provide editor access and send










<!-- Clone repo & install deps -->
```bash
git clone https://github.com/kuldeeps31/vidiq-google-automation.git

cd vidiq-google-automation
npm install

# run the automation 
node server.js



# setup
.env
# Vidiqlogin
VIDIQ_EMAIL=your-vidiq-email
VIDIQ_PASSWORD=your-vidiq-password

# google  sheet and docs
SHEET_ID=your-google-sheet-id
DOCS_ID=your-google-doc-id

# google service account
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_CLIENT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC123....\n-----END PRIVATE



# Login Note

VidIQ login automation via Google Sign-In is not directly possible (because of Google Auth & reCAPTCHA).  

**Solution used in this project**:  
We reuse an existing Chrome user profile that is already logged into VidIQ.  
This way, Puppeteer launches with saved login state, and scraping works without re-login.

