function convertMsToMinSecs(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = (milliseconds % 60000) / 1000;

  return seconds === 60
    ? `${minutes + 1}:00`
    : `${minutes} minutes ${seconds.toString().padStart(2, "0")} seconds`;
}

module.exports = { convertMsToMinSecs };
