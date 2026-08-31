'use client'
import React, { useState } from 'react'
import HeroSection from './HeroSection'
import HowItWorks from './showcase/HowItWorks'
import FeaturesSection from './showcase/FeaturesSection'
import VehicleSlider from './VehicleSlider'
import PartnerPerksBanner from './showcase/PartnerPerksBanner'
import FaqSection from './showcase/FaqSection'
import AuthModal from './AuthModal'

function PublicHome() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <main className="w-full bg-[#0b0c10] text-white overflow-x-clip">
      <HeroSection onAuthRequired={() => setAuthOpen(true)} />
      <HowItWorks />
      <FeaturesSection />
      <VehicleSlider />
      <PartnerPerksBanner />
      <FaqSection />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  )
}

export default PublicHome
