var express = require('express');
var app = express();

// Add socket here
const io = require('socket.io')();

const port = process.env.PORT || 3030;

// Tell express where our static files are (js, images, css, etc.)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`)
});

// Check to see how many people are connected to the chat app
let connected = [];

// Attach our chat server to our app
io.attach(server);

// Socket is two way communciation between client and server
io.on('connection', function(socket){ // socket is your connection
    // When user enters chat app
    console.log('a user has connected');

    connected.push(socket);

    socket.emit('connected', { sID: `${socket.id}`, message: 'new connection', connected: connected.length} );

    socket.on('chat message', function(msg){
        console.log('message: ', msg, 'socket:', socket.id);

        // Tell the connection manager (socket.io) to send this message to everyone
        // Anyone connected to our chat app will get this message (including the sender)
        io.emit('chat message', { id: `${socket.id}`, message: msg});
    });

    // When user refreshes, exits out chat app
    socket.on('disconnect', function(){
        console.log('a user has disconnected');
        connected.splice(connected.indexOf(socket), 1);
    });

    socket.on('typing', (data) => {
        io.emit('typing', data);
    });

    socket.on('stoptyping', () => {
        io.emit('stoptyping');
    });
})