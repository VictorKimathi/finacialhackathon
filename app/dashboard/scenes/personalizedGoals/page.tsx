"use client";
import React, { useEffect, useState } from "react";
import { base_url } from "../../../../env.js";
import axios from "axios";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewPersonalizedGoal } from "../../hooks/use_new_personalized";
import { useAuth } from "../../provider/auth-provider";

interface Goal {
  description: string;
  timeframe: string;
  steps: string[];
  challenges?: string[];
}

interface GoalSectionProps {
  title: string;
  goals: Goal[];
}

interface AIResponse {
  advice: string;
  newGoals: Goal[];
}

// Custom logger for advanced logging
const logger = {
  info: (message: string, data?: any) => console.info(`INFO: ${message}`, data || ""),
  error: (message: string, error?: any) => console.log(`ERROR: ${message}`, error || ""),
  debug: (message: string, data?: any) => console.debug(`DEBUG: ${message}`, data || ""),
};

const GoalSection = ({ title, goals }: GoalSectionProps) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-gray-700">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {goals && goals.length > 0 ? (
          <div>
            {goals.map((goal, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0">
                <h4 className="font-medium text-gray-800">{goal.description}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Timeline: {goal.timeframe}
                </p>
                <p className="text-sm font-medium text-gray-700">Steps:</p>
                <p className="list-disc pl-5 text-sm text-gray-600">
                  {goal.steps.join(", ")}
                </p>
                {goal.challenges && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">
                      Challenges:
                    </p>
                    <p className="list-disc pl-5 text-sm text-gray-600">
                      {goal.challenges.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No goals available at the moment.</p>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function NewPersonalizedGoalSheet() {
  const { isPersonalizedGoalOpen, onPersonalizedGoalClose } = useNewPersonalizedGoal();
  const [goals, setGoals] = useState<Goal[]>([]);  // Changed to hold AI-generated goals
  const [advice, setAdvice] = useState<string | null>(null);  // Advice from AI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  useEffect(() => {
    const fetchGoalsAndGetAIAdvice = async () => {
      logger.info("Starting fetchGoalsAndGetAIAdvice...");
      setLoading(true);
      try {
        // Fetch financial goals
        const response = await fetch(`${base_url}/api/financial-goals/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          logger.error("Error fetching financial goals", {
            status: response.status,
            message: response.statusText,
          });
          throw new Error(`Failed to fetch financial goals: ${response.statusText}`);
        }
  
        const data = await response.json();
        logger.info("Fetched financial goals:", data);
  
        // Define AI prompt
        const aiPrompt = `
        Based on the user's financial goals (${data?.goals?.length || 0} goals provided):
        Please generate new financial goals in four distinct timeframes: short-term, medium-term, and long-term. 
        Provide actionable insights and recommendations for improvement.
        `;
  
        // Send data to AI
        const aiResponse = await axios.post(
          "http://localhost:5000/api/finance/ai-insights",
          {
            message: JSON.stringify({
              ...data,
              prompt: aiPrompt,
            }),
            mode: "goal_advice_and_generation",
          },
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzE2OTBlZTc2MDA3NzEwMDI3ODk4ZjQiLCJpYXQiOjE3MzE4NDY5NDIsImV4cCI6MTczMTkzMzM0Mn0.GcfkwnGVfvxhmgBWt-rZjOp_xiu7KQ2F3H_4W8pQons`, // Use env variable
              "Content-Type": "application/json",
            },
          }
        );
  
        logger.info("AI response received:", aiResponse.data);
  
        if (aiResponse.data) {
          setAdvice(aiResponse.data);
          console.log(":asdsad:",aiResponse.data)
          // setGoals(aiResponse.data.newGoals);
        } else {
          logger.error("AI response is missing expected fields");
          throw new Error("AI response is invalid or incomplete");
        }
      } catch (err) {
        logger.error("Error in fetchGoalsAndGetAIAdvice", err);
        setError("Failed to generate financial goals and advice");
      } finally {
        setLoading(false);
      }
    };
  
    if (isPersonalizedGoalOpen) {
      fetchGoalsAndGetAIAdvice();
    }
  }, [isPersonalizedGoalOpen, getToken]);
  
  return (
    <Sheet open={isPersonalizedGoalOpen} onOpenChange={onPersonalizedGoalClose}>
      <SheetContent className="space-y-6 p-6 rounded-lg bg-white shadow-lg border border-gray-200 overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-bold text-gray-800">
            AI Powered Personalized Finance Goals Advice And budget
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            Based on your current goals, we suggest improvements and generate new goals for you
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          )} */}

          {/* {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )} */}

      {advice && !loading && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800">AI's Advice:</h4>
              <p className="text-sm text-gray-600">{advice.aiAdvice}</p>
            </div>
          )}
          

          {/* {goals && !loading && (
            <>
              <GoalSection title="New Short-term Goals" goals={goals.filter(goal => goal.timeframe === 'short-term')} />
              <GoalSection title="New Medium-term Goals" goals={goals.filter(goal => goal.timeframe === 'medium-term')} />
              <GoalSection title="New Long-term Goals" goals={goals.filter(goal => goal.timeframe === 'long-term')} />
            </>
          )} */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
