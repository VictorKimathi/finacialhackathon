'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart, CreditCard, Check } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type Product = {
  id: number
  name: string
  price: number
}

const products: Product[] = [
  { id: 1, name: "Fair Trade Coffee", price: 12.99 },
  { id: 2, name: "Organic Tea Set", price: 15.99 },
  { id: 3, name: "Eco-Friendly Water Bottle", price: 9.99 },
  { id: 4, name: "Sustainable Bamboo Cutlery", price: 7.99 },
  { id: 5, name: "Recycled Paper Notebook", price: 5.99 },
]

export default function FairPriceShop() {
  const [cart, setCart] = useState<Product[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' })
  const [transactionSuccess, setTransactionSuccess] = useState(false)

  const addToCart = (product: Product) => {
    setCart([...cart, product])
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2)
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate payment processing
    setTimeout(() => {
      setTransactionSuccess(true)
    }, 1500)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Fair Price Shop</h1>
      
      {!showCheckout && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Browse our fair-priced products</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {products.map(product => (
                  <div key={product.id} className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                    </div>
                    <Button onClick={() => addToCart(product)}>Add to Cart</Button>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart</CardTitle>
              <CardDescription>Your selected items</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <span>{item.name} - ${item.price.toFixed(2)}</span>
                    <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)}>Remove</Button>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="font-semibold">Total: ${getTotalPrice()}</div>
              <Button onClick={() => setShowCheckout(true)} disabled={cart.length === 0}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {showCheckout && !transactionSuccess && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>Enter your payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckout}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input 
                    id="cvc" 
                    placeholder="123"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                    required
                  />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="font-semibold mb-4">Total: ${getTotalPrice()}</div>
              <Button type="submit" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" /> Pay Now
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {transactionSuccess && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Transaction Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <Check className="text-green-500 w-16 h-16 mb-4" />
              <p className="text-center">
                Your payment of ${getTotalPrice()} has been processed successfully. Thank you for your purchase!
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => {
              setShowCheckout(false)
              setTransactionSuccess(false)
              setCart([])
            }} className="w-full">
              Return to Shop
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}