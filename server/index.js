const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 3001

const router = require('./router')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
    // console.log('We have a new connection!!')
    socket.on('join', ({name, room}, callback) => {
        // console.log(name, room);
        const { error, user} = addUser({id: socket.id, name, room});

        if(error) return callback(error);

        socket.join(user.room);

        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`});

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();
    }); 


    socket.on('disconnect', () => {
        console.log('User had left!!!');
    })
})



server.listen(process.env.PORT || 3001, () => console.log(`Server has started. ${PORT}`)); 

//https://www.youtube.com/watch?v=ZwFA3YMfkoc&t=16s


