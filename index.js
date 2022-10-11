const SERVER_START_TIME = Date.now();
const express = require("express");
const path = require("path");
const fs = require("fs");
const socket = require("socket.io");
const cors = require("cors");
const winston = require("winston");
const expressWinston = require("express-winston");
const schedule = require("node-schedule");

const CONFIG = require("./config/");
const { loggerV1: wLog } = require("./utils/");
const { convertMsToMinSecs } = require("./lib/");

const app = express();
const server = require("http").createServer(app);
const IO = socket(server);

const expressWinstonConfig = {
  transports: [
    new winston.transports.File({
      filename: path.join(CONFIG.LOGGER.loggerPath, "/routesLogFile.log"),
    }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    winston.format.json()
  ),
};

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ parameterLimit: 100000, limit: "50mb", extended: true })
);
app.use(expressWinston.logger(expressWinstonConfig));
app.use("/api", require("./routes/"));
app.use(expressWinston.errorLogger(expressWinstonConfig));

IO.on("connection", (socket) => {
  wLog.info(`New connection: ${socket.id}`);

  socket.on("chats", (data) => {
    data.time = Date();
    socket.broadcast.emit("chats", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  socket.on("userConnected", (uName, usermsg) => {
    socket.broadcast.emit("userConnected", uName, usermsg);
  });
});

schedule.scheduleJob("0 0 12 1 1/1 ? *", async () => {
  const isLogsClear = await Promise.all([
    fs.promises.writeFile(
      path.join(__dirname, "/logs/exceptions.log"),
      "",
      "utf8"
    ),
    fs.promises.writeFile(path.join(__dirname, "/logs/file.log"), "", "utf8"),
    fs.promises.writeFile(
      path.join(__dirname, "/logs/rejections.log"),
      "",
      "utf8"
    ),
  ]);
});

require("./helper/")
  .connectDB()
  .then((res) => res.initModels())
  .then(() =>
    server.listen(CONFIG.SERVER.PORT, () =>
      wLog.info(
        `Server started in ${convertMsToMinSecs(
          Date.now() - SERVER_START_TIME
        )} and running on ${CONFIG.SERVER.IS_HTTPS ? "https" : "http"}://${
          CONFIG.SERVER.HOST
        }:${CONFIG.SERVER.PORT}`
      )
    )
  )
  .catch((err) => {
    wLog.error(err.message);
    process.exit(1);
  });
