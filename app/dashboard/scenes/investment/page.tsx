"use client";

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useNewInvestment } from '../../hooks/use_new_investements';
import { base_url } from "../../../../env.js";
import axios from 'axios';

interface Investment {
  name: string;
  description: string;
  riskLevel: string;
  expectedReturn: string;
}

interface InvestmentRecommendations {
  assetAllocation: Record<string, number>;
  recommendedInvestments: Investment[];
  monitoringStrategy: string[];
}

export default function NewInvestmentSheet() {
  const { isInvestmentOpen, onInvestmentClose } = useNewInvestment();
  const [recommendations, setRecommendations] = useState<InvestmentRecommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<any>(null); // Store all data to send to AI
  const [messages, setMessages] = useState<any[]>([]); // Messages for the chat
  const [newMessage, setNewMessage] = useState<string>('');
  const [chatMode, setChatMode] = useState<string>('investment'); // Define mode for investment

  const getToken = () => {
    // Function to get the token (this depends on your authentication setup)
    return 'your_token';
  };

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
        if (!response.ok) throw new Error("Failed to fetch total debt");
        const data = await response.json();
        setContext((prev: any) => ({ ...prev, totalDebt: data.total_debt }));
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchTotalAccountBalance = async () => {
      try {
        const response = await fetch(`${base_url}/api/total-account-balance/`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch total account balance");
        const data = await response.json();
        setContext((prev: any) => ({ ...prev, totalAccountBalance: data }));
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
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setContext((prev: any) => ({ ...prev, allTransactions: data }));
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
        if (!response.ok) throw new Error("Failed to fetch financial goals");
        const data = await response.json();
        setContext((prev: any) => ({ ...prev, financialGoals: data }));
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchFinancialSummary = async () => {
      try {
        const response = await fetch(`${base_url}/api/financial-summary/`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch financial summary");
        const data = await response.json();
        setContext((prev: any) => ({ ...prev, financialSummary: data }));
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
        if (!response.ok) throw new Error("Failed to fetch accounts");
        const data = await response.json();
        setContext((prev: any) => ({ ...prev, accounts: data }));
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAllData = async () => {
      await Promise.all([
        fetchTotalDebt(),
        fetchTotalAccountBalance(),
        fetchAllTransactions(),
        fetchFinancialGoals(),
        fetchFinancialSummary(),
        fetchAccounts(),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (!loading && context) {
      // Constructing the message to send to the AI
      const newMessage = `Total debt: ${context.totalDebt}, Total account balance: ${context.totalAccountBalance}, Transactions: ${JSON.stringify(context.allTransactions)}, Financial goals: ${JSON.stringify(context.financialGoals)}, Financial summary: ${JSON.stringify(context.financialSummary)}, Accounts: ${JSON.stringify(context.accounts)}`;

      // Sending the message to the chat API
      const sendMessageToAI = async () => {
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
          setNewMessage(''); // Clear the message after sending
        } catch (error) {
          console.log("Error sending message to AI:", error);
        }
      };

      sendMessageToAI();
    }
  }, [loading, context, chatMode]); // Trigger this after all data is fetched

  return (
    <Sheet open={isInvestmentOpen} onOpenChange={onInvestmentClose}>
      <SheetContent className="space-y-6 p-6 rounded-lg bg-white shadow-lg border border-gray-200 overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-bold text-black">
            Investment Recommendations
          </SheetTitle>
          <SheetDescription className="text-sm text-black">
            Personalized investment strategy based on your profile
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-black" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {recommendations && !loading && (
            <>
              {/* Render the recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">
                    Asset Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {Object.entries(recommendations.assetAllocation).map(([asset, percentage]) => (
                      <li key={asset} className="flex justify-between items-center text-black">
                        <span>{asset}</span>
                        <span className="font-medium">{percentage}%</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Display other recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">
                    Recommended Investments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.recommendedInvestments.map((investment, idx) => (
                      <li key={idx} className="flex justify-between items-center text-black">
                        <span>{investment.name}</span>
                        <span className="text-sm">{investment.riskLevel}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Monitoring Strategy */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">
                    Monitoring Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.monitoringStrategy.map((strategy, idx) => (
                      <li key={idx} className="text-black">
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
