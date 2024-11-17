"use client";
import React, { useEffect, useRef } from 'react';
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Markdown from "react-markdown";
import Spinner from "./Spinner";
import userIcon from "../../../public/idea.png";
import errorIcon from "../../../public/error.png"; // Ensure the path is correct

const ChatMessages = ({ messages, isLoading }) => {
  const scrollContentRef = useRef(null);
  const theme = useTheme();

  const scrollToBottom = () => {
    if (scrollContentRef.current) {
      scrollContentRef.current.scrollTop = scrollContentRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollContentRef}
      style={{
        overflowY: "auto",
        height: "60vh",
        padding: "16px",
        background: theme.palette.background.paper,
        borderRadius: "8px",
        boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
      }}
    >
      {messages.map(({ role, content, loading, error }, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: "16px",
            flexDirection: role === "assistant" ? "row-reverse" : "row",
          }}
        >
          {role === "user" && (
            <Image
              src={userIcon}
              alt="user icon"
              width={32}
              height={32}
              style={{
                borderRadius: "50%",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                marginRight: "8px",
              }}
            />
          )}
          <div
            style={{
              padding: "16px",
              maxWidth: "300px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              backgroundColor:
                role === "assistant"
                  ? theme.palette.primary.light
                  : theme.palette.background.default,
              color: theme.palette.text.primary,
            }}
          >
            <div style={{ fontSize: "14px" }}>
              {loading && !content ? (
                <Spinner />
              ) : role === "assistant" ? (
                <Markdown>{content}</Markdown>
              ) : (
                <div>{content}</div>
              )}
            </div>
            {error && (
              <div
                style={{
                  color: "red",
                  display: "flex",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                <Image
                  src={errorIcon}
                  alt="error icon"
                  width={16}
                  height={16}
                  style={{ marginRight: "4px" }}
                />
                <span>Error generating the response</span>
              </div>
            )}
          </div>
        </div>
      ))}
      {isLoading && <Spinner />}
    </div>
  );
};

export default ChatMessages;
