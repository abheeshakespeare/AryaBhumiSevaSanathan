"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, MapPin, Phone, Mail } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export default function Contact() {
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    setAlert({ type: null, message: '' })

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: values.name,
          email: values.email,
          phone: values.phone,
          subject: values.subject,
          message: values.message,
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
        message: 'Message sent successfully! We will get back to you soon.'
      })

      // Reset form after successful submission
      form.reset()

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

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left - Contact Info */}
          <div className="md:w-2/5 bg-gradient-to-br from-[#08776e] to-[#065a54] text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-white mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-gray-200">C/O- Kumud Ranjan Pandey</p>
                  <p className="text-gray-200">Vill - Hotwag, P.O- Parsahi</p>
                  <p className="text-gray-200">P.S / DIST- Latehar, Jharkhand, 829207</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="text-white mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-gray-200">+91 9471517320</p>
                  <p className="text-gray-200">+91 9775075897</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="text-white mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-200">aryabhumisevasansthan@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="https://wa.me/919471517320?text=Namaskaram...%20I%20want%20to%20join%20the%20online%20wellness%20program"
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <i className="bi bi-whatsapp"></i>
                </a>
                <a
                  href="https://www.instagram.com/aryabhumisevasansthan?igsh=MTJ2cmZsODRndHdjaA=="
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="md:w-3/5">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h2>
            <p className="text-gray-600 mb-8">
              Have questions about our initiatives? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            {alert.type && (
              <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="mb-6">
                {alert.type === 'error' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Subject of your message" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Your message" 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-teal-600 hover:bg-teal-700" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  )
}
