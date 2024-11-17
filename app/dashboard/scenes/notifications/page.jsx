"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { base_url } from "../../../../env.js";
import { useAuth } from '../../provider/auth-provider';

// Helper function to create a prompt template based on transactions
const createPromptFromTransactions = (transactions) => {
  return `Based on the following recent transactions, generate notifications:
    ${transactions.map((txn, index) => (
      `Transaction ${index + 1}: Type: ${txn.type}, Amount: $${txn.amount}, Date: ${txn.date}, Category: ${txn.category}.`
    )).join(" ")}
  Generate concise notifications with a focus on financial insights, like large deposits, savings goals, or upcoming bills.`;
};

const Notifications = () => {
  const { getToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [creditScore, setCreditScore] = useState(720); // Dummy credit score data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch transactions from the API
        const txnResponse = await fetch(`${base_url}/api/transactions/`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        });

        if (!txnResponse.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const transactions = await txnResponse.json();
        console.log("Transactions data:", transactions);

        // Create prompt for AI based on transactions
        const prompt = createPromptFromTransactions(transactions);

        // Send the prompt to the AI service
        const aiResponse = await axios.post(
          `${base_url}/api/chat/send_chat/`,
          { message: prompt, mode: 'normal' },
          {
            headers: {
              "Authorization": `Token ${getToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Make sure the response is an array of strings
        const response = Array.isArray(aiResponse.data.response)
          ? aiResponse.data.response
          : [aiResponse.data.response];

        setNotifications(response);
        console.log("Notifications data from AI:", response);

      } catch (error) {
        console.log("Error generating notifications:", error);
        setNotifications(["There was an error fetching notifications. Please try again later."]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [getToken]);

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div style={{ margin: 50 }}>
      <div style={{
        backgroundColor: '#1f2937',
        border: '1px solid #4b5563',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '400px',
        color: '#fff',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0' }}>
            Recent Notifications
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            Stay updated on your financial activities
          </p>
        </div>
        <div style={{ color: '#9ca3af' }}>
          {notifications.length > 0 ? (
            notifications.join(', ') // Join notifications as a string
          ) : (
            <p>No notifications available.</p>
          )}
        </div>

        <div style={{ marginTop: '16px' }}>
          <p>Credit Score: <strong>{creditScore}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
