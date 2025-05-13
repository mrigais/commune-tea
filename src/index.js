//This file is all things server
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const express = require('express');

//setting up the express server
const app = express();
const server = http.createServer(app)
const io = socketio(server, {
    cors:{
        origin: 'http://localhost:5173', // or whatever your React app is running on
        methods: ['GET', 'POST'],
    }
}) 
//to make socketio to work with the given server *requires http server
//also creates a file to be served up for clients to use socketio 


const port = process.env.PORT || 3000
const publicDir = path.join(__dirname,'../public')

app.use(express.static(publicDir))

io.on('connection', (socket)=>{//runs for each connection
     console.log('NEW SOCKET CONNECTION ESTABLISHED')

     socket.emit('message', 'WELCOME!') //emits to that particular connection
     socket.broadcast.emit('message', 'A new user has joined!')//emits to every other connection

     socket.on('sendMessage', (message, cb)=>{
        io.emit('message', message)
        cb('testing message'); 
        //cb - you can provide params to this callback, and use that param in client side and send the data back and forth
        //this cb acts as a acknowledgement form the server side that the message was received.
     })
     socket.on('shareLocation', (coords, cb)=>{
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)

        if(!coords.latitude || !coords.longitude){
            return cb('Something is missing')
        }
        cb(coords)

     })

     socket.on('disconnect', ()=> {
        io.emit('message', 'A user has left')
     })
})


server.listen(port, ()=>{
    console.log(`App is listening at ${port}!`)
})