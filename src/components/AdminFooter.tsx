'use client'
import React from 'react'
import Image from 'next/image'
import { Shield, Users, Truck, Video, BarChart3, Settings, Github, Mail } from 'lucide-react'

function AdminFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-16">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* Column 1 – Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow ring-1 ring-amber-500/30 bg-[#090a0f] p-0.5 flex items-center justify-center shrink-0">
                <Image
                  src="/loco.png"
                  alt="RoadMate"
                  width={36}
                  height={36}
                  priority
                  className="object-cover w-full h-full rounded-lg scale-135"
                />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-gray-900">RoadMate</span>
                <span className="ml-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  Admin
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
              Manage your platform, review partners, and monitor real-time activity from the admin control center.
            </p>
          </div>

          {/* Column 2 – Management */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-1.5">
              <Shield size={12} className="text-purple-500" /> Management
            </h4>
            <ul className="space-y-2.5">
              {[
                { icon: <Users size={12} />, label: 'Partner Reviews' },
                { icon: <Video size={12} />, label: 'Video KYC' },
                { icon: <Truck size={12} />, label: 'Vehicle Reviews' },
                { icon: <Settings size={12} />, label: 'Platform Settings' },
              ].map(({ icon, label }) => (
                <li key={label}>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors group"
                  >
                    <span className="text-gray-400 group-hover:text-purple-600 transition-colors">{icon}</span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Analytics */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-1.5">
              <BarChart3 size={12} className="text-purple-500" /> Analytics
            </h4>
            <ul className="space-y-2.5">
              {[
                'Earnings Overview',
                'Partner Stats',
                'Booking Reports',
                'Audit Logs',
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 – Support */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-1.5">
              <Mail size={12} className="text-purple-500" /> Support
            </h4>
            <ul className="space-y-2.5">
              {[
                'Help Center',
                'API Documentation',
                'System Status',
                'Contact Team',
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            {/* GitHub link */}
            <a
              href="https://github.com/bibek-totol/RoadMate-Microservice"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-800 transition-colors"
            >
              <Github size={13} /> View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-400">
            © {year} RoadMate Admin Panel. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors">Privacy Policy</a>
            <a href="#" className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors">Terms of Use</a>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default AdminFooter
