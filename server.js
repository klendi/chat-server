import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
let users = []
const PORT = process.env.PORT || 5000

io.on('connection', socket => {
  socket.on('message', data => {
    io.emit('newMessage', data)
  })

  socket.on('join', data => {
    console.log('got a entry', data)
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

const server = http.listen(PORT, () => {
  console.log('Server is running at port ', PORT)
})
