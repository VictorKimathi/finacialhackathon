"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Adjust the import if needed
// import { TrendingUp } from "@/icons"; // Adjust if you’re using a specific icon library

const CreditScore = () => {
  // Define or fetch the credit score value here
  const [creditScore, setCreditScore] = useState(700); // Example score for testing

  // Mock API call to fetch the user's credit score
  useEffect(() => {
    // Replace this with a real API call if needed
    const fetchCreditScore = async () => {
      const score = await getCreditScoreFromAPI(); // Mock function
      setCreditScore(score);
    };

    fetchCreditScore();
  }, []);

  return (
    <div>
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader>
          <CardTitle className="flex items-center">
            {/* <TrendingUp className="mr-2 h-4 w-4 text-purple-400" /> */}
            Credit Score Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <p className="mb-2">
                Your current credit score:
              </p>
              <Progress
                value={(creditScore / 850) * 100} // Assuming max score is 850
                className="h-2 bg-gray-600"
              />
            </div>
            <div className="text-2xl font-bold">
              {creditScore}
            </div>
          </div>
          <p className="mt-4">
            Your score is considered {creditScore >= 700 ? '"Good"' : '"Needs Improvement"'}. Here are some tips to
            improve it:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Pay all bills on time</li>
            <li>Keep credit utilization below 30%</li>
            <li>Avoid applying for new credit</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditScore;

// Mock function to simulate fetching credit score from an API
async function getCreditScoreFromAPI() {
  // Simulate API delay
  return new Promise((resolve) => setTimeout(() => resolve(700), 1000)); // Example score: 700
}
