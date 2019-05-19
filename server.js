import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
let users = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
  socket.on('message', data => {
    io.emit('newMessage', data)
  })

  socket.on('join', data => {
    console.log('got a data', data)
    socket.user = data
    users.push(socket.user)
    io.emit('userJoined', data)
  })

  socket.on('disconnect', data => {
    if (!socket.user) return
    users.splice(users.indexOf(socket.user), 1)
    console.log('someone left', data)
    io.emit('userDisconnected', data)
  })

  const updateUsernames = () => {
    socket.emit('getOnlineUsers')
  }
})

const server = http.listen(5000, () => {
  console.log('Server is running')
})
