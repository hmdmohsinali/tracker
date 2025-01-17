const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const server = http.createServer(app);

const io = socketio(server);

io.on("connection", function(socket) {
    socket.on('send-location', function(data) {
        io.emit('receive-location', { id: socket.id, ...data });
    });

    socket.on("disconnect", function() {
        io.emit('user-disconnected', socket.id);
    });
});


app.set('view engine', 'ejs')


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index.ejs');  
});


server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
