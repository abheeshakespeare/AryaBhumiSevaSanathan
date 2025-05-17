import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface VolunteerDialogProps {
  isOpen: boolean
  onClose: () => void
  onJoinClick: () => void
}

export function VolunteerDialog({ isOpen, onClose, onJoinClick }: VolunteerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-teal-700">Volunteer with ABSS</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-gray-700">
          <section className="space-y-3">
            <h3 className="font-semibold text-lg">Make a Difference</h3>
            <p>Join Arya Bhumi Seva Sansthan (ABSS) as a volunteer and be part of our mission to create positive change in society. Your time and skills can make a real difference in the lives of others.</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-lg">Volunteer Opportunities</h3>
            <div className="grid gap-4">
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium">Education Programs</h4>
                <p className="text-sm mt-1">Help teach underprivileged children and support our educational initiatives.</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium">Community Service</h4>
                <p className="text-sm mt-1">Participate in community development projects and social welfare activities.</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium">Healthcare Support</h4>
                <p className="text-sm mt-1">Assist in health camps and medical awareness programs.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-lg">Requirements</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Minimum age: 18 years (or 16+ with parental consent)</li>
              <li>Commitment to our values and mission</li>
              <li>Willingness to learn and work in a team</li>
              <li>Regular availability for assigned activities</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-lg">Benefits</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Make a positive impact in the community</li>
              <li>Gain valuable experience and skills</li>
              <li>Network with like-minded individuals</li>
              <li>Certificate of appreciation</li>
            </ul>
          </section>

          <div className="pt-4">
            <Button 
              onClick={onJoinClick}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              Join ABSS as a Volunteer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 