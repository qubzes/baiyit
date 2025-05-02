"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, CreditCard, Bell, Shield, Upload, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const [avatar] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780")

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24 pb-16 md:pt-28">
        <div className="container mx-auto px-4">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-primary-navy mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Profile
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <motion.div
              className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative w-24 h-24 mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatar || "/placeholder.svg"} alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full bg-white">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold text-primary-navy">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy & Security
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Tabs defaultValue="profile">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue={user.name.split(" ")[0]} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue={user.name.split(" ")[1]} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" defaultValue={user.phone} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue={user.address} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue={user.city} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" defaultValue={user.state} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" defaultValue={user.zip} />
                    </div>
                  </div>

                  <Button className="bg-accent-sky hover:bg-accent-sky/90 text-white">Save Changes</Button>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <h3 className="text-lg font-medium text-primary-navy mb-4">AI Assistant Preferences</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-primary-navy">Save Chat History</p>
                        <p className="text-sm text-gray-500">Store your conversations with Baiyit</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-primary-navy">Personalized Recommendations</p>
                        <p className="text-sm text-gray-500">Allow Baiyit to learn from your preferences</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-primary-navy">Voice Assistance</p>
                        <p className="text-sm text-gray-500">Enable voice commands and responses</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-primary-navy mb-4 pt-4 border-t">Notification Preferences</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-primary-navy">Order Updates</p>
                        <p className="text-sm text-gray-500">Receive notifications about your orders</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-primary-navy">Deals & Promotions</p>
                        <p className="text-sm text-gray-500">Get notified about special offers</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <Button className="bg-accent-sky hover:bg-accent-sky/90 text-white">Save Preferences</Button>
                </TabsContent>

                <TabsContent value="payment" className="space-y-6">
                  <h3 className="text-lg font-medium text-primary-navy mb-4">Payment Methods</h3>

                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between bg-white">
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-blue-600 rounded mr-4 flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium text-primary-navy">Visa ending in 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between bg-white">
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-red-600 rounded mr-4 flex items-center justify-center text-white text-xs font-bold">
                          MC
                        </div>
                        <div>
                          <p className="font-medium text-primary-navy">Mastercard ending in 8888</p>
                          <p className="text-sm text-gray-500">Expires 09/24</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>

                  <Button className="bg-accent-sky hover:bg-accent-sky/90 text-white">Add Payment Method</Button>
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                  <h3 className="text-lg font-medium text-primary-navy mb-4">Order History</h3>

                  <div className="space-y-4">
                    {[
                      {
                        id: "ORD-1234",
                        date: "May 15, 2023",
                        total: "$299.99",
                        status: "Delivered",
                        items: 2,
                      },
                      {
                        id: "ORD-5678",
                        date: "April 3, 2023",
                        total: "$149.50",
                        status: "Delivered",
                        items: 1,
                      },
                      {
                        id: "ORD-9012",
                        date: "March 22, 2023",
                        total: "$599.99",
                        status: "Delivered",
                        items: 3,
                      },
                    ].map((order) => (
                      <div key={order.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex flex-wrap justify-between items-center">
                          <div>
                            <p className="font-medium text-primary-navy">{order.id}</p>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary-navy">{order.total}</p>
                            <p className="text-sm text-green-600">{order.status}</p>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                          <p className="text-sm text-gray-500">{order.items} items</p>
                          <Button variant="ghost" size="sm" className="text-accent-sky">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
