'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import axios from "axios"

export default function Component() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    dateOfBirth: '',
    phoneNumber: '717382028', // Set the initial phone number without the country code
    email: '',
    occupation: '',
    password: '',
  })

  const [termsAccepted, setTermsAccepted] = useState(false)
  const [countryCode, setCountryCode] = useState('+254') // Default country code for Kenya

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string, field: string) => {
    if (field === 'gender') {
      setFormData(prev => ({ ...prev, gender: value }))
    } else if (field === 'countryCode') {
      setCountryCode(value)
    }
  }

  const handleLogin = () => {
    router.push('/auth/login')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!termsAccepted) {
      alert("Please accept the terms and conditions before proceeding.")
      return
    }

    const registrationData = {
      username: formData.username,
      password: formData.password,
      profile: {
        phone_number: `${countryCode}${formData.phoneNumber}`,
        gender: formData.gender,
        occupation: formData.occupation,
        date_of_birth: formData.dateOfBirth,
        email: formData.email
      }
    }

    try {
      const response = await axios.post('http://localhost:8000/api/register/', registrationData)
      console.log('Registration successful:', response.data)
      router.push('/auth/login')
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Enter your details to register</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">UserName</Label>
              <Input
                id="username"
                name="username"
                placeholder="John Doe"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleSelectChange(value, 'gender')}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="flex">
                <Select value={countryCode} onValueChange={(value) => handleSelectChange(value, 'countryCode')}>
                  <SelectTrigger id="countryCode">
                    <SelectValue placeholder="Country Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+254">+254 (Kenya)</SelectItem>
                    <SelectItem value="+1">+1 (USA)</SelectItem>
                    <SelectItem value="+44">+44 (UK)</SelectItem>
                    {/* Add other country codes as needed */}
                  </SelectContent>
                </Select>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="717382028"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Occupation */}
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                name="occupation"
                placeholder="Engineer"
                value={formData.occupation}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="johndoe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Terms and Conditions */}
            <div className="space-y-2">
              <Label>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mr-2"
                />
                I have read and agree to the{" "}
                <a href="https://onedrive.live.com/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  terms and conditions
                </a>.
              </Label>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit}>Register</Button>
          <Button 
            className="w-full mt-4" 
            variant="outline" 
            onClick={handleLogin} 
          >
           Already have an account? Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
