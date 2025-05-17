import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PrivacyPolicyDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyPolicyDialog({ isOpen, onClose }: PrivacyPolicyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-teal-700">Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-gray-700">
          <p className="font-semibold text-lg">Last Updated: March 2024</p>
          
          <section className="space-y-2">
            <h3 className="font-semibold text-lg">1. Information We Collect</h3>
            <p>At Arya Bhumi Seva Sansthan (ABSS), we collect information that you provide directly to us when you:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Register as a volunteer</li>
              <li>Make a donation</li>
              <li>Sign up for our newsletter</li>
              <li>Contact us through our website</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-lg">2. How We Use Your Information</h3>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Process your donations and send receipts</li>
              <li>Communicate about our programs and initiatives</li>
              <li>Coordinate volunteer activities</li>
              <li>Improve our services and website functionality</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-lg">3. Information Security</h3>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-lg">4. Contact Us</h3>
            <p>If you have any questions about our Privacy Policy, please contact us at:</p>
            <p>Email: info@aryabhumisevasansthan.org</p>
            <p>Phone: +91 XXXXXXXXXX</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
} 