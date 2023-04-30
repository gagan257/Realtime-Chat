const http = require('http')
const express = require('express')
const app = express()
const socketio = require('socket.io')

const server = http.createServer(app)
const io = socketio(server)

let users = { // sample used as database
    'arnav':'agag123'
}

let socketMap = {} // map named socketMap(storing socket id & username key val pair)

io.on('connection',(socket)=>{
    console.log('connected with socket id = ', socket.id)

    function login(s,u) { // taking socket & username as input
        s.join(u)
        s.emit('logged_in')
        socketMap[s.id] = u // creating key value pair
        console.log(socketMap)
    }

    socket.on('login' , (data) => { // on receiving login event
        if(users[data.username]){ // id exists
            if(users[data.username] == data.password){ // id & pass found
                login(socket,data.username) // sending socket & username info
            } else{ // id correct but pass wrong
                socket.emit('login_failed')
            }
        } else{ // id not found (create new id & pass & login)
            users[data.username] = data.password
            login(socket,data.username) // sending socket & username info
        }
        console.log(users) // for our reff. how it works
    })

    // if username present sent to that user only else everyone
    socket.on('msg_send',(data) => {
        data.from = socketMap[socket.id] // finds which user is sending message from socket id in the map
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