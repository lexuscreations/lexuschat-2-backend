const { connect, connection } = require("mongoose");
const {
  DB: { MONGO_CONNECTION_URL },
} = require("../config");
const { loggerV1: wLog } = require("../utils/");

const connectDB = () => {
  return new Promise((res, rej) => {
    connect(MONGO_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    connection.once("open", () => {
      wLog.info("Mongodb Connected...!");
      res({
        initModels: () => {
          require("../models/");
        },
      });
    });
  });
};

module.exports = { connectDB };
