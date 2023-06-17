import express from 'express';
import { Server as socketServer } from 'socket.io';
import http from 'http';
import cors from 'cors';
import {PORT} from './config.js';

const app = express();
const server = http.createServer(app);
const io = new socketServer(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('user conected, ' + 'id: ' + socket.id); 
  socket.on("message", function (message) {
    console.log(message);
    socket.broadcast.emit("message", message);
  })
});

server.listen(PORT, () => {
  console.log('listening on *: ' + PORT); 
});