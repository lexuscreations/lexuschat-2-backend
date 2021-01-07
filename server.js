const express = require('express')
const app = express()

require('dotenv').config()

const port = process.env.PORT || 3000

app.use(express.static('public'))

const dbConnect = require('./db')
dbConnect()

const Chat = require('./models/chat')

app.use(express.json())

// api routes
app.post('/api/chats', (req, res) => {
    const chat = new Chat({
        username: req.body.username,
        chat: req.body.chat
    })
    chat.save().then(response => {
        res.send(response)
    })

})

app.get('/api/chats', (req, res) => {
    Chat.find().then((chats) => {
        res.send(chats)
    })
})

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


// realtime communication - socket.io
let io = require('socket.io')(server)

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`)

    // broadcast incomming chats event
    socket.on('chats', (data) => {
        data.time = Date()
        socket.broadcast.emit('chats', data)
    })

    // broadcast user typing event
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    })

    // New User Connected
    socket.on('userConnected', (uName, usermsg) => {
        socket.broadcast.emit('userConnected', uName, usermsg)
    })
})