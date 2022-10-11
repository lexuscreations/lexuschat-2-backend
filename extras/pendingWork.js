// Capture 500 errors
app.use((err, req, res, next) => {
  res.status(500).send("Could not perform the calculation!");
  wLog.error(
    `${err.status || 500} - ${res.statusMessage} - ${err.message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  );
});

// Capture 404 erors
app.use((req, res, next) => {
  res.status(404).send("PAGE NOT FOUND");
  wLog.error(
    `400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );
});

process.on("uncaughtException", (err) =>
  console.log("uncaught exception: ", err)
);
process.on("unhandledRejection", (reason, p) =>
  console.log("unhandled rejection: ", reason, p)
);
