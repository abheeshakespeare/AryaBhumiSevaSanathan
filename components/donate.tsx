"use client"

import { useState } from "react"
import Image from "next/image"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const formSchema = z.object({
  amount: z.string().min(1, {
    message: "Please select or enter an amount.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  transactionId: z.string().optional(),
})

export default function Donate() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customAmount, setCustomAmount] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' })
  const supabase = createClientComponentClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "500",
      name: "",
      email: "",
      phone: "",
      transactionId: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setAlert({ type: null, message: '' })

    try {
      // Validate amount
      const amount = parseFloat(values.amount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount')
      }

      const { error } = await supabase
        .from('donation_records')
        .insert([{
          amount: amount,
          name: values.name,
          email: values.email,
          phone: values.phone,
          transaction_id: values.transactionId,
          payment_method: 'upi',
          status: 'pending',
        }])

      if (error) throw error

      setAlert({
        type: 'success',
        message: 'Thank you for your generous contribution!'
      })

      // Reset form after successful submission
      form.reset()
      setCustomAmount(false)

    } catch (error: any) {
      console.error('Error submitting donation:', error)
      setAlert({
        type: 'error',
        message: error.message || 'Failed to process donation. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="donate" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Make a Donation</h2>
            <div className="w-20 h-1 bg-teal-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your contribution can make a significant difference in someone's life. Every donation counts towards our mission of creating positive change.
            </p>
          </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Donation Methods</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">UPI Payment</h4>
                  <p className="text-gray-600 mb-4">Scan the QR code or use our UPI ID: aryabhumiseva@sbi</p>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <Image
                      src="/qr.jpg?height=200&width=200"
                      alt="UPI QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Bank Transfer</h4>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Account Name:</span> ARYA BHUMI SEVA SANSTHAN
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Account Number:</span> 42814537073
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">IFSC Code:</span> SBIN0001062
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Bank:</span> State Bank Of India
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Branch:</span> Latehar, Jharkhand
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Make a Donation</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Donation Amount (₹)</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              if (value === "custom") {
                                setCustomAmount(true)
                                field.onChange("")
                              } else {
                                setCustomAmount(false)
                                field.onChange(value)
                              }
                            }}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-4"
                          >
                            {["500", "1000", "2000", "5000"].map((amount) => (
                              <div key={amount} className="flex items-center space-x-2">
                                <RadioGroupItem value={amount} id={`amount-${amount}`} />
                                <label
                                  htmlFor={`amount-${amount}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  ₹{amount}
                                </label>
                              </div>
                            ))}
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="custom" id="amount-custom" />
                              <label
                                htmlFor="amount-custom"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Custom
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        {customAmount && (
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            onChange={(e) => field.onChange(e.target.value)}
                            className="mt-2"
                          />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email" {...field} />
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
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="transactionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction ID</FormLabel>
                        <FormControl>
                          <Input placeholder="UPI Transaction ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Complete Donation"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
