"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Chip, Button, Modal } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../provider/auth-provider';
import Header from "../../components/Header";
import { useRouter } from 'next/navigation';

const fetchData = async (url, setState, transformData = data => data) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    setState(transformData(data));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const generateGeminiPrompt = (stocksData, userFinances) => `
  As an investment advisor, review the following comprehensive data and provide a detailed, well-rounded investment strategy. 

  Consider:
  1. Asset diversification
  2. Risk tolerance based on current debt and account balance
  3. Liquidity requirements to meet upcoming financial goals
  4. Growth opportunities based on stock performance and forex data
  5. Long-term vs. short-term investment potential
  6. Sector-specific trends within ETFs

  Detailed Data:

  Stocks and Forex Data:
  ${JSON.stringify(stocksData)}

  Financial Information:
  ${JSON.stringify(userFinances)}

  Please address the following in your recommendation:
  - **Investment Allocation**: Specify which sectors or types of assets to focus on (e.g., stocks, bonds, ETFs).
  - **Risk Assessment**: Explain the level of risk for each recommended asset based on the user's current financial data.
  - **Projected Growth**: Provide insights on projected growth for each asset, referencing recent trends and historical performance.
  - **Reasons for Selection**: Justify each recommended investment, explaining why it aligns with the user's financial goals.
  - **Potential Pitfalls**: Highlight any potential downsides and risks to be aware of for each recommended investment.
  - **Investment Timeline**: Suggest timeframes for each investment to achieve optimal returns.

  Give a thorough response that explains why each recommended investment is financially sound, addressing both advantages and potential risks.
`;

const fetchUserData = async (endpoint, setState, getToken) => {
  try {
    const response = await fetch(endpoint, {
      headers: { "Authorization": `Token ${getToken()}` }
    });
    const data = await response.json();
    setState(data);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const AIHub = () => {
  const [stocksData, setStocksData] = useState([]);
  const [userFinances, setUserFinances] = useState({
    totalDebt: null,
    allTransactions: [],
    financialGoals: [],
    financialSummary: null,
    accountBalance: null
  });
  const [geminiAdvice, setGeminiAdvice] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getToken } = useAuth();
  const router = useRouter();

  const fetchStocksAndForexData = useCallback(() => {
    fetchData(
      'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=YOUR_API_KEY', 
      setStocksData, 
      data => {
        const timeSeries = data['Time Series (Daily)'];
        return Object.keys(timeSeries).map(date => ({
          name: 'IBM',
          price: parseFloat(timeSeries[date]['4. close']),
          date,
        })).slice(0, 5);
      }
    );

    fetchData(
      'https://v6.exchangerate-api.com/v6/67f68a1ea669459788b85dac/latest/USD', 
      setStocksData, 
      data => {
        return Object.keys(data.conversion_rates).map(currency => ({
          name: `USD/${currency}`,
          rate: data.conversion_rates[currency],
        })).slice(0, 5);
      }
    );
  }, []);

  const fetchUserFinancialData = useCallback(() => {
    const endpoints = [
      { url: 'http://localhost:8000/api/total-debt/', field: 'totalDebt' },
      { url: 'http://localhost:8000/api/total-account-balance/', field: 'accountBalance' },
      { url: 'http://localhost:8000/api/transactions/', field: 'allTransactions' },
      { url: 'http://localhost:8000/api/financial-goals/', field: 'financialGoals' },
      { url: 'http://localhost:8000/api/financial-summary/', field: 'financialSummary' },
    ];

    endpoints.forEach(endpoint => {
      fetchUserData(endpoint.url, data => setUserFinances(prev => ({ ...prev, [endpoint.field]: data })), getToken);
    });
  }, [getToken]);

  useEffect(() => {
    fetchStocksAndForexData();
    fetchUserFinancialData();
  }, [fetchStocksAndForexData, fetchUserFinancialData]);

  const getGeminiAdvice = async () => {
    const promptMessage = generateGeminiPrompt(stocksData, userFinances);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/chat/send_chat/",
        { message: promptMessage, mode: 'normal' },
        { headers: { "Authorization": `Token ${getToken()}`, "Content-Type": "application/json" } }
      );
      setGeminiAdvice(response.data.response);
      setIsModalOpen(true);
    } catch (error) {
      setError("Error fetching advice.");
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDownloadReport = () => router.push("/dashboard/scenes/report");

  return (
    <Box sx={{ p: 4 }}>
      <Header title="Investment Recommendations" subtitle="AI-Driven Suggestions for Investment Opportunities" />
      <Chip
        label={geminiAdvice ? `${geminiAdvice.substring(0, 50)}...` : "Click 'Get Advice' for Gemini's Recommendation"}
        sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 4, p: 2, backgroundColor: 'primary.main', color: 'white' }}
        onClick={() => setIsModalOpen(true)}
      />
      <Button variant="contained" color="secondary" onClick={getGeminiAdvice}>Get Gemini Advice</Button>
      <Button variant="outlined" color="primary" onClick={handleDownloadReport}>Download Report</Button>

      {/* Modal for showing complete Gemini advice */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>Gemini Investment Recommendation</Typography>
          <Typography variant="body1">{geminiAdvice}</Typography>
          <Button onClick={handleCloseModal} sx={{ mt: 4 }} variant="contained">Close</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default AIHub;
