const socket = io();

// Elements
const $messages = document.querySelector('#messages');
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');

const $sendLocationButton = document.querySelector('#send-location');


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });


const dateFormat = 'h:mm:ss a';

socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format(dateFormat)
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('location', (location) => {
  console.log(location);
  const html = Mustache.render(locationTemplate, {
    location: location.text,
    createdAt: moment(location.createdAt).format(dateFormat)
  });
  $messages.insertAdjacentHTML('beforeend', html);
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
    const geoMessage = `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;

    socket.emit('sendLocation', geoMessage, () => {
      $sendLocationButton.removeAttribute('disabled');
      console.log('Location shared!');
    });
  });
});

socket.emit('join', { username, room });