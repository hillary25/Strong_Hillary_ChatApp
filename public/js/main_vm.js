// Client side

// Imports always go first - if we're importing anything

// Loading from node modules folder
// Use the same socket framework, and instantiate it here
const socket = io();

// The packet is whatever data we send through with the connect event
// from the server
function setUserId(packet) {
    //debugger;
    console.log(packet);
}

function showDisconnectMessage() {
    console.log('a user disconnected');
}

socket.addEventListener('connected', setUserId);
socket.addEventListener('disconnect', showDisconnectMessage)