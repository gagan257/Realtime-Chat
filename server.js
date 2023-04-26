const http = require('http')
const express = require('express')
const app = express()
const socketio = require('socket.io')

const server = http.createServer(app)
const io = socketio(server)

io.on('connection',(socket)=>{
    console.log('connected with socket id = ', socket.id)

    // socket.on('msg_send', (data) => {
    //     io.emit('msg_rcvd',data) // emits data to all users
        
    //     // socket.broadcast.emit('msg_rcvd',data) // emits data to everyone (excluding you)
    // })

    socket.on('login' , (data) => {
        socket.join(data.username)
        socket.emit('logged_in')
    })
})


app.use('/',express.static(__dirname + '/public'))

server.listen(3344, ()=>{
    console.log('started on http://localhost:3344')
})

// socket.emit -> send data to any fix socket
// socket.broadcast.emit -> send data to everyone (except you)
// io.emit -> send data to everyone
// io.to('room name').emit(---) -> data will go to room i.e grp of users not all users