const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');

const $sendLocationButton = document.querySelector('#send-location');

socket.on('message', (message) => {
  console.log(message);
});

socket.on('location', (location) => {
  console.log(location);
});

$messageForm.addEventListener('submit', (e) => {
 e.preventDefault();
 
 $messageFormButton.setAttribute('disabled', 'disabled');

 const message = e.target.elements.message.value;

 socket.emit('sendMessage', message, (error) => {
  
  $messageFormButton.removeAttribute('disabled');
  $messageFormInput.value = '';
  $messageFormInput.focus();

  if (error) return console.log(error);

  console.log('Message delivered!');
 });
});

$sendLocationButton.addEventListener('click', () => {
  $sendLocationButton.setAttribute('disabled', 'disabled');

  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const geoMessage = `A user is sharing its location at 
    https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;

    socket.emit('sendLocation', geoMessage, () => {
      $sendLocationButton.removeAttribute('disabled');
      console.log('Location shared!');
    });
  });

});