"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "../../provider/auth-provider";
import { base_url } from "../../../../env.js";

const CreditScore = () => {
  const [creditScore, setCreditScore] = useState(null);
  const [financialData, setFinancialData] = useState({
    totalDebt: null,
    totalAccountBalance: null,
  });
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  // Helper function for API requests
  const fetchData = async (url, setter, errorMsg) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Token ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.log(`${errorMsg}:`, error.message);
    }
  };

  // Fetch Total Debt and Account Balance
  const fetchFinancialData = async () => {
    await Promise.all([
      fetchData(
        `${base_url}/api/total-debt/`,
        (data) => setFinancialData((prev) => ({ ...prev, totalDebt: data.total_debt })),
        "Failed to fetch total debt"
      ),
      fetchData(
        `${base_url}/api/total-account-balance/`,
        (data) => setFinancialData((prev) => ({ ...prev, totalAccountBalance: data.balance })),
        "Failed to fetch total account balance"
      ),
    ]);
  };

  // Fetch Credit Score from AI
  const fetchCreditScoreFromAI = async () => {
    const { totalDebt, totalAccountBalance } = financialData;
    if (totalDebt === null || totalAccountBalance === null) return;

    try {
      const transactions = await fetchData(
        `${base_url}/api/transactions/`,
        (data) => data,
        "Failed to fetch transactions"
      );

      const prompt = `
        Based on the following data, please estimate a credit score:
        - Transaction history: ${JSON.stringify(transactions)}
        - Total debt: ${totalDebt}
        - Total account balance: ${totalAccountBalance}
        Respond with an estimated credit score based on spending patterns, debt, and balance.
      `;

      const aiResponse = await axios.post(
        `${base_url}/api/chat/send_chat/`,
        { message: prompt, mode: "normal" },
        {
          headers: {
            Authorization: `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (aiResponse.data?.score) {
        setCreditScore(aiResponse.data.score);
      } else {
        throw new Error("AI response did not contain a valid score.");
      }
    } catch (error) {
      console.log("Error generating notifications or fetching credit score:", error.response || error.message);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchFinancialData();
      await fetchCreditScoreFromAI();
      setLoading(false);
    };
    fetchData();
  }, [financialData.totalDebt, financialData.totalAccountBalance]);

  // Determine progress bar color
  const getProgressColor = () => {
    if (creditScore >= 750) return "bg-green-500";
    if (creditScore >= 600) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div>
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader>
          <CardTitle>Credit Score Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading credit score...</p>
          ) : creditScore !== null ? (
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p>Your current credit score:</p>
                <Progress
                  value={(creditScore / 850) * 100}
                  className={`h-2 ${getProgressColor()}`}
                />
              </div>
              <div className="text-2xl font-bold">{creditScore}</div>
            </div>
          ) : (
            <p>Unable to calculate credit score. Please try again later.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditScore;
