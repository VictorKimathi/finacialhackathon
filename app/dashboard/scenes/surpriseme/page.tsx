"use client";
import React, { useState, useEffect } from 'react';
import './thinking.css';
import { Box, Paper, Typography, IconButton, Stack, Button } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../provider/auth-provider';
import { base_url } from "../../../../env"

// The fun prompt to send to Gemini
const promptMessage = `
Hey Gemini, let's surprise our user with some fun, engaging, and slightly cheeky personalized financial insights! Keep it light-hearted and humorous while still being useful. You’re a friendly, funny, and savvy financial advisor, so sprinkle in some jokes or playful comments that make the user smile, but still offer real, actionable advice. For each of the following types of insights, come up with 5 unique sentences that balance humor with financial wisdom.

1. Hidden Savings Tip: Give a surprising tip on how the user can save money without feeling like they’re sacrificing their lifestyle.
2. Daily Financial Fact: Share an interesting (and maybe surprising) fact about personal finance that would make the user go, “Huh, didn’t know that!”
3. Unexpected Expense Alert: Point out a potential issue in their spending habits in a funny way. You can be playful, but still offer a nudge in the right direction.

Example tone: “Okay, let’s talk savings! You could save big money without even noticing, like switching your internet plan to a cheaper provider. Did you know you can get the same Netflix bingeing speeds for half the price? Time to channel that inner budget ninja!”
Include Emoji in your response 
Be fun, be smart, and keep it relevant to the user’s financial situation. Go ahead, surprise them with some financial fun!
`;

//  npm run build
// transactionform

const Chat = () => {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleMagicButtonClick = async () => {
    setIsLoading(true);
  
    // Clear the previous assistant response before adding the new one
    setMessages([{ role: 'user', content: "Surprise me with some fun financial insights!" }]);
  
    try {
      const response = await axios.post(
        `${base_url}/api/chat/send_chat/`, // Template string in use
        { message: promptMessage, mode: 'normal' },
        {
          headers: {
            "Authorization": `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const assistantReply = response.data.response;
  
      // Set the new assistant response, keeping only the latest one
      setMessages([
        { role: 'user', content: "Surprise me with some fun financial insights!" },
        { role: 'assistant', content: assistantReply },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        { role: 'user', content: "Surprise me with some fun financial insights!" },
        { role: 'assistant', content: "Oops! Something went wrong. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
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
    <Box className="flex flex-col h-full p-4 bg-black text-white">
      {/* Header Section */}
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" color="white">Welcome to Finac.AI</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleMagicButtonClick}
          className="text-black p-3 rounded-full hover:bg-purple-600 transition-all"
        >
          💥 Surprise Me!
        </Button>
      </Box>

      {/* Chat Messages Section */}
      <Box className="flex-grow overflow-y-auto mb-4">
        <Paper className="p-4 rounded-lg bg-gray-800 shadow-md">
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              className={`mb-4 p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-900' : 'bg-green-900'}`}
            >
              <Typography variant="body1" color="textPrimary">{msg.content}</Typography>
            </Box>
          ))}
          {isLoading && <LoadingDots />}
        </Paper>
      </Box>
    </Box>
  );
};

export default Chat;
