"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Chip, Card, CardContent, CardActions, Button, Grid, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { tokens } from "../../theme";
import Header from "../../components/Header";

// Fetch data helper function
const fetchData = async (url, setState, transformData) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    setState(transformData(data));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};



const AIHub = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [stockData, setStockData] = useState([]);
  const [forexData, setForexData] = useState([]);
  const [etfData, setEtfData] = useState({ sectors: [], holdings: [] });
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch data from APIs
  useEffect(() => {
    // Stock Market Data - Alpha Vantage
    fetchData(
      'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=YOUR_API_KEY',
      setStockData,
      (data) => {
        const timeSeries = data['Time Series (Daily)'];
        return Object.keys(timeSeries).map(date => ({
          name: 'IBM',
          price: parseFloat(timeSeries[date]['4. close']),
          date,
        })).slice(0, 5); // Only take the last 5 days
      }
    );

    // Forex Data - Exchange Rates API
    fetchData(
      'https://v6.exchangerate-api.com/v6/67f68a1ea669459788b85dac/latest/USD',
      setForexData,
      (data) => {
        return Object.keys(data.conversion_rates).map(currency => ({
          name: `USD/${currency}`,
          rate: data.conversion_rates[currency],
        })).slice(0, 5);
      }
    );

    // ETF Data - Alpha Vantage
    fetchData(
      'https://www.alphavantage.co/query?function=ETF_PROFILE&symbol=QQQ&apikey=YOUR_API_KEY',
      setEtfData,
      (data) => ({
        sectors: data.sectors || [],
        holdings: data.holdings || [],
      })
    );
  }, []);

  const openModal = (investment) => {
    setSelectedInvestment(investment);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <Box sx={{ p: 4 }}>
      <Header title="Investment Recommendations" subtitle="AI-Driven Suggestions for Investment Opportunities" />

      <Chip
        label="Enter recommendation from Gemini here"
        sx={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          mb: 4,
          p: 2,
          backgroundColor: colors.primary[500],
          color: 'primary',
        }}
      />

      {/* Stock Section */}
      <Typography variant="h6" color='white' sx={{ mt: 4, mb: 2 }}>Stock Exchange Opportunities</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ cursor: 'pointer', width: '100%', backgroundColor: 'transparent' }}>
            <CardContent>
              <Typography variant="h6">{stockData[0]?.name}</Typography> {/* Display the stock name */}
              <Line
                data={{
                  labels: stockData.map(s => s.date),  // Dates for the last 5 days
                  datasets: [{
                    label: "Price over Last 5 Days",
                    data: stockData.map(s => s.price),  // Prices for the last 5 days
                    borderColor: colors.primary[100],
                    fill: false,
                  }]
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Forex Section */}
      <Typography variant="h6" color='white' sx={{ mt: 4, mb: 2 }}>Forex Opportunities</Typography>
      <Grid container spacing={2}>
        {forexData.map((currency) => (
          <Grid item xs={12} sm={6} key={currency.name}>
            <Card onClick={() => openModal(currency)} sx={{ cursor: 'pointer', backgroundColor: 'transparent' }}>
              <CardContent>
                <Typography variant="h6">{currency.name}</Typography>
                <Typography color="textSecondary">Rate: {currency.rate}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="secondary" onClick={() => openModal(currency)}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ETF Sectors and Holdings */}
      <Typography color='white' variant="h6" sx={{ mt: 4, mb: 2 }}>ETF Data - QQQ</Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography color='white' variant="h6">Sectors</Typography>
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sector</TableCell>
                <TableCell align="right">Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {etfData.sectors.map((sector) => (
                <TableRow key={sector.sector}>
                  <TableCell>{sector.sector}</TableCell>
                  <TableCell align="right">{sector.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <Typography color='white'>Holdings</Typography>
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {etfData.holdings.map((holding) => (
                <TableRow key={holding.symbol}>
                  <TableCell>{holding.symbol}</TableCell>
                  <TableCell>{holding.description}</TableCell>
                  <TableCell align="right">{holding.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal for Investment Details */}
      <Modal open={modalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedInvestment && (
            <>
              <Typography color='white' variant="h6" sx={{ mb: 2 }}>{selectedInvestment.name}</Typography>
              <Typography color='white'><strong>Price/Rate:</strong> {selectedInvestment.price || selectedInvestment.rate}</Typography>
              <Typography color='white'><strong>Details:</strong> {selectedInvestment.location || selectedInvestment.market}</Typography>
              <Line
                data={{
                  labels: stockData.map(s => s.date),
                  datasets: [{
                    label: "Price over Time",
                    data: stockData.map(s => s.price),
                    borderColor: 'white',
                    fill: false,
                  }]
                }}
              />
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default AIHub;
