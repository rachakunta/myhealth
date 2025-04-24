// MainLayout removed as we're using DashboardLayout from App.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { HealthMetrics } from "@shared/schema";
import { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const heartRateData = [
  { day: "Mon", value: 72 },
  { day: "Tue", value: 76 },
  { day: "Wed", value: 74 },
  { day: "Thu", value: 70 },
  { day: "Fri", value: 75 },
  { day: "Sat", value: 71 },
  { day: "Sun", value: 68 },
];

const stepsData = [
  { day: "Mon", value: 8245 },
  { day: "Tue", value: 7890 },
  { day: "Wed", value: 9200 },
  { day: "Thu", value: 7500 },
  { day: "Fri", value: 8750 },
  { day: "Sat", value: 10200 },
  { day: "Sun", value: 6800 },
];

const sleepData = [
  { day: "Mon", value: 7.2 },
  { day: "Tue", value: 6.8 },
  { day: "Wed", value: 7.5 },
  { day: "Thu", value: 6.2 },
  { day: "Fri", value: 6.9 },
  { day: "Sat", value: 8.1 },
  { day: "Sun", value: 7.7 },
];

const bloodPressureData = [
  { day: "Mon", systolic: 122, diastolic: 78 },
  { day: "Tue", systolic: 125, diastolic: 80 },
  { day: "Wed", systolic: 119, diastolic: 77 },
  { day: "Thu", systolic: 121, diastolic: 79 },
  { day: "Fri", systolic: 124, diastolic: 81 },
  { day: "Sat", systolic: 118, diastolic: 76 },
  { day: "Sun", systolic: 120, diastolic: 78 },
];

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phoneNumber: z.string().min(10, "Please enter a valid phone number."),
  dateOfBirth: z.string().min(1, "Please enter your date of birth."),
  gender: z.string().min(1, "Please select your gender."),
  address: z.string().min(5, "Please enter your address."),
});

