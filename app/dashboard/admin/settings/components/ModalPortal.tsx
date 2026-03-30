'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalPortalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function ModalPortal({ isOpen, onClose, children }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false)

  // 1. Ensure component is mounted on client to access document.body
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // 2. Prevent background scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          // The Backdrop
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div 
            // The Modal Card
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the card
            className="w-full max-w-sm pointer-events-auto"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}