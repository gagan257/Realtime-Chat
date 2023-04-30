const http = require('http')
const express = require('express')
const app = express()
const socketio = require('socket.io')

const server = http.createServer(app)
const io = socketio(server)

let users = { // sample used as database
    'arnav':'agag123'
}

io.on('connection',(socket)=>{
    console.log('connected with socket id = ', socket.id)

    socket.on('login' , (data) => { // on receiving login event
        if(users[data.username]){ // id exists
            if(users[data.username] == data.password){ // id & pass found
                socket.join(data.username)
                socket.emit('logged_in')
            } else{ // id correct but pass wrong
                socket.emit('login_failed')
            }
        } else{ // id not found (create new id & pass & login)
            users[data.username] = data.password
            socket.join(data.username)
            socket.emit('logged_in')
        }
        console.log(users) // for our reff. how it works
    })

    // if username present sent to that user only else everyone
    socket.on('msg_send',(data) => {
        if(data.to){
            io.to(data.to).emit('msg_rcvd',data)
        } else{
            socket.broadcast.emit('msg_rcvd',data) // send data back
        }
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