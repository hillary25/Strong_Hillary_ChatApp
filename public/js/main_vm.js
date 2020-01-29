// Client side

// Imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

// Loading from node modules folder
// Use the same socket framework, and instantiate it here
const socket = io();

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

function appendMessage(message) {
    vm.messages.push(message);
}

const vm = new Vue({
    data: {
        socketID: "",
        message: "", // this is what we type in the browser, and it should submit on the browser window
        nickname: "",
        messages: [
            // {
            //     name: "HRS",
            //     content: "hello there!"
            // }
        ]
    },

    methods: {
        // Emit a message evnt to the server so that it van in turn send this to anyone who is connected
        dispatchMessage() {
            console.log('handle emit message');
            
            // The double pipe || is an "or"
            // If the first value is set, use it. Else use whatever comes after the "or" operator
            socket.emit('chat_message', { 
                content: this.message,
                name: this.nickname || "anonymous"
            })

            this.message = "";
        }
    },

    mounted: function() {
        console.log('vue is done mounting');
    },

    components: {
        newmessage: ChatMessage
    }
}).$mount("#app");

socket.addEventListener('connected', setUserId);
socket.addEventListener('disconnect', showDisconnectMessage);
socket.addEventListener('new_message', appendMessage);