const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require('cors')
const Route = require('./Routes.js');

const db = require('./DatabaseConnect');

app.use(cors())
app.use(express.json())
app.use("/api/user", Route)


db()

app.get('/', (req, res) => {
    res.send('<H1>Kearb socket</H1>');
});




io.on('connection', (socket) => {
  console.log('a user connected SocketChatApp', socket.id);
  
      User.create({ username, socketId: socket.id }, (err, user) => {
      if (err) throw err;
      console.log('User logged in:', user);
    });
    
    
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});



