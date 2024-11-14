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
import { useNewPersonalizedGoal } from '../../hooks/use_new_personalized';
// import { generateFinancialGoals } from '@/app/actions/financial';

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

interface FinancialGoalsData {
  shortTermGoals: Goal[];
  mediumTermGoals: Goal[];
  longTermGoals: Goal[];
}

const GoalSection = ({ title, goals }: GoalSectionProps) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-4">
        {goals.map((goal, index) => (
          <li key={index} className="border-b pb-3 last:border-b-0">
            <h4 className="font-medium text-gray-800">{goal.description}</h4>
            <p className="text-sm text-gray-600 mt-1">Timeline: {goal.timeframe}</p>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Steps:</p>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                {goal.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
            {goal.challenges && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Challenges:</p>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {goal.challenges.map((challenge, idx) => (
                    <li key={idx}>{challenge}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default function NewPersonalizedGoalSheet() {
  const { isPersonalizedGoalOpen, onPersonalizedGoalClose } = useNewPersonalizedGoal();
  const [goals, setGoals] = React.useState<FinancialGoalsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const userData = {
          income: 5000,
          expenses: 3000,
          savings: 10000,
          debtToIncomeRatio: 0.3,
          creditScore: 750,
          topExpenseCategories: ["Housing", "Food", "Transportation"]
        };
        
        // Using server action
        // const result = await generateFinancialGoals(userData);
        // setGoals(result);
      } catch (err) {
        setError("Failed to load financial goals");
      } finally {
        setLoading(false);
      }
    };

    if (isPersonalizedGoalOpen) {
      fetchGoals();
    }
  }, [isPersonalizedGoalOpen]);

  return (
    <Sheet open={isPersonalizedGoalOpen} onOpenChange={onPersonalizedGoalClose}>
      <SheetContent className="space-y-6 p-6 rounded-lg bg-white shadow-lg border border-gray-200 overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-bold text-gray-800">
            AI Powered Personalized Finance Goals Advice
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            Based on your transactions we suggest these advice
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {goals && !loading && (
            <>
              <GoalSection title="Short-term Goals" goals={goals.shortTermGoals} />
              <GoalSection title="Medium-term Goals" goals={goals.mediumTermGoals} />
              <GoalSection title="Long-term Goals" goals={goals.longTermGoals} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
