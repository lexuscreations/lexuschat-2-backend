const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
  SERVER: {
    PORT: process.env.PORT || 3000,
    HOST: "localhost",
    IS_HTTPS: false,
  },
  APP_CONFIG: {
    showDevLogsBoolean: false,
  },
  DB: {
    MONGO_DB_USERNAME: process.env.MONGO_DB_USERNAME,
    MONGO_DB_PASSWORD: process.env.MONGO_DB_PASSWORD,
    MONGO_DB_CLUSTER: process.env.MONGO_DB_CLUSTER,
    MONGO_DB_LOCAL_DATABASE_NAME: "lexuschat-2",
    MONGO_DB_DATABASE_NAME: process.env.MONGO_DB_DATABASE_NAME,
    get MONGO_CONNECTION_URL() {
      if (!process.env.NODE_ENV === "PROD")
        return "mongodb://localhost:27017/lexuschat-2";
      return `mongodb+srv://${this.MONGO_DB_USERNAME}:${this.MONGO_DB_PASSWORD}@${this.MONGO_DB_CLUSTER}.xyztv9m.mongodb.net/${this.MONGO_DB_DATABASE_NAME}?retryWrites=true&w=majority`;
    },
  },
  LOGGER: {
    logLevels: {
      fatal: 0,
      error: 1,
      warn: 2,
      info: 3,
      debug: 4,
      trace: 5,
    },
    loggerPath: path.resolve(__dirname, "../logs/"),
  },
};
