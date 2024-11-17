'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

type Product = {
  id: number
  name: string
  price: number
  description: string
}

const products: Product[] = [
  { id: 1, name: "Ultra Premium Water", price: 999.99, description: "The rarest water on Earth, blessed by unicorns" },
  { id: 2, name: "Luxury Air Freshener", price: 1499.99, description: "Smell like a billionaire with our exclusive scent" },
  { id: 3, name: "Designer Paperclips", price: 799.99, description: "Hold your documents together in style" },
  { id: 4, name: "Elite Toothpick Set", price: 2999.99, description: "Handcrafted from the finest rare woods" },
  { id: 5, name: "VIP Rubber Band Collection", price: 1299.99, description: "Stretch your wealth with our premium bands" },
]

export default function OverpricedShop() {
  const [cart, setCart] = useState<Product[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' })
  const [showFraudAlert, setShowFraudAlert] = useState(false)
  const [transactionComplete, setTransactionComplete] = useState(false)

  const addToCart = (product: Product) => {
    setCart([...cart, product])
    toast.success(`Added ${product.name} to cart!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2)
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate transaction processing
    setTransactionComplete(true)
    // Simulate delay before fraud detection
    setTimeout(() => {
      setShowFraudAlert(true)
    }, 2000)
  }

  return (
    <div className="container mx-auto p-4 bg-red-50">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-red-800">EXCLUSIVE LUXURY EMPORIUM</h1>
      
      {!showCheckout && !transactionComplete && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-red-300">
            <CardHeader>
              <CardTitle className="text-red-800">ELITE PRODUCTS</CardTitle>
              <CardDescription>Only for the most discerning customers</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {products.map(product => (
                  <div key={product.id} className="mb-6 p-4 bg-red-100 rounded-lg">
                    <h3 className="font-semibold text-lg text-red-800">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <p className="text-xl font-bold text-red-800 mb-2">${product.price.toFixed(2)}</p>
                    <Button onClick={() => addToCart(product)} className="w-full bg-red-600 hover:bg-red-700">
                      Add to VIP Cart
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-300">
            <CardHeader>
              <CardTitle className="text-red-800">YOUR EXCLUSIVE SELECTION</CardTitle>
              <CardDescription>Items worthy of your status</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-2 p-2 bg-red-100 rounded">
                    <span className="font-semibold text-red-800">{item.name} - ${item.price.toFixed(2)}</span>
                    <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)}>Remove</Button>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="font-semibold text-lg text-red-800">Total: ${getTotalPrice()}</div>
              <Button onClick={() => setShowCheckout(true)} disabled={cart.length === 0} className="bg-red-600 hover:bg-red-700">
                <ShoppingCart className="mr-2 h-4 w-4" /> Proceed to Elite Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {showCheckout && !transactionComplete && (
        <Card className="max-w-md mx-auto border-2 border-red-300">
          <CardHeader>
            <CardTitle className="text-red-800">EXCLUSIVE CHECKOUT</CardTitle>
            <CardDescription>Enter your premium payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckout}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="cardNumber" className="text-red-800">Exclusive Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    required
                    className="border-red-300"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="expiry" className="text-red-800">VIP Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    required
                    className="border-red-300"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="cvc" className="text-red-800">Elite CVC</Label>
                  <Input 
                    id="cvc" 
                    placeholder="123"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                    required
                    className="border-red-300"
                  />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="font-semibold mb-4 text-lg text-red-800">Total Elite Price: ${getTotalPrice()}</div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                <CreditCard className="mr-2 h-4 w-4" /> Complete Luxury Purchase
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {transactionComplete && !showFraudAlert && (
        <Card className="max-w-md mx-auto border-2 border-green-300">
          <CardHeader>
            <CardTitle className="text-green-800">TRANSACTION COMPLETE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
              <p className="text-center text-green-800 text-lg">
                Congratulations! Your exclusive payment of ${getTotalPrice()} has been processed. You are now part of the elite!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showFraudAlert} onOpenChange={setShowFraudAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Fraud Alert
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-lg">
            FinanceAI has detected potentially fraudulent activity on your account.
          </DialogDescription>
          <div className="py-4">
            <p className="text-lg font-semibold">Suspicious Transaction Details:</p>
            <p>Amount: ${getTotalPrice()}</p>
            <p>Merchant: EXCLUSIVE LUXURY EMPORIUM</p>
            <p>Date: {new Date().toLocaleString()}</p>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowFraudAlert(false)
                setTransactionComplete(false)
                setShowCheckout(false)
                setCart([])
              }}
              className="w-full sm:w-auto"
            >
              Acknowledge and Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}