import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatBot() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', message: 'Hello! How can I help you with your potatoes today?' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', message: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://apicapibara.onrender.com/assistant/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      const botMessage = { sender: 'bot', message: data.assistant_response || 'Sorry, I could not understand that.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { sender: 'bot', message: 'Error connecting to server.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <img src="/images/papa.jpg" alt="Potato" style={styles.avatar} />
          <h2 style={styles.title}>Potato ChatBot</h2>
          <button style={styles.btnBack} onClick={() => navigate('/')}>
            ← Back Home
          </button>
        </div>
      </header>

      <div style={styles.chatContainer}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage)
            }}
          >
            {msg.message}
          </div>
        ))}
        {loading && <div style={styles.botMessage}>Typing...</div>}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
      </div>
    </div>
  );
}

export default ChatBot;

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f8f9fa',
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    padding: '20px 16px',
    background: '#764ba2',
    color: 'white',
    borderBottomLeftRadius: '20px',
    borderBottomRightRadius: '20px'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '2px solid white',
    objectFit: 'cover'
  },
  title: {
    flex: 1,
    textAlign: 'center',
    margin: 0,
    fontSize: '1.5em',
    fontWeight: '700',
    color: 'white',
    textShadow: '0 2px 6px rgba(0,0,0,0.3)'
  },
  btnBack: {
    padding: '8px 14px',
    background: 'white',
    color: '#764ba2',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease'
  },
  chatContainer: {
    flex: 1,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowY: 'auto'
  },
  message: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '1em',
    wordWrap: 'break-word',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  userMessage: {
    alignSelf: 'flex-end',
    background: '#667eea',
    color: 'white',
    borderBottomRightRadius: '4px'
  },
  botMessage: {
    alignSelf: 'flex-start',
    background: '#e0e0e0',
    color: '#2c3e50',
    borderBottomLeftRadius: '4px'
  },
  inputContainer: {
    display: 'flex',
    padding: '12px',
    gap: '8px',
    background: 'white',
    borderTop: '1px solid #ddd'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    fontSize: '1em',
    outline: 'none'
  },
  sendBtn: {
    padding: '12px 20px',
    background: '#764ba2',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease'
  }
};
