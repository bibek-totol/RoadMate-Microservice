'use client '
import { AlertTriangle } from 'lucide-react'
import React from 'react'

function RejectionCard({title,reason,actionLabel,onAction}:any) {
  return (
    <div className='bg-rose-950/30 
        border border-rose-500/30 
        backdrop-blur-xl
        rounded-2xl 
        p-5 sm:p-6 md:p-8 
        space-y-4 text-white shadow-[0_8px_32px_rgba(244,63,94,0.15)]'>
      <div className='flex items-center gap-2 text-rose-400 font-bold text-sm sm:text-base'>
        <AlertTriangle size={18}/>
        {title}
      </div>
      <div className='bg-[#13141f] border border-white/10 rounded-xl p-4 text-sm sm:text-base text-gray-300'>
        {reason}
      </div>
      {onAction && (
        <button
        onClick={onAction}
        className=' w-full sm:w-auto
            px-6 
            py-2.5 
            bg-gradient-to-r from-purple-600 to-indigo-600 
            text-white 
            rounded-xl 
            text-sm sm:text-base
            font-semibold
            hover:opacity-90 
            transition shadow-[0_0_20px_rgba(147,51,234,0.4)]'
        >
{actionLabel || "retry"}
        </button>
      )}
    </div>
  )
}

export default RejectionCard
