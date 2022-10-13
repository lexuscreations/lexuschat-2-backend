const { loggerV1: wLog } = require('../utils/');

const init = (IO) => {
  IO.on('connection', (socket) => {
    wLog.info(`New connection: ${socket.id}`);

    socket.on('chats', (data) => {
      data.time = Date();
      socket.broadcast.emit('chats', data);
    });

    socket.on('ping', (data) => {
      socket.emit('pong', new Date().toUTCString());
    });

    socket.on('typing', (data) => {
      socket.broadcast.emit('typing', data);
    });

    socket.on('userConnected', (uName, usermsg) => {
      socket.broadcast.emit('userConnected', uName, usermsg);
    });
  });
};

module.exports = { init };
