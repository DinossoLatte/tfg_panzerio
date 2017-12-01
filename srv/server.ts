import * as webSocket from 'ws';

var server = new webSocket.Server({ port: 8080 });

server.on('connection', function connect(ws) {
    console.log("Connected with someone!");
    ws.on("message", function received(data) {
        console.log("Client said "+data);
    });

    ws.send("Hello!");

    ws.on("message", function conv(data) {
        if(data.includes("you?")) {
            ws.send("Fine, thanks");
        } else if(data.includes("Hoping")) {
            ws.send("How about you?");
        }
    })
});

var connection = new webSocket('ws://localhost:8080');

connection.on('open', function hello() {
    connection.send("Hello!");
})

var said_hi = false;

connection.on('message', function response(data) {
    console.log("Someone said something! It said: "+data);
    if(!said_hi) {
        connection.send("How are you?");
        connection.send("Hoping you're doing fine!");
    }
    said_hi = true;
});
