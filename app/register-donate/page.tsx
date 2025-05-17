"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Droplet } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

// Complete states and districts of India as per latest data
const statesAndDistricts = {
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Krishna", "Kurnool",
    "Nellore", "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", "Visakhapatnam", "Vizianagaram", "West Godavari"
  ],
  "Arunachal Pradesh": [
    "Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi",
    "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang",
    "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw",
    "Changlang", "Tirap", "Longding"
  ],
  "Assam": [
    "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang",
    "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi",
    "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj",
    "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar",
    "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"
  ],
  "Bihar": [
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar",
    "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur",
    "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger",
    "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur",
    "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"
  ],
  "Chhattisgarh": [
    "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur",
    "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur",
    "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli",
    "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"
  ],
  "Goa": [
    "North Goa", "South Goa"
  ],
  "Gujarat": [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar",
    "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar",
    "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana",
    "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot",
    "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
  ],
  "Haryana": [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurgaon", "Hisar",
    "Jhajjar", "Jind", "Karnal", "Kaithal", "Kurukshetra", "Mahendragarh", "Mewat",
    "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti",
    "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
  ],
  "Jharkhand": [
    "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "Garhwa", "Giridih", "Godda",
    "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga",
    "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Saraikela Kharsawan", "Simdega"
  ],
  "Karnataka": [
    "Bagalkot", "Bangalore Rural", "Bangalore Urban", "Belgaum", "Bellary", "Bidar",
    "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada",
    "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kodagu", "Kolar", "Koppal",
    "Mandya", "Mysore", "Raichur", "Ramanagara", "Shimoga", "Tumkur", "Udupi", "Uttar Kannada",
    "Yadgir"
  ],
  "Kerala": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam",
    "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram",
    "Thrissur", "Wayanad"
  ],
  "Madhya Pradesh": [
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul",
    "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia",
    "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore",
    "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena",
    "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar",
    "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi",
    "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
  ],
  "Maharashtra": [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana",
    "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna",
    "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded",
    "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad",
    "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha",
    "Washim", "Yavatmal"
  ],
  "Manipur": [
    "Bishnupur", "Churachandpur", "Chandel", "Imphal East", "Imphal West",
    "Senapati", "Tamenglong", "Thoubal", "Ukhrul"
  ],
  "Meghalaya": [
    "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills",
    "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills",
    "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"
  ],
  "Mizoram": [
    "Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saitual",
    "Serchhip", "Hnahthial"
  ],
  "Nagaland": [
    "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren",
    "Phek", "Tuensang", "Wokha", "Zunheboto"
  ],
  "Odisha": [
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Bolinjur", "Boudh",
    "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur",
    "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar",
    "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh",
    "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"
  ],
  "Punjab": [
    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib",
    "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar",
    "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot",
    "Patiala", "Rupnagar", "Sangrur", "Shahid Bhagat Singh Nagar", "Tarn Taran"
  ],
  "Rajasthan": [
    "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara",
    "Bikaner", "Budhsingh Nagar", "Chittorgarh", "Churu", "Dausa", "Dholpur",
    "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar",
    "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh",
    "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Tonk", "Udaipur"
  ],
  "Sikkim": [
    "East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"
  ],
  "Tamil Nadu": [
    "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
    "Erode", "Kancheepuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai",
    "Nagapattinam", "Namakkal", "Perambalur", "Pudukottai", "Ramanathapuram",
    "Salem", "Sivaganga", "Thanjavur", "The Nilgiris", "Theni", "Thoothukudi",
    "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai",
    "Vellore", "Viluppuram", "Virudhunagar"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
    "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahbubnagar", "Mancherial",
    "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet",
    "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy",
    "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural",
    "Warangal Urban", "Yadadri Bhuvanagiri"
  ],
  "Tripura": [
    "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura",
    "Unakoti", "West Tripura"
  ],
  "Uttar Pradesh": [
    "Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya",
    "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki",
    "Bareilly", "Basti", "Bhayandar", "Bijnor", "Bulandshahr", "Chandauli", "Chitrakoot",
    "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar",
    "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras",
    "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj",
    "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj",
    "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar",
    "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar",
    "Shahjahanpur", "Shamli", "Shravasti", "Siddharth Nagar", "Sitapur", "Sonbhadra",
    "Sultanpur", "Unnao", "Varanasi"
  ],
  "Uttarakhand": [
    "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar",
    "Nainital", "Pauri Garhwal", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar",
    "Uttarkashi"
  ],
  "West Bengal": [
    "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur",
    "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong",
    "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman",
    "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia",
    "South 24 Parganas", "Uttar Dinajpur"
  ],
  // Union Territories
  "Andaman and Nicobar Islands": [
    "Nicobar", "North and Middle Andaman", "South Andaman"
  ],
  "Chandigarh": [
    "Chandigarh"
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Dadra and Nagar Haveli", "Daman", "Diu"
  ],
  "Delhi": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi",
    "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"
  ],
  "Jammu and Kashmir": [
    "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal",
    "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch",
    "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian",
    "Srinagar", "Udhampur"
  ],
  "Ladakh": [
    "Kargil", "Leh"
  ],
  "Lakshadweep": [
    "Agatti", "Amini", "Andrott", "Bitra", "Chetlat", "Kavaratti", "Kadmat", "Minicoy"
  ],
  "Puducherry": [
    "Karaikal", "Mahe", "Pondicherry", "Yanam"
  ]
};

