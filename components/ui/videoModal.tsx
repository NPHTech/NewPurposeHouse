"use client"

import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl?: string
  title?: string
}

export function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  // Determine video type and render appropriate player
  const renderVideo = () => {
    if (!videoUrl) {
      // Placeholder video for demonstration
      return (
        <div className="w-full aspect-video bg-gray-900 flex items-center justify-center rounded-lg">
          <div className="text-center text-white">
            <p className="text-lg mb-2">Video Player Placeholder</p>
            <p className="text-sm text-gray-400">
              Video URL will be configured here
            </p>
          </div>
        </div>
      )
    }

    // Check if it's a YouTube URL
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      const videoId = videoUrl.includes("youtube.com/watch?v=")
        ? videoUrl.split("v=")[1]?.split("&")[0]
        : videoUrl.includes("youtu.be/")
        ? videoUrl.split("youtu.be/")[1]?.split("?")[0]
        : null

      if (videoId) {
        return (
          <iframe
            className="w-full aspect-video rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )
      }
    }

    // Check if it's a Vimeo URL
    if (videoUrl.includes("vimeo.com")) {
      const videoId = videoUrl.split("vimeo.com/")[1]?.split("?")[0]
      if (videoId) {
        return (
          <iframe
            className="w-full aspect-video rounded-lg"
            src={`https://player.vimeo.com/video/${videoId}`}
            title={title || "Video"}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )
      }
    }

    // Assume it's a direct video file
    return (
      <video
        className="w-full aspect-video rounded-lg"
        controls
        autoPlay
        src={videoUrl}
      >
        Your browser does not support the video tag.
      </video>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 bg-transparent border-none shadow-none [&>button]:hidden">
        <div className="relative w-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 z-10 rounded-full bg-white/10 hover:bg-white/20 p-2 transition-colors text-white"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
          
          {/* Video container */}
          <div className="bg-black rounded-lg overflow-hidden">
            {renderVideo()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

