"use client"

import React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface PDFViewerProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
}

export default function PDFViewer({ isOpen, onClose, pdfUrl }: PDFViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        {/* Accessible visible title */}
        <DialogTitle className="text-lg font-bold px-4 py-2 border-b">
          Arya Bhumi Seva Sansthan Profile
        </DialogTitle>

        <div className="relative w-full h-full">
          {/* Download button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white hover:bg-gray-100"
              onClick={() => window.open(pdfUrl, "_blank")}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>

          {/* PDF Viewer iframe */}
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            className="w-full h-[85vh]"
            title="NGO Profile PDF"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