export default function RegisterDonate() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [consent, setConsent] = useState(false)
  const [selectedState, setSelectedState] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [contentHeight, setContentHeight] = useState("auto")
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' })
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    age: "",
    bloodGroup: "",
    weight: "",
    phoneNumber: "",
    alternatePhone: "",
    email: "",
    address: "",
    pincode: "",
  })

  useEffect(() => {
    // Calculate available height for the main content
    const calculateHeight = () => {
      const windowHeight = window.innerHeight;
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const footerHeight = document.querySelector('footer')?.offsetHeight || 0;
      const availableHeight = windowHeight - headerHeight - footerHeight;
      setContentHeight(`${availableHeight}px`);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    
    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, []);

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setSelectedDistrict("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAlert({ type: null, message: '' })

    try {
      // Validate required fields
      if (!formData.fullName || !formData.gender || !formData.dateOfBirth || 
          !formData.age || !formData.bloodGroup || !formData.phoneNumber || 
          !formData.email || !formData.address || !selectedState || 
          !selectedDistrict || !formData.pincode) {
        throw new Error('Please fill in all required fields')
      }

      // Validate age
      const age = parseInt(formData.age)
      if (isNaN(age) || age < 18 || age > 65) {
        throw new Error('Age must be between 18 and 65 years')
      }

      // Validate phone number
      const phoneRegex = /^[0-9]{10}$/
      if (!phoneRegex.test(formData.phoneNumber)) {
        throw new Error('Please enter a valid 10-digit phone number')
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address')
      }

      // Validate pincode
      const pincodeRegex = /^[0-9]{6}$/
      if (!pincodeRegex.test(formData.pincode)) {
        throw new Error('Please enter a valid 6-digit pincode')
      }

      if (!consent) {
        throw new Error("Please provide consent to proceed")
      }

      const { error } = await supabase
        .from('blood_donation_registrations')
        .insert([{
          full_name: formData.fullName,
          gender: formData.gender,
          date_of_birth: formData.dateOfBirth,
          age: parseInt(formData.age),
          blood_group: formData.bloodGroup,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          phone_number: formData.phoneNumber,
          alternate_phone: formData.alternatePhone || null,
          email: formData.email,
          address: formData.address,
          state: selectedState,
          district: selectedDistrict,
          pincode: formData.pincode,
          consent: true,
        }])

      if (error) throw error

      setAlert({
        type: 'success',
        message: 'Registration successful! We will contact you for donation drives.'
      })

      // Reset form after successful submission
      setFormData({
        fullName: "",
        gender: "",
        dateOfBirth: "",
        age: "",
        bloodGroup: "",
        weight: "",
        phoneNumber: "",
        alternatePhone: "",
        email: "",
        address: "",
        pincode: "",
      })
      setSelectedState("")
      setSelectedDistrict("")
      setConsent(false)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/")
      }, 2000)

    } catch (error: any) {
      console.error('Error submitting form:', error)
      setAlert({
        type: 'error',
        message: error.message || 'Failed to submit registration. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Blood group badges with color coding
  const BloodGroupBadge = ({ group }: { group: string }) => (
    <div className={`flex items-center justify-center h-16 w-16 rounded-full ${
      group.includes('O') ? 'bg-blue-100 border-blue-500' : 
      group.includes('A') ? 'bg-green-100 border-green-500' : 
      group.includes('B') ? 'bg-purple-100 border-purple-500' : 
      'bg-red-100 border-red-500'
    } border-2 text-lg font-bold transition-transform hover:scale-105`}>
      {group}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster />
      <Header />
      
      <main className="flex-grow py-8 px-4 flex items-center justify-center mt-16" style={{ minHeight: contentHeight }}>
        <div className="container max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#08776e] to-[#1AB5A9] text-white p-6 text-center">
              <h1 className="text-2xl font-bold">Blood Donation Registration</h1>
              <p className="text-gray-100 opacity-90 mt-2">Join our community of blood donors and help save lives</p>
            </div>

            {alert.type && (
              <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="m-4">
                {alert.type === 'error' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            )}

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-1 bg-red-600 mr-3"></div>
                    <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name*</Label>
                      <Input 
                        id="name" 
                        placeholder="Enter your full name" 
                        required 
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="border-gray-300 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender*</Label>
                      <Select 
                        required
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger className="border-gray-300 focus:ring-red-500 focus:border-red-500">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-sm font-medium text-gray-700">Date of Birth*</Label>
                      <Input 
                        type="date" 
                        id="dob" 
                        required 
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="border-gray-300 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-medium text-gray-700">Age*</Label>
                      <Input 
                        type="number" 
                        id="age" 
                        placeholder="Enter your age" 
                        required 
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="border-gray-300 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup" className="text-sm font-medium text-gray-700">Blood Group*</Label>
                      <Select 
                        required
                        value={formData.bloodGroup}
                        onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                      >
                        <SelectTrigger className="border-gray-300 focus:ring-red-500 focus:border-red-500">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-sm font-medium text-gray-700">Weight (kg)</Label>
                      <Input 
                        type="number" 
                        id="weight" 
                        placeholder="Enter your weight" 
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="border-gray-300 focus:ring-red-500 focus:border-red-500"
                      />
                      <p className="text-xs text-gray-500">Minimum weight for donation: 45 kg</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-1 bg-red-600 mr-3"></div>
                    <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number*</Label>
                      <Input 
                        id="phone" 
                        placeholder="Enter your primary phone number" 
                        required 
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="border-gray-300 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="altPhone" className="text-sm font-medium text-gray-700">Alternate Phone Number</Label>
                      <Input 
                        id="altPhone" 
                        placeholder="Enter alternate phone number" 
                        value={formData.alternatePhone}
                        onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                        className="border-gray-300 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address*</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email address" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border-gray-300 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Residential Address */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-1 bg-red-600 mr-3"></div>
                    <h2 className="text-xl font-semibold text-gray-800">Residential Address</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">Full Address*</Label>
                      <Textarea 
                        id="address" 
                        placeholder="Enter your residential address" 
                        required 
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="border-gray-300 focus:ring-red-500 focus:border-red-500 min-h-24"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium text-gray-700">State*</Label>
                        <Select 
                          required 
                          value={selectedState}
                          onValueChange={handleStateChange}
                        >
                          <SelectTrigger className="border-gray-300 focus:ring-red-500 focus:border-red-500">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(statesAndDistricts).map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district" className="text-sm font-medium text-gray-700">District*</Label>
                        <Select
                          required
                          value={selectedDistrict}
                          onValueChange={setSelectedDistrict}
                          disabled={!selectedState}
                        >
                          <SelectTrigger className="border-gray-300 focus:ring-red-500 focus:border-red-500">
                            <SelectValue placeholder={selectedState ? "Select your district" : "Select state first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedState &&
                              statesAndDistricts[selectedState as keyof typeof statesAndDistricts]?.map((district: string) => (
                                <SelectItem key={district} value={district}>{district}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="md:w-1/2 space-y-2">
                      <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">Pincode*</Label>
                      <Input 
                        id="pincode" 
                        placeholder="Enter your pincode" 
                        required 
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="border-gray-300 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Consent */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-8">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="consent"
                      checked={consent}
                      onCheckedChange={(checked) => setConsent(checked === true)}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <Label htmlFor="consent" className="text-sm text-gray-700 font-medium">
                      I confirm that I am eligible to donate blood and consent to be contacted for donation drives*
                    </Label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-7">
                    By checking this box, you agree to our terms and conditions regarding blood donation eligibility and communication preferences.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    type="submit" 
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-all hover:shadow-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Register to Donate"}
                  </Button>
                  <Button variant="outline" asChild className="border-red-200 text-red-600 hover:bg-red-50">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}