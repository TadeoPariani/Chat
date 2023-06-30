import React from 'react';
import io from 'socket.io-client'
import { useState, useEffect } from 'react';
import "./styles.css"
const socket = io('http://localhost:4000')

const App = () => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [lista, setLista] = useState([]);
  const [userStatus, setUserStatus] = useState()
  const [showModalConection, setShowModalConection] = useState(false);
  const [modalTypeConection, setModalTypeConection] = useState(null);
  const [showModalFull, setShowModalFull] = useState(false);
  
  const handleSubmit = (event) => {
    event.preventDefault()
    socket.emit("message", message)
    const newMessage ={
      body: message,
      from: "> Me:  "
    }
    setMessages([...messages, newMessage])
  }

  useEffect(() => {
    const receiveMessage = message =>{
      setMessages([ ...messages, message])
    }
    socket.on("message", receiveMessage)
    return() => {
      socket.off("message", receiveMessage)
    }
  }, [messages])

  useEffect(() => {
    socket.emit('join', socket.id);
    socket.on("userList", (users, username, mensajesAnteriores) => {
      if (users.length > 3){
        setShowModalFull(true)
      }else{
        setShowModalFull(false)
      }
      setModalTypeConection('connected');
      setLista(users);
      setMessages(mensajesAnteriores);
      setShowModalConection(true);
      setUserStatus(username)
      setTimeout(() => {
        setShowModalConection(false);
        setUserStatus('');
        setModalTypeConection(null);
      }, 4000);
    });
  });

  useEffect(() => {
    socket.on("disconnected", (users, username) => {
      if (users.length > 3){
        setShowModalFull(true)
      }else{
        setShowModalFull(false)
      }
      setModalTypeConection('disconnected');
      setLista(users);
      setShowModalConection(true);
      setUserStatus(username)
      setTimeout(() => {
        setShowModalConection(false);
        setUserStatus('');
        setModalTypeConection(null);
      }, 4000);
    });
  });
  
  return ( 
    <div className='form-container' id="root">
      <div className='row'>
            {showModalFull && (
              <div className='modal'>
                <div className='modal-content'>
                  <div>Hay mas de tres Usuarios Conectados</div>
                </div>
              </div>
            )}
        <h1 id="root"> 4Chin </h1>
        {showModalConection && (
        <div>
          {modalTypeConection === 'connected' && (
            <div className='connectMessage'>
              <p>Conectado: {userStatus}</p>
            </div>
          )}
          {modalTypeConection === 'disconnected' && (
            <div className='disconnectMessage'>
            <p>Desconectado {userStatus}</p>
          </div>
          )}
        </div>
      )}
      </div>
      <div className='row'>
        <h3>Usuarios Conectados: </h3>
        <ul>
          {lista.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
        <div class="chat-container">
          {messages.map((message,  index) => (
            <div class="message" key={index}>
              <p>{message.from} : {message.body}</p>
            </div>
          ))}
        </div>
      </div>
    <div>
    <div>
    </div>
    <form onSubmit={handleSubmit} >
          <div className='form-field'>
            <input type="text" 
            onChange={ e => setMessage(e.target.value)} value={message} setIsTyping={true}></input>
            <button class="form-submit-btn"> Enviar </button>
          </div>
    </form>
    </div>
    </div>
  );
};
export default App;