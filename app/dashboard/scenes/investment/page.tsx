"use client";

import React from 'react';
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
  const [recommendations, setRecommendations] = React.useState<InvestmentRecommendations | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const userData = {
          income: 5000,
          expenses: 3000,
          savings: 10000,
          debtToIncomeRatio: 0.3,
          creditScore: 750,
          riskTolerance: "Moderate",
          investmentHorizon: 10,
          investmentGoals: ["Retirement", "House Down Payment"],
          currentInvestments: ["401k", "Index Funds"]
        };
        
        // Simulated fetching process for investment recommendations
        // const result = await generateInvestmentRecommendations(userData);
        // setRecommendations(result);
      } catch (err) {
        setError("Failed to load investment recommendations");
      } finally {
        setLoading(false);
      }
    };

    if (isInvestmentOpen) {
      fetchRecommendations();
    }
  }, [isInvestmentOpen]);

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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">
                    Recommended Investments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {recommendations.recommendedInvestments.map((investment, index) => (
                      <li key={index} className="border-b pb-3 last:border-b-0">
                        <h4 className="font-medium text-black">{investment.name}</h4>
                        <p className="text-sm text-black mt-1">{investment.description}</p>
                        <div className="mt-2 text-sm">
                          <p><span className="font-medium">Risk Level:</span> {investment.riskLevel}</p>
                          <p><span className="font-medium">Expected Return:</span> {investment.expectedReturn}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">
                    Monitoring Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-black">
                    {recommendations.monitoringStrategy.map((strategy, index) => (
                      <li key={index}>{strategy}</li>
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
