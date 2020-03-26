// Client side

// Imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

// Loading from node modules folder
// Use the same socket framework, and instantiate it here
const socket = io();

function logConnect({sID, message, connected}){
    //debugger;
    console.log(sID, message);
    vm.socketID = sID;
    vm.connected = connected;

    var newUser = new Object();
        socket.emit('chat message', { content: "Someone new has entered the chat!", name: "Chat App", object: newUser});
}

// The packet is whatever data we send through with the connect event
// from the server

// This is data destructuring. Go look it up on MDN
// Get structured data, pick it apart and only use the value we want (the ID that we want)
function setUserId({sID}) {
    //debugger;
    console.log(sID);
    vm.socketID = sID;
}

function showDisconnectMessage() {
    console.log('a user disconnected');
}

function appendMessage(message){
    vm.messages.push(message)
}

// Create Vue instance
const vm = new Vue ({
    data:{
        socketID: "",
        nickname: "",
        message: "",
        connected: '',
        typing: false,
        messages: []
    },

    watch: {
        message(value) {
          value ? socket.emit('typing', this.nickname) : socket.emit('stoptyping');
        }
      },
    
      created() {
        socket.on('typing', (data) => {
          console.log(data);
          this.typing = data || 'Anonymous';
        });
        socket.on('stoptyping', () => {
          this.typing = false;
        });
      },

    methods: {
        // Emit a message event to the server so that it van in turn send this to anyone who is connected
        dispatchMessage(){
            console.log('handle emit message');

            // The double pipe || is an "or"
            // If the first value is set, use it. Else use whatever comes after the "or" operator
          
            var date = new Date();
            //var n = date.getHours();
            socket.emit('chat message', { content: this.message, name: this.nickname || "Anonymous", time: date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })});

            //reset the message field
            this.message = "";
        },

        isTyping() {
            socket.emit('typing', this.nickname);
          },
          
    },

    mounted: function() {
      console.log('vue is done mounting');
  },

    components: {
        newmessage: ChatMessage
    }
    
}).$mount("#app");

socket.on('connected', logConnect);
socket.addEventListener('chat message', appendMessage);
socket.addEventListener('disconnect', appendMessage);
// socket.addEventListener('connected', setUserId);
// socket.addEventListener('disconnect', showDisconnectMessage);
// socket.addEventListener('new_message', appendMessage);