export default function ManagePage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<string>("week");
  
  const { data: healthMetrics } = useQuery<HealthMetrics[]>({
    queryKey: ["/api/health-metrics"],
  });
  
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      dateOfBirth: user?.dateOfBirth || "",
      gender: user?.gender || "",
      address: user?.address || "",
    },
  });
  
  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    // Update profile information
    console.log(values);
  }

  return (
    <>
      <div className="pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
          Manage Your Health
        </h1>
        <p className="text-neutral-700 mt-1">Track your health metrics and manage your profile</p>
      </div>

      <Tabs defaultValue="health-metrics" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="health-metrics">Health Metrics</TabsTrigger>
          <TabsTrigger value="profile">Your Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="health-metrics" className="mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2 md:mb-0">Health Metrics Dashboard</h2>
            <div>
              <select 
                className="bg-neutral-100 border border-neutral-200 text-neutral-700 py-2 px-3 rounded-lg text-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 90 days</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Heart Rate Chart */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Heart Rate</CardTitle>
                    <CardDescription>Average resting heart rate</CardDescription>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary-light bg-opacity-20 flex items-center justify-center">
                    <i className="fas fa-heartbeat text-primary"></i>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={heartRateData}>
                      <XAxis 
                        dataKey="day" 
                        tickLine={false}
                        axisLine={false}
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis 
                        domain={[60, 100]}
                        tickLine={false}
                        axisLine={false}
                        width={30}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'white', 
                          border: '1px solid #e5e9f0',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value) => [`${value} bpm`, 'Heart Rate']}
                      />
                      <Line 
                        type="monotone"
                        dataKey="value"
                        stroke="#1D70B8"
                        strokeWidth={3}
                        dot={{ fill: "#1D70B8", strokeWidth: 2, r: 4 }}
                        activeDot={{ fill: "#1D70B8", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm text-neutral-700">Average: <span className="font-medium">72 bpm</span></div>
                  <Button variant="ghost" size="sm" className="text-primary">View Details</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Steps Chart */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Daily Steps</CardTitle>
                    <CardDescription>Steps tracked each day</CardDescription>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-secondary-light bg-opacity-20 flex items-center justify-center">
                    <i className="fas fa-shoe-prints text-secondary"></i>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stepsData}>
                      <XAxis 
                        dataKey="day" 
                        tickLine={false}
                        axisLine={false}
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis 
                        domain={[5000, 12000]}
                        tickLine={false}
                        axisLine={false}
                        width={40}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'white', 
                          border: '1px solid #e5e9f0',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value) => [`${value.toLocaleString()} steps`, 'Steps']}
                      />
                      <Line 
                        type="monotone"
                        dataKey="value"
                        stroke="#5FBAA0"
                        strokeWidth={3}
                        dot={{ fill: "#5FBAA0", strokeWidth: 2, r: 4 }}
                        activeDot={{ fill: "#5FBAA0", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm text-neutral-700">Average: <span className="font-medium">8,369 steps</span></div>
                  <Button variant="ghost" size="sm" className="text-primary">View Details</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Sleep Chart */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sleep Duration</CardTitle>
                    <CardDescription>Hours of sleep per night</CardDescription>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-accent-light bg-opacity-20 flex items-center justify-center">
                    <i className="fas fa-moon text-accent"></i>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sleepData}>
                      <XAxis 
                        dataKey="day" 
                        tickLine={false}
                        axisLine={false}
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis 
                        domain={[5, 9]}
                        tickLine={false}
                        axisLine={false}
                        width={30}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'white', 
                          border: '1px solid #e5e9f0',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value) => [`${value} hours`, 'Sleep']}
                      />
                      <Line 
                        type="monotone"
                        dataKey="value"
                        stroke="#FF9554"
                        strokeWidth={3}
                        dot={{ fill: "#FF9554", strokeWidth: 2, r: 4 }}
                        activeDot={{ fill: "#FF9554", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm text-neutral-700">Average: <span className="font-medium">7.2 hours</span></div>
                  <Button variant="ghost" size="sm" className="text-primary">View Details</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Blood Pressure Chart */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Blood Pressure</CardTitle>
                    <CardDescription>Systolic/Diastolic measurements</CardDescription>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-info bg-opacity-20 flex items-center justify-center">
                    <i className="fas fa-heart text-info"></i>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bloodPressureData}>
                      <XAxis 
                        dataKey="day" 
                        tickLine={false}
                        axisLine={false}
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis 
                        domain={[60, 140]}
                        tickLine={false}
                        axisLine={false}
                        width={30}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'white', 
                          border: '1px solid #e5e9f0',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value, name) => [
                          `${value} mmHg`, 
                          name === 'systolic' ? 'Systolic' : 'Diastolic'
                        ]}
                      />
                      <Line 
                        type="monotone"
                        dataKey="systolic"
                        stroke="#17A2B8"
                        strokeWidth={3}
                        dot={{ fill: "#17A2B8", strokeWidth: 2, r: 4 }}
                        activeDot={{ fill: "#17A2B8", strokeWidth: 2, r: 6 }}
                      />
                      <Line 
                        type="monotone"
                        dataKey="diastolic"
                        stroke="#5FBAA0"
                        strokeWidth={3}
                        dot={{ fill: "#5FBAA0", strokeWidth: 2, r: 4 }}
                        activeDot={{ fill: "#5FBAA0", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm text-neutral-700">Average: <span className="font-medium">121/78 mmHg</span></div>
                  <Button variant="ghost" size="sm" className="text-primary">View Details</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Connected Devices & Apps</h3>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center mr-4">
                        <i className="fab fa-apple text-neutral-900 text-2xl"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Apple Health</h4>
                        <p className="text-sm text-neutral-700">Connected since Oct 12, 2023</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs mr-2 bg-success bg-opacity-10 text-success py-1 px-2 rounded-full">Active</span>
                      <Button variant="ghost" size="sm">
                        <i className="fas fa-cog"></i>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center mr-4">
                        <i className="fab fa-fitbit text-neutral-900 text-2xl"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Fitbit</h4>
                        <p className="text-sm text-neutral-700">Connected since Sep 5, 2023</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs mr-2 bg-success bg-opacity-10 text-success py-1 px-2 rounded-full">Active</span>
                      <Button variant="ghost" size="sm">
                        <i className="fas fa-cog"></i>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center mr-4">
                        <i className="fas fa-heartbeat text-neutral-900 text-2xl"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">WithingsBP Connect</h4>
                        <p className="text-sm text-neutral-700">Blood pressure monitor</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center mr-4">
                        <i className="fas fa-plus text-neutral-900 text-2xl"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Connect a new device</h4>
                        <p className="text-sm text-neutral-700">Add more health tracking devices</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button size="sm">Add Device</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center space-y-4">
                  {user?.profileImage ? (
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={user.profileImage} alt={user.fullName} />
                      <AvatarFallback>{user.fullName?.charAt(0) || user.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-4xl text-white">
                      {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-medium">{user?.fullName}</h3>
                    <p className="text-neutral-700">{user?.email}</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <i className="fas fa-camera mr-2"></i> Change Photo
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-notifications">App Notifications</Label>
                      <div className="text-sm text-neutral-700">Receive in-app notifications</div>
                    </div>
                    <Switch id="app-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <div className="text-sm text-neutral-700">Receive email updates</div>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <div className="text-sm text-neutral-700">Receive text message alerts</div>
                    </div>
                    <Switch id="sms-notifications" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Your email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="non-binary">Non-binary</SelectItem>
                                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Your address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-1">Change Password</h4>
                      <p className="text-sm text-neutral-700 mb-4">Update your password regularly for better security</p>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-1">Two-Factor Authentication</h4>
                      <p className="text-sm text-neutral-700 mb-4">Add an extra layer of security to your account</p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-1">Health Data Privacy</h4>
                    <p className="text-sm text-neutral-700 mb-4">Manage how your health data is used</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="data-sharing" />
                        <Label htmlFor="data-sharing">Share anonymized data for research</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="third-party" />
                        <Label htmlFor="third-party">Allow third-party app access</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
