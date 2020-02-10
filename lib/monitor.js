const { GdriveClient } = require("./client");
const { WebClient } = require('@slack/web-api');

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const hour = 60*60*1000;
const day = hour * 24;
const week = day * 7;


// Monitor by checking for folders during a specific interval
class Monitor {
  // @param folderId: string - ID of the folder to monitor
  // @param monitoring: { channel: string, message: string } - Where and what to notifiy
  constructor(folderId, monitoring, alertInterval = week) {
    this.monitoring = monitoring;
    this.slack = new WebClient(process.env.SLACK_TOKEN);
    this.client = new GdriveClient();
    this.folderId = folderId;
    this.alertInterval = alertInterval;
  }

  async findFoldersByName(names) {
    const nameSearch = names.reduce((query, name) => query += ` or name contains '${name}'`, `name contains '${names.shift()}'`);
    return await this.client.listFiles(
      `'${this.folderId}' in parents and mimeType='application/vnd.google-apps.folder' and (${nameSearch})`);
  }

  async monitor() {
    const today = Date.now();
    // Construct yyyy-mm-dd folder names for days within alert interval
    const lastWeek = new Array((Math.round(this.alertInterval / day))).fill(undefined).map((_, index) => 
      new Date(today - (index * day)).toISOString().split('T')[0]
    );
    const folders = await this.findFoldersByName(lastWeek);
    // If there are no folders in timeframe, send an alert
    if (Array.isArray(folders) && folders.length) {
      // Check that folders contain something and aren't just shells
      const contents = await this.client.listFiles(`'${folders[0].id}' in parents`);
      if (Array.isArray(contents) && contents.length) {
        return;
      }
    }

    this.slack.chat.postMessage({ 
      channel: this.monitoring.channel,
      text: this.monitoring.message,
      username: 'Security Monitor Bot',
      icon_emoji: ':video_camera:'
    });
    return;
  }



  /* Move into a different project */
  // Get a list of specific column values (member IDs)

  // Add a row to a spreadsheet

}

exports.Monitor =  Monitor;
