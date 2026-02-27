'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'

export function UpdateModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-8 max-w-[320px] w-full text-center"
          >
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
              <FiCheck size={28} />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-2 italic">Protocol Updated</h3>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide leading-relaxed mb-8">
              System access credentials have been synchronized.
            </p>
            <button onClick={onClose} className="w-full py-3 bg-slate-950 hover:bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all">
              Acknowledge
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}