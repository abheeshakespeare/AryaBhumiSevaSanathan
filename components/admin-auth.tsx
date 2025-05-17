"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AdminAuthProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminAuth({ isOpen, onClose }: AdminAuthProps) {
  const router = useRouter()
  const [secretKey, setSecretKey] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secretKey }),
      })

      if (!response.ok) {
        throw new Error("Invalid secret key")
      }

      // Store admin session in localStorage
      localStorage.setItem("isAdmin", "true")
      
      // Close dialog and redirect to admin panel
      onClose()
      router.push("/admin")
    } catch (error: any) {
      setError(error.message || "Failed to verify secret key")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-teal-700">Admin Authentication</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter secret key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 