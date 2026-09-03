'use client'
import React from 'react'
import { motion } from "motion/react"
function StatusCard({ icon, title, desc }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="
        bg-[#0d0e15]/90 
        backdrop-blur-xl
        rounded-2xl 
        p-5 sm:p-6 md:p-8 
        shadow-[0_8px_32px_rgba(0,0,0,0.5)] 
        border border-white/10
        flex 
        flex-col sm:flex-row 
        gap-4 sm:gap-5
        items-start sm:items-center
        text-white
      "
        >
            <div className='bg-purple-600/20 border border-purple-500/30 text-purple-300 p-3.5 md:p-4 rounded-xl shrink-0'>
                {icon}
            </div>
            <div className='flex-1'>
                <h2 className='text-base sm:text-lg md:text-xl font-bold text-white'>{title}</h2>
                <p className='text-gray-400 text-sm sm:text-base mt-1'>{desc}</p>
            </div>

        </motion.div>
    )
}

export default StatusCard
