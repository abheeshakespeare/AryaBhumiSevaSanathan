'use client'
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { Droplet, Search, MapPin, Phone, User } from "lucide-react";
import { env } from "@/app/config/env";

interface Donor {
  id: string;
  full_name: string;
  blood_group: string;
  age: number;
  state: string;
  district: string;
  phone_number: string;
}
// Full list of Indian states and their districts (updated version)
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


export default function NeedBlood() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [searchResults, setSearchResults] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [contentHeight, setContentHeight] = useState("auto");
  const supabase = createClientComponentClient();

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
    setSelectedState(state);
    setSelectedDistrict("");
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);

    try {
      if (!bloodGroup || !selectedState || !selectedDistrict) {
        throw new Error("Please select all required fields");
      }

      let query = supabase
        .from('blood_donation_registrations')
        .select('*');

      // Add filters only if they are selected
      if (bloodGroup) {
        query = query.eq('blood_group', bloodGroup);
      }
      if (selectedState) {
        query = query.eq('state', selectedState);
      }
      if (selectedDistrict) {
        query = query.eq('district', selectedDistrict);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching for donors:', error);
        throw new Error("Failed to search for donors. Please try again.");
      }

      setSearchResults(data || []);
    } catch (error: any) {
      console.error('Error searching for donors:', error);
      setSearchResults([]);
      // Show error toast or alert here if needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster />
      <Header />
      
      <main className="flex-grow py-8 px-4 flex items-center justify-center" style={{ minHeight: contentHeight }}>
        <div className="container max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-[#08776e] to-[#1AB5A9] text-white p-8 text-center">
              <div className="mb-4 flex justify-center">
                <Droplet size={48} className="animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Find Blood Donors</h1>
              <p className="text-gray-100 opacity-90">Connect with willing donors in your area and help save lives</p>
            </div>

            {/* Search form */}
            <div className="p-8">
              <form id="searchForm" className="space-y-6" onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className="text-gray-700 font-medium flex items-center gap-2">
                      <Droplet size={16} className="text-red-500" />
                      Blood Group*
                    </Label>
                    <Select value={bloodGroup} onValueChange={setBloodGroup} required>
                      <SelectTrigger className="bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-[#08776e] focus:border-[#08776e]">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-gray-700 font-medium flex items-center gap-2">
                      <MapPin size={16} className="text-gray-600" />
                      State*
                    </Label>
                    <Select value={selectedState} onValueChange={handleStateChange} required>
                      <SelectTrigger className="bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-[#08776e] focus:border-[#08776e]">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(statesAndDistricts).sort().map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-gray-700 font-medium flex items-center gap-2">
                      <MapPin size={16} className="text-gray-600" />
                      District*
                    </Label>
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict} required disabled={!selectedState}>
                      <SelectTrigger className="bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-[#08776e] focus:border-[#08776e]">
                        <SelectValue placeholder={selectedState ? "Select district" : "Select state first"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {selectedState &&
                          statesAndDistricts[selectedState as keyof typeof statesAndDistricts].sort().map(district => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    className="bg-[#08776e] hover:bg-[#1AB5A9] text-white font-bold py-3 px-8 rounded-full shadow-md transition-all duration-300 flex items-center gap-2"
                    disabled={isLoading || !bloodGroup || !selectedState || !selectedDistrict}
                  >
                    <Search size={18} />
                    {isLoading ? "Searching..." : "Search Donors"}
                  </Button>
                </div>
              </form>

              {/* Results section with animation */}
              <div className={`mt-10 transition-all duration-500 ease-in-out ${hasSearched ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={20} className="text-[#08776e]" />
                  Search Results
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {searchResults.length} donor{searchResults.length !== 1 ? 's' : ''} found
                  </span>
                </h2>
                
                {searchResults.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {searchResults.map((donor: any) => (
                          <tr key={donor.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donor.full_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 font-medium text-xs">
                                {donor.blood_group}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.age}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <MapPin size={14} className="mr-1 text-gray-400" />
                                {`${donor.district}, ${donor.state}`}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <a 
                                href={`tel:${donor.phone_number}`}
                                className="text-[#08776e] hover:text-[#1AB5A9] font-medium flex items-center"
                              >
                                <Phone size={14} className="mr-1" />
                                {donor.phone_number}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  hasSearched && (
                    <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="text-gray-400 mb-2">
                        <Search size={48} className="mx-auto opacity-50" />
                      </div>
                      <p className="text-gray-600">No donors found matching your criteria.</p>
                      <p className="text-gray-500 text-sm mt-2">Try selecting a different blood group or location.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}