"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, X, CheckCircle, Clock } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BloodDonor {
  id: string
  full_name: string
  blood_group: string
  age: number
  state: string
  district: string
  phone_number: string
  created_at: string
}

interface Donation {
  id: string
  name: string
  amount: number
  email: string
  phone: string
  status: "pending" | "verified" | "rejected"
  created_at: string
}

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: "red" | "yellow" | "green"
  created_at: string
}

interface JoinRequest {
  id: string
  full_name: string
  email: string
  mobile_number: string
  qualification: string
  availability: string
  preferred_mode: string
  created_at: string
}

interface MonthlyDonation {
  month: string
  amount: number
}

export default function AdminPanel() {
  const router = useRouter()
  const [supabase] = useState(() => createClientComponentClient())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initError, setInitError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("blood-donors")
  const [searchTerm, setSearchTerm] = useState("")

  // Data states with proper typing
  const [bloodDonors, setBloodDonors] = useState<BloodDonor[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [monthlyDonations, setMonthlyDonations] = useState<MonthlyDonation[]>([])

  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem("isAdmin")
    if (!isAdmin) {
      router.push("/")
      return
    }

    // Verify Supabase configuration
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setInitError("Supabase configuration is missing. Please check your environment variables.")
      setIsLoading(false)
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch blood donors with error logging
      const { data: bloodDonorsData, error: bloodDonorsError } = await supabase
        .from("blood_donation_registrations")
        .select("*")
        .order("created_at", { ascending: false })

      if (bloodDonorsError) {
        console.error("Blood donors fetch error:", bloodDonorsError)
        throw new Error(`Failed to fetch blood donors: ${bloodDonorsError.message}`)
      }
      setBloodDonors(bloodDonorsData || [])

      // Fetch donations with error logging
      const { data: donationsData, error: donationsError } = await supabase
        .from("donation_records")
        .select("*")
        .order("created_at", { ascending: false })

      if (donationsError) {
        console.error("Donations fetch error:", donationsError)
        throw new Error(`Failed to fetch donations: ${donationsError.message}`)
      }
      setDonations(donationsData || [])

      // Process monthly donations
      const monthlyData = processMonthlyDonations(donationsData || [])
      setMonthlyDonations(monthlyData)

      // Fetch contacts with error logging
      const { data: contactsData, error: contactsError } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })

      if (contactsError) {
        console.error("Contacts fetch error:", contactsError)
        throw new Error(`Failed to fetch contacts: ${contactsError.message}`)
      }
      setContacts(contactsData || [])

      // Fetch join requests with error logging
      const { data: joinData, error: joinError } = await supabase
        .from("join_us_submissions")
        .select("*")
        .order("created_at", { ascending: false })

      if (joinError) {
        console.error("Join requests fetch error:", joinError)
        throw new Error(`Failed to fetch join requests: ${joinError.message}`)
      }
      setJoinRequests(joinData || [])

    } catch (error: any) {
      console.error("Error fetching data:", error)
      setError(error.message || "Failed to fetch data. Please check the console for more details.")
    } finally {
      setIsLoading(false)
    }
  }

  const processMonthlyDonations = (donations: Donation[]) => {
    const monthlyData: { [key: string]: number } = {}
    
    donations.forEach(donation => {
      const date = new Date(donation.created_at)
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
      
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + Number(donation.amount)
    })

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount
    }))
  }

  const getTotalDonations = () => {
    return donations.reduce((total, donation) => total + Number(donation.amount), 0)
  }

  const updateDonationStatus = async (donationId: string, newStatus: "pending" | "verified" | "rejected") => {
    try {
      const { error } = await supabase
        .from("donation_records")
        .update({ status: newStatus })
        .eq("id", donationId)

      if (error) throw error

      // Update local state
      setDonations(donations.map(donation => 
        donation.id === donationId ? { ...donation, status: newStatus } : donation
      ))
    } catch (error: any) {
      console.error("Error updating donation status:", error)
      setError("Failed to update donation status")
    }
  }

  const updateContactStatus = async (contactId: string, newStatus: "red" | "yellow" | "green") => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: newStatus })
        .eq("id", contactId)

      if (error) throw error

      // Update local state
      setContacts(contacts.map(contact => 
        contact.id === contactId ? { ...contact, status: newStatus } : contact
      ))
    } catch (error: any) {
      console.error("Error updating contact status:", error)
      setError("Failed to update contact status")
    }
  }

  if (initError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>{initError}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
        <span className="ml-3">Loading...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-teal-700">Admin Panel</h1>
        <Button 
          onClick={() => {
            localStorage.removeItem("isAdmin")
            router.push("/")
          }}
          variant="outline"
          className="text-red-600 hover:text-red-700"
        >
          Logout
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Blood Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{bloodDonors.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{getTotalDonations().toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Join Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{joinRequests.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Monthly Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyDonations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#08776e" name="Amount (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="blood-donors">Blood Donors</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="contacts">Contact Messages</TabsTrigger>
          <TabsTrigger value="join-requests">Join Requests</TabsTrigger>
        </TabsList>

        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        <TabsContent value="blood-donors">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bloodDonors
                    .filter(donor => 
                      donor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      donor.blood_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      donor.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      donor.district.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell>{donor.full_name}</TableCell>
                        <TableCell>{donor.blood_group}</TableCell>
                        <TableCell>{donor.age}</TableCell>
                        <TableCell>{donor.state}</TableCell>
                        <TableCell>{donor.district}</TableCell>
                        <TableCell>{donor.phone_number}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations
                    .filter(donation => 
                      donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      donation.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>{donation.name}</TableCell>
                        <TableCell>₹{donation.amount}</TableCell>
                        <TableCell>{donation.email}</TableCell>
                        <TableCell>{donation.phone}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            donation.status === "verified" ? "bg-green-100 text-green-800" :
                            donation.status === "rejected" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {donation.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={donation.status === "verified" ? "default" : "outline"}
                              onClick={() => updateDonationStatus(donation.id, "verified")}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={donation.status === "rejected" ? "destructive" : "outline"}
                              onClick={() => updateDonationStatus(donation.id, "rejected")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts
              .filter(contact => 
                contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.message.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((contact) => (
                <Card key={contact.id} className={`border-l-4 ${
                  contact.status === "green" ? "border-l-green-500" :
                  contact.status === "yellow" ? "border-l-yellow-500" :
                  "border-l-red-500"
                }`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{contact.subject}</CardTitle>
                      <Select
                        value={contact.status}
                        onValueChange={(value: "red" | "yellow" | "green") => 
                          updateContactStatus(contact.id, value)
                        }
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="red">
                            <span className="flex items-center">
                              <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                              Red
                            </span>
                          </SelectItem>
                          <SelectItem value="yellow">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                              Yellow
                            </span>
                          </SelectItem>
                          <SelectItem value="green">
                            <span className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                              Green
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-gray-500 mb-2">{contact.email}</p>
                    <p className="text-sm">{contact.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="join-requests">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Qualification</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Mode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {joinRequests
                    .filter(request => 
                      request.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      request.qualification.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.full_name}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.mobile_number}</TableCell>
                        <TableCell>{request.qualification}</TableCell>
                        <TableCell>{request.availability}</TableCell>
                        <TableCell>{request.preferred_mode}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 