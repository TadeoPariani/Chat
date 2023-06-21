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
  
  listaConected.push(socket.id)
  console.log('user conected, ' + 'id: ' + socket.id + "   lista:  " + listaConected); 

  socket.on("message", function (message) {
    console.log(message);
    socket.broadcast.emit("message", {
      body: message,
      from: "Anon: "
    });
  })

  // Enviar la lista al cliente cuando se conecte
  socket.emit('lista', listaConected);

  socket.on('disconnect', () => {
    console.log('El cliente se ha desconectado');
  });

  // socket.on("lista", function () {
  //   console.log("ee");
  //   socket.broadcast.emit("lista", {
  //     body: lista,
  //   });
  // })

  socket.on("disconnect", function (message) {
    for (let i = 0; i < listaConected.length; i++) {
      if (listaConected[i] === socket.id) {
        listaConected.splice(i, 1);
        break;
      }
    }
    message = `${socket.id} se ha desconectado...`
    socket.broadcast.emit("userDisconnected", {
      body: message
    });
    console.log("userDisconnected" + " id: " + socket.id + " lista: " + listaConected);
  });

});

server.listen(PORT, () => {
  console.log('listening on *: ' + PORT); 
});