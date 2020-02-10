const { Monitor } = require("./lib/monitor");
const day = 24 * 60 * 60 * 1000;
const interval = 7;
const timeframe = interval * day;

Promise.all([
  {
    id: process.env.HOME,
    message: `The camera has not recorded data in ${interval} days. Should you check that its working properly?`
  }, 
  // {
  //   id: process.env.COMPUTER_ROOM_ID,
  //   message: `The camera in the Computer Room has not recorded data in ${interval} days. Should you check that its working properly?`
  // }, 
  // // {
  //   id: process.env.ELECTRONICS_ROOM_ID,
  //   message: `The camera in the Electronics Room has not recorded data in ${interval} days. Should you check that its working properly?`
  // }, 
  // {
  //   id: process.env.LOCKER_ROOM_ID,
  //   message: `The camera in the Locker Room has not recorded data in ${interval} days. Should you check that its working properly?`
  // }
].map(
  ({ id, message }) => new Monitor(
    id,
    {
      channel: "GTU6HUUUW",
      message,
    },
    timeframe,
  ).monitor()
));

