const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');

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

  socket.emit('message', 'Welcome!');
  socket.broadcast.emit('message', 'A new user has joined the conversation!');;

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)){
      return callback('Profanity is not allowed!');
    }
    
    io.emit('message', message);
    callback();
  });

  socket.on('sendLocation', (location, callback) => {
    io.emit('location', location);
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the conversation');
  })
});


server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});