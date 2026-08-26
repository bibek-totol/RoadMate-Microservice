'use client'
import React from 'react'
import { motion } from 'motion/react'
import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Daily Commuter',
    content: 'RoadMate makes booking bikes and autos so effortless. The driver details and upfront pricing give me complete peace of mind.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Vikram Singh',
    role: 'Vehicle Partner (Car Owner)',
    content: 'Registering my fleet on RoadMate was seamless. The partner dashboard tracking and daily payouts are unmatched.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ananya Verma',
    role: 'Logistics Manager',
    content: 'We use RoadMate loading trucks for our commercial goods transport. Real-time GPS tracking helps us manage deliveries reliably.',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30 border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-background px-3 py-1 rounded-md border border-border">
            Community Feedback
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Loved by Riders & Partners
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            See what our verified users and vehicle owners have to say about RoadMate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="bg-card border border-border/80 rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-3 text-amber-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote size={20} className="text-muted-foreground/40 mb-2" />
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{item.name}</h4>
                  <p className="text-[11px] text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
