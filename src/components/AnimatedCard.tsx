'use client'
import React from 'react'
import {motion} from "motion/react"
function AnimatedCard({title,icon,children}:any) {
  return (
    <motion.div 
     whileHover={{ y: -4 }}
      className="bg-white text-gray-900 rounded-4xl p-8 shadow-xl space-y-6"
    >
        <div className='flex items-center gap-2 font-bold text-gray-900 text-base'>
            {icon}
            {title}
        </div>
        {children}
      
    </motion.div>
  )
}

export default AnimatedCard
