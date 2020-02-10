const { google } = require("googleapis");

class GdriveClient {
  constructor() {
    const auth = new google.auth.OAuth2(
      process.env.CLIENT_ID, 
      process.env.CLIENT_SECRET, 
    );

    auth.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN
    });


    this.drive = google.drive({version: "v3", auth});
  }

  async listFiles(searchQuery) {
    const query = (pageToken = null) => {
      return new Promise(resolve => {
        this.drive.files.list({
          q: searchQuery,
          fields: 'files(id, name)',
        }, async (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          pageToken = res.nextPageToken;
          const files = res.data.files;
          if (pageToken) {
            files.concat(await query(pageToken))
          }
          resolve(files);
        });
      })
    }

    return await query();
  }

  findFile(fileId) {
    return new Promise(resolve => {
      this.drive.files.get({ fileId }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        resolve(res.data);
      });
    })
  }

  getSheet(spreadsheetId) {
    this.sheets.get({ spreadsheetId }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      return res.data.sheet;
    });
  }

  getRow(rowIndex) {
    `A${rowIndex + 1}:AAA${rowIndex + 1}`
  }

  getColumn(columnIndex) {
    letter = letterFromIndex(columnIndex)
    `${letter}1:${letter}10000`
  }

  letterFromIndex(index) {
    String.fromCharCode(97 + index);
  }
}

exports.GdriveClient = GdriveClient;
