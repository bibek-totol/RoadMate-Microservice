'use client'
import React from 'react'
import { motion } from "motion/react"

function TabButton({ active, count, onClick, icon, children }: any) {
    return (
        <motion.div
            onClick={onClick}
            whileTap={{ scale: 0.97 }}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 select-none cursor-pointer
        ${active
                    ? "bg-neutral-950 text-white shadow-lg shadow-black/20"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
        >
            <span className={`flex items-center ${active ? "text-white" : "text-gray-600"}`}>{icon}</span>
            <span className='inline'>{children}</span>
            {count !== undefined && count !== null && (
                <span className={`min-w-[22px] h-5 px-1.5 text-[11px] font-extrabold rounded-full flex items-center justify-center transition-all
            ${active
              ? "bg-white text-black"
              : count > 0
              ? "bg-amber-500 text-black font-bold"
              : "bg-gray-200 text-gray-700"
            }`}>{count}</span>
            )}
        </motion.div>
    )
}

export default TabButton
