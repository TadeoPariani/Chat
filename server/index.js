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
let listaConected = []





io.on('connection', (socket) => {

  const generateRandomUsernames = () => {
    const usernames = [];
    const adjectives = ['Happy', 'Crazy', 'Silly', 'Funny', 'Clever', 'Brave', 'Kind', 'Charming', 'Witty', 'Lucky'];
    const animals = ['Cat', 'Dog', 'Elephant', 'Lion', 'Monkey', 'Tiger', 'Giraffe', 'Penguin', 'Kangaroo', 'Zebra'];
  
    for (let i = 0; i < 1; i++) {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const animal = animals[Math.floor(Math.random() * animals.length)];
      const username = `${adjective}${animal}`;
      usernames.push(username);
    }
    return usernames;
  };
  
  const username = generateRandomUsernames();

  listaConected.push(username)
  console.log('user conected, ' + 'id: ' + socket.id + "   lista:  " + listaConected); 

  socket.on("message", function (message) {
    console.log(message);
    socket.broadcast.emit("message", {
      body: message,
      from: "> " + username + ": "
    });
  })

  socket.once('join', () => {
    io.emit('userList', listaConected, username);
  });

  socket.once('disconnect', () => {
    for (let i = 0; i < listaConected.length; i++) {
      if (listaConected[i] === username) {
        listaConected.splice(i, 1);
        socket.emit(listaConected)
        console.log(listaConected)
        break;
      }
    }
    console.log('El cliente se ha desconectado');
    io.emit('disconnected', listaConected, username);
  });
});

server.listen(PORT, () => {
  console.log('listening on *: ' + PORT); 
});

