let socket = io()

$('#loginBox').show()
$('#chatBox').hide()

$('#btnStart').click(() => { // snding username & password to server
    socket.emit('login', {
        username: $('#inpUsername').val(),
        password: $('#inpPassword').val()
    })
})

socket.on('logged_in',() => {
    $('#loginBox').hide()
    $('#chatBox').show()
})

socket.on('login_failed' , () => {
    window.alert('Username or password wrong')
})

$('#btnSendMsg').click(() => {
    socket.emit('msg_send', {
        to: $('#inpToUser').val(),
        msg: $('#inpNewMsg').val()
    })
})



// construct message for the user
socket.on('msg_rcvd',(data) => {
    $('#ulMsgs').append($('<li>').text(
        `[${data.from}] : ${data.msg}` // receiving data from server and display senders name
    ))
})