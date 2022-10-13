const SERVER_START_TIME = Date.now();
const express = require('express');
const path = require('path');
const socket = require('socket.io');
const cors = require('cors');
const expressWinston = require('express-winston');

const CONFIG = require('./config/');
const { loggerV1: wLog } = require('./utils/');
const { convertMsToMinSecs } = require('./lib/');

const app = express();
const server = require('http').createServer(app);
const IO = socket(server, { cors: CONFIG.SOCKET.cors });

app.use(cors({ origin: true, credentials: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true }));
app.use(expressWinston.logger(CONFIG.LOGGER.expressWinstonConfig));
app.use('/api', require('./routes/'));
app.use(expressWinston.errorLogger(CONFIG.LOGGER.expressWinstonConfig));

require('./socket/').init(IO);
require('./cron/').init();

require('./helper/')
  .connectDB()
  .then((res) => res.initModels())
  .then(() =>
    server.listen(CONFIG.SERVER.PORT, () =>
      wLog.info(
        `Server started in ${convertMsToMinSecs(Date.now() - SERVER_START_TIME)} and running on ${
          CONFIG.SERVER.IS_HTTPS ? 'https' : 'http'
        }://${CONFIG.SERVER.HOST}:${CONFIG.SERVER.PORT}`
      )
    )
  )
  .catch((err) => {
    wLog.error(err.message);
    process.exit(1);
  });
