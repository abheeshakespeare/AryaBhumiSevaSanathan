"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface JoinFormProps {
  isOpen: boolean
  onClose: () => void
}

export function JoinForm({ isOpen, onClose }: JoinFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' })
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    mobileNumber: "",
    email: "",
    address: "",
    qualification: "",
    areasOfInterest: [] as string[],
    availability: "",
    preferredMode: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAlert({ type: null, message: '' })

    try {
      // Validate required fields
      if (!formData.fullName || !formData.dateOfBirth || !formData.gender || 
          !formData.mobileNumber || !formData.email || !formData.address || 
          !formData.qualification || formData.areasOfInterest.length === 0 || 
          !formData.availability || !formData.preferredMode) {
        throw new Error('Please fill in all required fields')
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address')
      }

      // Validate phone number format
      const phoneRegex = /^[0-9]{10}$/
      if (!phoneRegex.test(formData.mobileNumber)) {
        throw new Error('Please enter a valid 10-digit phone number')
      }

      const { error } = await supabase
        .from('join_us_submissions')
        .insert([{
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          mobile_number: formData.mobileNumber,
          email: formData.email,
          address: formData.address,
          qualification: formData.qualification,
          areas_of_interest: formData.areasOfInterest,
          availability: formData.availability,
          preferred_mode: formData.preferredMode,
        }])

      if (error) {
        if (error.code === '23505') {
          throw new Error('A submission with this email already exists')
        } else if (error.code === '42501') {
          throw new Error('Permission denied. Please try again later')
        } else {
          throw new Error(error.message || 'Failed to submit form')
        }
      }

      setAlert({
        type: 'success',
        message: 'Form submitted successfully! We will reach back to you soon.'
      })
      
      // Reset form after successful submission
      setFormData({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        mobileNumber: "",
        email: "",
        address: "",
        qualification: "",
        areasOfInterest: [],
        availability: "",
        preferredMode: "",
      })

      // Close dialog after 2 seconds
      setTimeout(() => {
        onClose()
        router.push("/")
      }, 2000)

    } catch (error: any) {
      console.error('Error submitting form:', error)
      setAlert({
        type: 'error',
        message: error.message || 'Failed to submit form. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      areasOfInterest: prev.areasOfInterest.includes(interest)
        ? prev.areasOfInterest.filter(i => i !== interest)
        : [...prev.areasOfInterest, interest]
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-teal-700">Join Our Team</DialogTitle>
        </DialogHeader>

        {alert.type && (
          <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="mb-4">
            {alert.type === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                required
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number *</Label>
              <Input
                id="mobileNumber"
                type="tel"
                required
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email ID *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">Highest Qualification *</Label>
              <Select
                required
                value={formData.qualification}
                onValueChange={(value) => setFormData({ ...formData, qualification: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="matriculate">Matriculate</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer Not To Say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Areas of Interest *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "Education & Tutoring 📚",
                "Health & Awareness Campaigns 🏥",
                "Women Empowerment Programs 👩‍🎓",
                "Environmental Conservation 🌱",
                "Fundraising & Sponsorships 💰",
                "Event Organization 🎉",
                "Content Writing & Social Media 📢",
                "Administrative & Data Entry Support 🖥",
                "Other…"
              ].map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.areasOfInterest.includes(interest)}
                    onCheckedChange={() => handleInterestChange(interest)}
                  />
                  <Label htmlFor={interest}>{interest}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availability">Availability *</Label>
              <Select
                required
                value={formData.availability}
                onValueChange={(value) => setFormData({ ...formData, availability: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredMode">Preferred Mode of Volunteering *</Label>
              <Select
                required
                value={formData.preferredMode}
                onValueChange={(value) => setFormData({ ...formData, preferredMode: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-field">On-field (Community Work)</SelectItem>
                  <SelectItem value="online">Online (Content, Awareness, Administrative Support)</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-teal-600 hover:bg-teal-700" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 