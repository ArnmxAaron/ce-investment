'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FiLock, FiDelete, FiAlertCircle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface LockScreenProps {
  isOpen: boolean
  onUnlock: () => void
  correctPin: string
}

export function LockScreen({ isOpen, onUnlock, correctPin }: LockScreenProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num)
      setError(false)
    }
  }

  const handleDelete = () => setPin(prev => prev.slice(0, -1))

  // Logic to log failed attempts to Supabase
  const logFailedAttempt = async (attemptedPin: string) => {
    await supabase.from('security_logs').insert([
      { 
        event_type: 'FAILED_UNLOCK', 
        details: `Incorrect PIN entered: ${attemptedPin}`,
        created_at: new Date() 
      }
    ])
  }

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === correctPin) {
        onUnlock()
        setPin('')
      } else {
        setError(true)
        logFailedAttempt(pin)
        // Shake animation delay then reset
        setTimeout(() => setPin(''), 500)
      }
    }
  }, [pin, correctPin, onUnlock])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
        >
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div 
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transition-colors ${
                  error ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                <FiLock size={32} />
              </motion.div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">System Locked</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 italic">
                {error ? 'Access Denied' : 'Authorization Required'}
              </p>
            </div>

            {/* PIN Dots */}
            <div className="flex justify-center gap-6 mb-12">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    pin.length > i 
                      ? (error ? 'bg-rose-600 border-rose-600 scale-125' : 'bg-white border-white scale-110') 
                      : 'border-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePress(num)}
                  className="h-20 bg-white/5 hover:bg-white/10 text-white text-2xl font-black rounded-3xl transition-all active:scale-90"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                onClick={() => handlePress('0')}
                className="h-20 bg-white/5 hover:bg-white/10 text-white text-2xl font-black rounded-3xl transition-all active:scale-90"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="h-20 text-slate-500 hover:text-white flex items-center justify-center transition-colors active:scale-90"
              >
                <FiDelete size={24} />
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex items-center justify-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest"
              >
                <FiAlertCircle /> Invalid Admin Code
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}