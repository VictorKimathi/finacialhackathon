"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, Loader2, ChevronRight, LockKeyhole } from 'lucide-react'
import { Input } from "@/components/ui/input"

const kenyanBanks = [
  {
    id: 1,
    name: 'M-PESA',
    icon: '/mpesa.jpeg',
    category: 'Mobile Money'
  },
  {
    id: 2,
    name: 'KCB Bank',
    icon: '/kcb.jpeg',
    category: 'Bank'
  },
  {
    id: 3,
    name: 'Equity Bank',
    icon: '/equity.jpeg',
    category: 'Bank'
  }
]

export default function PlaidLikeConnection() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBank, setSelectedBank] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBanks = kenyanBanks.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBankSelect = (bankId: number) => {
    setSelectedBank(bankId)
    setIsConnecting(true)
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
    }, 2000)
  }

  const resetState = () => {
    setSelectedBank(null)
    setIsConnecting(false)
    setIsConnected(false)
    setSearchQuery('')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
      >
        <LockKeyhole className="mr-2 h-4 w-4" /> Continue with FinanceAI
      </Button>

      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) resetState()
        }}
      >
        <DialogContent className="sm:max-w-[500px] p-0">
          <div className="p-6 border-b border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Connect your financial account</DialogTitle>
              <DialogDescription className="text-gray-600">
                Select your bank or financial service provider below
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for your bank"
                className="pl-10 bg-gray-50 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {!selectedBank && (
            <ScrollArea className="h-[400px]">
              <div className="p-2">
                {filteredBanks.map((bank) => (
                  <button
                    key={bank.id}
                    className="w-full p-3 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => handleBankSelect(bank.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <img 
                        src={bank.icon} 
                        alt={`${bank.name} logo`}
                        className="w-10 h-10 object-contain"
                      />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{bank.name}</p>
                        <p className="text-sm text-gray-500">{bank.category}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}

          {isConnecting && (
            <div className="flex flex-col items-center justify-center h-[400px] p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connecting securely...</h3>
              <p className="text-gray-600 text-center">
                We're establishing a secure connection with your account
              </p>
            </div>
          )}

          {isConnected && (
            <div className="flex flex-col items-center justify-center h-[400px] p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <LockKeyhole className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Successfully Connected!</h3>
              <p className="text-gray-600 text-center mb-6">
                Your account has been securely linked to FinanceAI
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                onClick={() => setIsOpen(false)}
              >
                Continue to Dashboard
              </Button>
            </div>
          )}

          <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-500">
            Secured by FinanceAI | End-to-end encryption
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
