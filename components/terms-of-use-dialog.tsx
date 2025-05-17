import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TermsOfUseDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsOfUseDialog({ isOpen, onClose }: TermsOfUseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-teal-700">Terms of Use</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-gray-700">
          <p className="font-semibold text-lg">Last Updated: March 2024</p>
          
          <section className="space-y-2">
            <h3 className="font-semibold text-lg">1. Acceptance of Terms</h3>
            <p>By accessing and using the Arya Bhumi Seva Sansthan (ABSS) website, you accept and agree to be bound by these Terms of Use and our Privacy Policy.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-lg">2. Use of Website</h3>
            <p>You agree to use our website only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use of the website.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-lg">3. Donations</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>All donations are final and non-refundable</li>
              <li>We provide donation receipts for tax purposes</li>
              <li>Donations will be used in accordance with our mission and objectives</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-lg">4. Volunteer Participation</h3>
            <p>When participating in our volunteer programs:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You must be at least 18 years old or have parental consent</li>
              <li>You agree to follow our volunteer guidelines and code of conduct</li>
              <li>You participate at your own risk and responsibility</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-lg">5. Intellectual Property</h3>
            <p>All content on this website is the property of Arya Bhumi Seva Sansthan and is protected by copyright laws.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-lg">6. Contact Information</h3>
            <p>For any questions regarding these terms, please contact us at:</p>
            <p>Email: info@aryabhumisevasansthan.org</p>
            <p>Phone: +91 XXXXXXXXXX</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
} 