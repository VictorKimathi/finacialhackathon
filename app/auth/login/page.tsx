'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { base_url } from "../../../env"

export default function LoginComponent() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
//   const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login form submitted:', formData)

    try {
      const response = await axios.post(`${base_url}/api/token/`, formData);
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token); 
      console.log("Token setting",localStorage.getItem('token'));
      router.replace('/preference/account/'); 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error during registration:', error.response ? error.response.data : error.message);
    } else if (error instanceof Error) {
        console.log('Error during registration:', error.message);
    } else {
        console.log('Unexpected error:', error);
    }
    }
  }

  const navigateToRegister = () => {
    router.push('/auth/register'); // Replace with the actual registration route
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">UserName</Label>
              <Input
                id="name"
                name="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="space-y-2">
          <Button className="w-full" onClick={handleSubmit}>Login</Button>
          <Button variant="outline" className="w-full mt-2" onClick={navigateToRegister}>
            Don't have an account? Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
