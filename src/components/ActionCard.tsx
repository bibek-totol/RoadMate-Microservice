'use client'
import React from 'react'

function ActionCard({icon,title,button,onclick}:any) {
  return (
    <div className=' bg-[#0d0e15]/90 
        backdrop-blur-xl
        rounded-2xl 
        p-5 sm:p-6 md:p-8 
        shadow-[0_8px_32px_rgba(0,0,0,0.5)] 
        border border-white/10
        flex 
        flex-col sm:flex-row 
        justify-between 
        items-start sm:items-center 
        gap-5
        text-white'>
      <div className='flex items-center gap-4'>
        <div className='bg-purple-600/20 border border-purple-500/30 text-purple-300 p-3.5 md:p-4 rounded-xl shrink-0'>{icon}</div>
        <div className='text-base sm:text-lg md:text-xl font-bold text-white'>{title}</div>
      </div>
      <button className=' w-full sm:w-auto
          bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 
          text-white 
          px-6 
          py-3 
          rounded-xl 
          text-sm sm:text-base 
          font-semibold
          transition 
          hover:opacity-90 shadow-[0_0_20px_rgba(147,51,234,0.4)]' onClick={onclick}>{button}</button>
    </div>
  )
}

export default ActionCard
