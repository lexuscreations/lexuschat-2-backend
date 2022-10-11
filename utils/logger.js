const { createLogger, format, transports } = require("winston");
const {
  LOGGER: { logLevels, loggerPath },
  APP_CONFIG: { showDevLogsBoolean },
} = require("../config");
const path = require("path");

const loggerOption = {
  levels: logLevels,
  format: format.combine(
    format.label({
      label: `🏷️`,
    }),
    format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    format.printf(
      (info) =>
        `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`
    ),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.resolve(loggerPath, "file.log") }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: path.resolve(loggerPath, "exceptions.log"),
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: path.resolve(loggerPath, "rejections.log"),
    }),
  ],
};

const Logger = (version) =>
  createLogger({
    ...loggerOption,
    defaultMeta: {
      service: `lexuschat-2_${version}`,
    },
  });

const loggerV1 = {};
Object.keys(logLevels).forEach((val) => {
  loggerV1[val] = (msg) => {
    showDevLogsBoolean && console.log(msg);
    Logger("v1")[val](msg);
  };
});

module.exports = {
  loggerV1,
};
