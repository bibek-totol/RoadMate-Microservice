'use client'
import React from 'react'
import {motion} from "motion/react"
interface AnimatedCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function AnimatedCard({title,icon,children}: AnimatedCardProps) {
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
