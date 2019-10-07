const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
// socket io needs server as parameter
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.static(publicDirectoryPath));


io.on('connection', (socket) => {
  console.log('New Websocket Connection');

  socket.on('join', (options, callback) => {
    const {error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }
    
    socket.join(user.room);

    socket.emit('message', generateMessage('Welcome!'));
    // send message to everyone in room
    socket.broadcast.to(user.room)
      .emit('message', generateMessage(`${user.username} has joined the room.`));

      callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    io.to('room').emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', (location, callback) => {
    io.emit('location', generateLocationMessage(location));
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', generateMessage(`${user.username} has left`));
    }
  })
});


server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});