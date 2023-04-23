let socket = io()

let boomBtn = document.getElementById('boom')
boomBtn.onclick = function () {
    socket.emit('boom')
}

socket.on('whizz', ()=>{
    let div = document.createElement('div')
    div.innerHTML = 'Whizz'
    document.body.appendChild(div)
})