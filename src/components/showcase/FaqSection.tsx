'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'How is the ride fare calculated on RoadMate?',
    a: 'Ride fares are calculated based on the base fare for the selected vehicle type plus the price per kilometer for your route distance. Estimated fares are shown upfront before you confirm.',
  },
  {
    q: 'What types of vehicles can I book on RoadMate?',
    a: 'You can book 2-wheeler bikes for fast solo commutes, auto-rickshaws, 4-wheeler sedans/hatchbacks, and commercial trucks/loading vehicles for goods delivery.',
  },
  {
    q: 'How do I become a verified vehicle partner?',
    a: 'Click "Become a Partner" in the top navigation bar, register your vehicle details and owner documents, and start accepting rides once approved by our team.',
  },
  {
    q: 'Can I track my driver in real-time?',
    a: 'Yes! RoadMate includes built-in live GPS tracking powered by Socket.io, allowing you to monitor your driver’s location live on the map from dispatch to destination.',
  },
]

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section className="py-16 md:py-24 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-md border border-border">
          <HelpCircle size={14} />
          Frequently Asked Questions
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Got Questions? We Have Answers.
        </h2>
      </div>

      <div className="space-y-3">
        {FAQS.map((item, idx) => {
          const isOpen = openIdx === idx
          return (
            <div
              key={idx}
              className="bg-card border border-border/80 rounded-lg overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-semibold text-foreground text-sm sm:text-base focus:outline-none"
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-5 sm:px-5 text-muted-foreground text-sm leading-relaxed border-t border-border/60 pt-3">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
