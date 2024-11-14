"use client"
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "./../../theme";
// import "./"

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
// import "./InputForm"
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { useAuth } from '../../provider/auth-provider';
import StatBox from "../../components/StatBox"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNewAccount } from "../../hooks/use_new_account";
import { useNewTransaction } from "../../hooks/use_new_transaction";
import { useNewNotification } from "../../hooks/use_new_notification";
import { useNewGoal } from "../../hooks/use_new_goal";
import { useNewDebt } from "../../hooks/use_new_debt";
import { useNewSaving } from "../../hooks/use_new_saving";
import { useNewInvestment } from "../../hooks/use_new_investements";
import { useNewPersonalizedGoal } from "../../hooks/use_new_personalized";
import { useNewAnomallyDetection } from "../../hooks/use_new_anomally";
import { base_url } from "../../../../env"
import FinancialGoals from "./InputForm";
import TotalDebt from "./TotalDebt"
const page = () => {
    const { getToken } = useAuth();
    console.log("DashBoard Token", getToken())
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const router = useRouter();
    const { onOpen } = useNewTransaction();
    const { onGoalOpen } = useNewGoal()
    // const {onOpen} = useNewDebt();
  
    // const {onOpen} = useNewNotification();
    const { onAnomallyDetectionOpen } = useNewAnomallyDetection();
    const { onPersonalizedGoalOpen } = useNewPersonalizedGoal();
  
  
    const { onAccountOpen } = useNewAccount();
    const { onSavingOpen } = useNewSaving();
    const { onInvestmentOpen } = useNewInvestment();
  
  
    const { onDebtOpen } = useNewDebt()
  
  return (
    <Box m="10px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>

        
          <Button
            onClick={onDebtOpen}
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
            Add Debt
          </Button>
          <Button
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
            Add Saving
          </Button>
          <Button
            onClick={onGoalOpen}
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
            Add Goal
          </Button>
          <Button
            onClick={onOpen}
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
            Add Transaction
          </Button>
          <Button
            onClick={onAccountOpen}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Add Account
          </Button>
 
        </Box>
        
      </Box>
      <Header title="MyGoals" subtitle="These are your financial goals " />
<FinancialGoals />
<Header title="MyDebts" subtitle="These are your debts " />
<TotalDebt />

    </Box>
  )
}

export default page