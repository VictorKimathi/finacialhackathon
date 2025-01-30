"use client"
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "./theme";
// import "./"
import axios from 'axios';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "./components/Header";
import LineChart from "./components/LineChart";
import { useAuth } from './provider/auth-provider';
import StatBox from "./components/StatBox"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNewAccount } from "./hooks/use_new_account";
import { useNewTransaction } from "./hooks/use_new_transaction";
import { useNewNotification } from "./hooks/use_new_notification";
import { useNewGoal } from "./hooks/use_new_goal";
import { useNewDebt } from "./hooks/use_new_debt";
import { useNewSaving } from "./hooks/use_new_saving";
import { useNewInvestment } from "./hooks/use_new_investements";
import { useNewPersonalizedGoal } from "./hooks/use_new_personalized";
import { useNewAnomallyDetection } from "./hooks/use_new_anomally";
import { base_url } from "../../env"
import Fraud from "../dashboard/scenes/fraud/page"
import ProgressCircle from "./components/ProgressCircle";

const Dashboard = () => {
  const { getToken } = useAuth();
  console.log("DashBoard Token", getToken())
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const { onOpen } = useNewTransaction();
  const { onGoalOpen } = useNewGoal()
  // const {onOpen} = useNewDebt();


  // async function testEmbedding() {
  //     const dummyText = "Test document content for embedding and matching.";
  //     try {
  //         const response = await axios.post('/api/test/', {
  //             content: dummyText,
  //             embeddings: Array(1536).fill(Math.random()),  // Dummy embedding array
  //         });
  //         console.log('Response:', response.data);
  //     } catch (error) {
  //         console.log('Test embedding error:', error);
  //     }
  // }

  // testEmbedding();






  // const {onOpen} = useNewNotification();
  const { onAnomallyDetectionOpen } = useNewAnomallyDetection();
  const { onPersonalizedGoalOpen } = useNewPersonalizedGoal();


  const { onAccountOpen } = useNewAccount();
  const { onSavingOpen } = useNewSaving();
  const { onInvestmentOpen } = useNewInvestment();


  const { onDebtOpen } = useNewDebt()
  const [fraudDetected, setFraudDetected] = useState(false);

  const [totalDebt, setTotalDebt] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]); // State for all transactions
  const [financialGoals, setFinancialGoals] = useState([]); // State for financial goals
  const [financialSummary, setFinancialSummary] = useState(null); // State for financial summary
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [context, setContext] = useState({}); // New state for context
  const [accountBalance, setTotalAccountBalance] = useState(null); // Corrected naming convention
  const [lineChartData, setLineChartData] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const handleDownloadReport = () => {
    router.push("/dashboard/scenes/report")
  }

  useEffect(() => {
    if (!loading && financialSummary) {
      const dataForLineChart = {

        income: financialSummary.total_income,
        expense: financialSummary.total_expenses,
        account_balance: accountBalance.total_balance,
        total_debt: totalDebt.total_debt,

      }
      setLineChartData(dataForLineChart);
    }
  }, [loading, financialSummary, accountBalance, totalDebt]);




  useEffect(() => {
    const fetchTotalDebt = async () => {
      try {
        const response = await fetch(`${base_url}/api/total-debt/`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch total debt");
        }

        const data = await response.json();
        console.log("Total debt:", data.total_debt);
        setTotalDebt(data);
      } catch (err) {
        setError(err.message);
      }
    };

    // Moved the totalAccountBalance function to be a separate function
    const totalAccountBalance = async () => {
      try {
        console.log("Base url", base_url)
        const response = await fetch(`${base_url}/api/total-account-balance/`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch total debt");
        }

        const data = await response.json();
        console.log("Total account balance:", data); // Changed log message
        setTotalAccountBalance(data); // Changed variable name
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAllTransactions = async () => {
      try {
        const response = await fetch(`${base_url}/api/transactions/`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        console.log("Total transactions:", data);
        setAllTransactions(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchFinancialGoals = async () => {
      try {
        const response = await fetch(`${base_url}/api/financial-goals/`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch financial goals");
        }

        const data = await response.json();
        console.log("Financial Goals:", data);
        setFinancialGoals(data);
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch Financial Summary
    const fetchFinancialSummary = async () => {
      try {
        const response = await fetch(`${base_url}/api/financial-summary/`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch financial summary");
        }

        const data = await response.json();
        console.log("Financial Summary:", data);
        setFinancialSummary(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAccounts = async () => {
      try {
        const response = await fetch(`${base_url}/api/accounts/`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch financial goals");
        }
        const data = await response.json();
        setAccounts(data);
        console.log("Financial Goals:", data);


        // if (!response.ok) {
        //   throw new Error("Failed to fetch financial summary");
        // }

        // const data = await response.json();
        // console.log("Financial Summary:", data);
        // setFinancialSummary(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAllData = async () => {
      await Promise.all([
        fetchTotalDebt(),
        fetchAllTransactions(),
        fetchFinancialGoals(),
        fetchFinancialSummary(),
        totalAccountBalance(),
        fetchAccounts()
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []); // Added missing closing brace for useEffect

  // Update context state and log it after all data is fetched
  useEffect(() => {
    if (!loading) {
      setContext({
        totalDebt,
        allTransactions,
        financialGoals,
        financialSummary,
        accountBalance
      });
      console.log("Context", context); // Log the context after it's updated
    }
  }, [loading, totalDebt, allTransactions, accountBalance, financialGoals, financialSummary]); // Dependency array

  // Loading and error handling
  if (loading) {
    return <p className="text-center text-blue-500">Loading transactions, financial goals, and summary...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }








  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          {/* <Button
            onClick={onSavingOpen}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              margin: "10px"

            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Add Reminder
          </Button> */}
          <Button
            onClick={onAnomallyDetectionOpen}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              margin: "10px"

            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Personal Anomally Detection
          </Button>
          <Button
            onClick={onInvestmentOpen}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              margin: "10px"

            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Personal Investment  Advice
          </Button>
          <Button
            onClick={onPersonalizedGoalOpen}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              margin: "10px"

            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            See Personalized FinanceGoals
          </Button>


          <Button
            onClick={handleDownloadReport}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              margin: "10px"
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={accountBalance.total_balance}
            subtitle="Account Balance"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={financialSummary.total_income}

            subtitle="Income"

            progress="0.50"
            // increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />

            }
          />
          <StatBox
            title={financialSummary.total_expenses}

            subtitle="Expense"

            progress="0.50"
            // increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />

            }
          />

        </Box>
        {/* <Header title="My Accounts" subtitle="This are your account balances" /> */}

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalDebt.total_debt}
            subtitle="Total Debt"


            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/* <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Savings"
            subtitle="savings"


            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box> */}




        {/* ROW 2 */}


        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Finance Analysis
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {accountBalance.total_balance}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart dataProps={lineChartData} isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {allTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.description}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.transaction_type}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.category}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.description}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.amount}
              </Box>
            </Box>
          ))}

        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          // backgroundColor="#1E88E5"
          p="30px"
          borderRadius="8px"
          boxShadow="2px 4px 10px rgba(0,0,0,0.1)"
        >
          <Typography variant="h5" fontWeight="600" color="white" mb={2}>
            Fraud Detection Analysis
          </Typography>

          <Typography variant="body1" color="white">
            <strong>Transaction Amount:</strong> No unusual or large transactions detected.
          </Typography>
          <Typography variant="body1" color="white">
            <strong>Transaction Time:</strong> No odd transaction times recorded.
          </Typography>
          <Typography variant="body1" color="white">
            <strong>Transaction Frequency:</strong> No sudden spikes in transactions.
          </Typography>
          <Typography variant="body1" color="white">
            <strong>User's Historical Behavior:</strong> No significant deviations detected.
          </Typography>

          <Box mt={2} p={2} bgcolor="green" borderRadius="4px">
            <Typography variant="body1" color="white" textAlign="center">
              ✅ No Fraudulent Activity Recorded
            </Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          // backgroundColor="#1E88E5"
          borderRadius="8px"
          boxShadow="2px 4px 10px rgba(0,0,0,0.1)"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px", color: "white" }}
          >
            Investment Portfolio Analysis
          </Typography>

          <Box height="250px" p="30px">
            <Typography variant="body1" color="white">
              <strong>Portfolio Value:</strong> $250,000
            </Typography>
            <Typography variant="body1" color="white">
              <strong>Risk Level:</strong> Moderate
            </Typography>
            <Typography variant="body1" color="white">
              <strong>Asset Allocation:</strong> 60% Stocks, 30% Bonds, 10% Cash
            </Typography>
            <Typography variant="body1" color="white">
              <strong>Performance YTD:</strong> +12.5%
            </Typography>
            <Typography variant="body1" color="white">
              <strong>Top Performing Asset:</strong> Tesla (+18%)
            </Typography>

            <Box mt={2} p={2} bgcolor="green" borderRadius="4px">
              <Typography variant="body1" color="white" textAlign="center">
                📈 Portfolio is Performing Well
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
      gridColumn="span 4"
      gridRow="span 2"
      // backgroundColor="#1E88E5"
      padding="30px"
      borderRadius="8px"
      boxShadow="2px 4px 10px rgba(0,0,0,0.1)"
    >
      <Typography
        variant="h5"
        fontWeight="600"
        sx={{ marginBottom: "15px", color: "white" }}
      >
        Credit Score Analysis
      </Typography>

      <Box height="200px">
        <Typography variant="body1" color="white">
          <strong>Current Credit Score:</strong> 750 (Excellent)
        </Typography>
        <Typography variant="body1" color="white">
          <strong>Payment History:</strong> 99% On-time Payments
        </Typography>
        <Typography variant="body1" color="white">
          <strong>Credit Utilization:</strong> 28% (Recommended &lt; 30%)
        </Typography>
        <Typography variant="body1" color="white">
          <strong>Number of Credit Accounts:</strong> 5 Active Accounts
        </Typography>
        <Typography variant="body1" color="white">
          <strong>Recent Hard Inquiries:</strong> 1 in the last 6 months
        </Typography>

        <Box mt={2} p={2} bgcolor="green" borderRadius="4px">
          <Typography variant="body1" color="white" textAlign="center">
            ✅ Your Credit Health is in Good Standing
          </Typography>
        </Box>
      </Box>
    </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
