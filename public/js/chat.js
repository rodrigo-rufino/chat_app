const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

socket.on('location', (location) => {
  console.log(location);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
 e.preventDefault();
 
 const message = e.target.elements.message.value;

 socket.emit('sendMessage', message, (error) => {
  if (error) return console.log(error);

   console.log('Message delivered!');
 });
});

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const geoMessage = `A user is sharing its location at 
    https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;

    socket.emit('sendLocation', geoMessage, () => {
      console.log('Location shared!');
    });
  });

});