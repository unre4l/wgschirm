/* eslint-disable */

function prettySeconds(seconds, hideSeconds = false) {
  seconds = parseInt(seconds, 10);
  let day = 0;
  let hour = 0;
  let minute = 0;
  minute = Math.floor(seconds / 60);
  seconds %= 60;
  hour = Math.floor(minute / 60);
  minute %= 60;
  day = Math.floor(hour / 24);
  hour %= 24;
  let str = '';
  if (seconds && !hideSeconds) {
    str = `${seconds}s`;
  }
  if (minute) {
    str = `${minute}m ${str}`;
  }
  if (hour) {
    str = `${hour}h ${str}`;
  }
  if (day) {
    str = `${day}d ${str}`;
  }
  return str;
}

export { prettySeconds };
