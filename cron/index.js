const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');

const init = () => {
  schedule.scheduleJob('0 0 12 1 1/1 ? *', async () => {
    const isLogsClear = await Promise.all([
      fs.promises.writeFile(path.join(__dirname, '/logs/exceptions.log'), '', 'utf8'),
      fs.promises.writeFile(path.join(__dirname, '/logs/file.log'), '', 'utf8'),
      fs.promises.writeFile(path.join(__dirname, '/logs/rejections.log'), '', 'utf8')
    ]);
  });
};

module.exports = { init };
