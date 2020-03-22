const { Monitor } = require("./lib/monitor");
const day = 24 * 60 * 60 * 1000;
const interval = process.env.INTERVAL || 7;
const timeframe = interval * day;

const message = `The${process.env.NAME ? ` ${process.env.NAME}` : ""} camera has not recorded data in ${interval} days. Should you check that its working properly?`

new Monitor(
  process.env.FOLDER_ID,
  {
    message,
    channel: process.env.CHANNEL_ID,
  },
  timeframe
).monitor();
