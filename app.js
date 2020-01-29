var express = require('express');
var app = express();

// Add socket here
const io = require('socket.io')();

const port = process.env.PORT || 3030;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// Attach our chat server to our app
io.attach(server);

// Socket is two way communciation between client and server
io.on('connection', function(socket) { // socket is your connection
    // When user enters chat app
    console.log('a user has connected');
    socket.emit('connected', {sID: socket.id, message: "new connection"}); // sID is a variable called socket ID

    socket.on('chat_message', function(msg) {
        console.log(msg); // let's see wha the payload is from the client side

        // Tell the connection manager (socket.io) to send this message to everyone
        // Anyone connected to our chat app will get this message (including the sender)
        io.emit('new_message', { id: socket.id, message: msg })
    })
    
    // When user refreshes, exits out chat app
    socket.on('disconnect', function() {
        console.log('a user has disconnected');
    })
})