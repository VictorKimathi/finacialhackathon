"use client";
import React, { useState, useEffect } from 'react';
import './thinking.css';
import AssistantOutlinedIcon from '@mui/icons-material/AssistantOutlined';
import { Box, Paper, Typography, Chip, Select, MenuItem, IconButton, Stack } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import ChatMessages from '../../components/ChatMessage';
import ChatInput from '../../components/ChatInput';
import axios from 'axios';
import { useAuth } from '../../provider/auth-provider';

const suggestions = [
  "How can I save more based on my recent spending?",
  "What are some budgeting tips for me?",
  "How much should I invest this month?",
  "Any advice on reducing my grocery expenses?",
];

const Chat = () => {
  const { getToken } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState('normal');
  const [isListening, setIsListening] = useState(false);

  // Initialize SpeechRecognition API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        setNewMessage(event.results[0][0].transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }
  }, [recognition]);

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
    } else {
      alert("Speech Recognition API not supported in this browser.");
    }
  };

  const submitNewMessage = async () => {
    if (!newMessage.trim()) return;
    setIsLoading(true);
    setMessages(prevMessages => [...prevMessages, { role: 'user', content: newMessage }]);

    try {
      const response = await axios.post(
        `${base_url}/api/chat/send_chat/`,
        { message: newMessage, mode: chatMode },
        {
          headers: {
            "Authorization": `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      const assistantReply = response.data.response;
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: assistantReply }]);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: "Error: Unable to get a response from the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setNewMessage(suggestion);
    submitNewMessage();
  };

  const handleChatModeChange = (event) => {
    setChatMode(event.target.value);
  };

  const LoadingDots = () => (
    <div className="loading-dots">
      <div className="dot blue"></div>
      <div className="dot green"></div>
      <div className="dot blue"></div>
      <div className="dot green"></div>
    </div>
  );

  return (
    <Box sx={{ flexGrow: 1, padding: 2, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography color='white' variant="h5">Welcome to Finac.AI</Typography>
        <Select
          value={chatMode}
          onChange={handleChatModeChange}
          size="small"
          sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="roast">Roast</MenuItem>
          <MenuItem value="hyper">Hyper</MenuItem>
        </Select>
      </Box>

      {/* Suggestions Section */}
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', mb: 2 }}>
        {suggestions.map((suggestion, index) => (
          <Chip 
            label={suggestion} 
            onClick={() => handleSuggestionClick(suggestion)} 
            key={index}
            variant="outlined"
            color="white"
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Box>

      {/* Chat Messages Section */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
        <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
          <ChatMessages messages={messages} isLoading={isLoading} />
          {isLoading && <LoadingDots />}
        </Paper>
      </Box>

      {/* Chat Input Section */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: 'background.paper', 
          padding: 1, 
          borderRadius: 1, 
          width: '100%' // Occupies full width
        }}
      >
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          isLoading={isLoading}
          submitNewMessage={submitNewMessage}
        />
        <IconButton onClick={toggleListening} color={isListening ? 'secondary' : 'primary'} sx={{ ml: 1 }}>
          <MicIcon color="secondary" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chat;