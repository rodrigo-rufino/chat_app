const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');

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

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });
  
  socket.on('sendLocation', (location) => {
    io.emit('location', location);
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the conversation');
  })
});


server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});