import './App.css';
import { useState, useEffect, useRef } from "react"
const bc = new BroadcastChannel("chat")

function App() {
  const inputRef = useRef()
  const [messages, setMessages] = useState([])

  useEffect(() => {
    bc.onmessage = (msg) => {
      addMessageToContainer("Another Tab", msg.data)
    }

    return () => {
      bc.close()
    }
  }, [])

  const sendMessage = (e) => {
    e.preventDefault()
    const message = inputRef.current.value
    if (message.trim().length > 0) {
      bc.postMessage(message)
      addMessageToContainer("Current Tab", message)
      inputRef.current.value = ""
    } else {
      window.alert("Message is required")
    }
  }

  const addMessageToContainer = (tab, content) => {
    const newMessage = {
      id: Date.now(),
      tab,
      content
    }
    setMessages(prevMessages => [...prevMessages, newMessage])
  }

  return (
    <div className="app-container">
      <form onSubmit={(e) => sendMessage(e)}>
        <input ref={inputRef} type="text" placeholder='Enter message here'/>
        <button>send</button>
        <div className="messages-container">
          {messages.length === 0 ? <p>No Messages</p> : null}
          {messages.map(msg => {
            return <p key={msg.id}>{msg.tab}: {msg.content}</p>
          })}
        </div>
      </form>
    </div>
  );
}

export default App;
