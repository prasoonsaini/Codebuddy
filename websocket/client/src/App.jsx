import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef();
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "blue",
          username: document.getElementById('user')?.value
        }
      }))
    }
    return () => {
      ws.close()
    }
  }, []);

  return (
    <>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input id="user" type="text" placeholder='username' />
      <input id="msg" type="text" />
      <button onClick={() => {
        const message = document.getElementById("msg")?.value;
        const username = document.getElementById("user")?.value;
        wsRef.current.send(JSON.stringify({
          type: "message",
          payload: {
            message: message,
            username: username
          }
        }))
      }}>Send message</button>
    </>
  );
}

export default App
