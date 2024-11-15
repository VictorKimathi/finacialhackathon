"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BanknoteIcon as Bank, CircleDollarSign, Loader2 } from "lucide-react";

const mockBanks = [
  { id: 1, name: "BigBank National" },
  { id: 2, name: "Credit Union Plus" },
  { id: 3, name: "Savings & Loans Co." },
  { id: 4, name: "Digital Banking Corp" },
  { id: 5, name: "Community Trust Bank" },
];

export default function BankConnection() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<number | null>(null);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleBankSelect = (bankId) => {
    setSelectedBank(bankId);
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 3000);
  };

  const resetState = () => {
    setSelectedBank(null);
    setIsConnecting(false);
    setIsConnected(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Button onClick={() => setIsOpen(true)}>
        <Bank className="mr-2 h-4 w-4" /> Connect Bank Account
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetState();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect Your Bank</DialogTitle>
            <DialogDescription>
              Choose your bank from the list below to securely connect your
              account.
            </DialogDescription>
          </DialogHeader>

          {!selectedBank && (
            <ScrollArea className="h-[300px] pr-4">
              {mockBanks.map((bank) => (
                <Button
                  key={bank.id}
                  variant="outline"
                  className="w-full justify-start mb-2"
                  onClick={() => handleBankSelect(bank.id)}
                >
                  <Bank className="mr-2 h-4 w-4" />
                  {bank.name}
                </Button>
              ))}
            </ScrollArea>
          )}

          {isConnecting && (
            <div className="flex flex-col items-center justify-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-4">Connecting to your bank...</p>
            </div>
          )}

          {isConnected && (
            <div className="flex flex-col items-center justify-center h-[300px]">
              <CircleDollarSign className="h-16 w-16 text-green-500" />
              <h3 className="mt-4 text-xl font-semibold">
                Successfully Connected!
              </h3>
              <p className="mt-2 text-center text-gray-600">
                Your bank account has been securely linked to FinanceAI.
              </p>
              <Button className="mt-4" onClick={() => setIsOpen(false)}>
                Continue to Dashboard
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



