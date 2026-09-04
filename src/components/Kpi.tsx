'use client'
import React from 'react'
import { motion } from "motion/react"

const KPI_CONFIG: Record<string, {
  iconBg: string; iconColor: string; cardBorder: string;
}> = {
  totalPartners: {
    iconBg: "bg-zinc-100",
    iconColor: "text-zinc-900",
    cardBorder: "hover:border-zinc-400",
  },
  approved: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    cardBorder: "hover:border-emerald-300",
  },
  pending: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
    cardBorder: "hover:border-amber-300",
  },
  rejected: {
    iconBg: "bg-red-50",
    iconColor: "text-red-700",
    cardBorder: "hover:border-red-300",
  },
};

interface KpiProps {
  label: string;
  value?: number;
  icon: React.ReactNode;
  variant: string;
}

function Kpi({ label, value, icon, variant }: KpiProps) {
  const cfg = KPI_CONFIG[variant] || KPI_CONFIG.totalPartners

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm cursor-default relative overflow-hidden transition-all text-zinc-900 ${cfg.cardBorder}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-700">{label}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.iconBg} ${cfg.iconColor}`}>
          {icon}
        </div>
      </div>

      <motion.div
        className="text-3xl font-black text-zinc-900 tracking-tight"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {value ?? 0}
      </motion.div>
    </motion.div>
  )
}

export default Kpi
