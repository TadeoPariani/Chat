import React from 'react';
import io from 'socket.io-client'
import { useState, useEffect } from 'react';
import "./styles.css"

const socket = io('http://localhost:4000')

const App = () => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  
  const handleSubmit = (event) => {
    event.preventDefault()
    socket.emit("message", message)
    const newMessage ={
      body: message,
      from: "> Me:  "
    }
    setMessages([...messages, newMessage])
    setMessage("")
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

  return ( 
    <div className='form-container' id="root">
      <div class="chat-container">
        {messages.map((message,  index) => (
          <div class="message" key={index}>
            <p>{message.from} {message.body}</p>
          </div>
        ))}
      </div>
      <h1 id="root"> hello </h1>
      <form  onSubmit={handleSubmit} >
        <div className='form-field'>
          <input type="text" onChange={ e => setMessage(e.target.value)} value={message}></input>
          <button class="form-submit-btn"> Enviar </button>
        </div>
      </form>
    </div>
  );
};

export default App;

