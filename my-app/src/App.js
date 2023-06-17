import React from 'react';
import io from 'socket.io-client'
import { useState, useEffect } from 'react';


const socket = io('http://localhost:4000')


const App = () => {

  const [message, setMessage] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    socket.emit("message", message)
    setMessage("")
    console.log(message)
  }

  useEffect(() => {
    const receiveMessage = message =>{
      console.log(message)
    }
    socket.on("message", receiveMessage)

    return() => {
      socket.off("message", receiveMessage)
    }
  }, [])

  return ( 
    <div className='App' id="root">
      <h1 id="root"> hello </h1>


      <form  onSubmit={handleSubmit} >
        <input type="text" onChange={ e => setMessage(e.target.value)} value={message}></input>
        <button ></button>
      </form>

      

    </div>
  );
};

export default App;
