'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, Bike, Car, CheckCircle, ChevronRight, LocateFixed, MapPin, Navigation, Phone, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { vehicleType } from '@/models/vehicle.model'
import axios from 'axios'

const stepVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

const VEHICLES = [
  { id: "bike", label: "Bike", Icon: Bike, desc: "Quick & affordable" },
  { id: "auto", label: "Auto", Icon: Car, desc: "Everyday rides" },
  { id: "car", label: "Car", Icon: Car, desc: "Comfort rides" },
  { id: "loading", label: "Loading", Icon: Truck, desc: "Small cargo" },
  { id: "truck", label: "Truck", Icon: Truck, desc: "Heavy transport" },
];

type Place = {
  id: string; 
  name: string; 
  city?: string; 
  state?: string;
  country?: string; 
  countrycode?: string; 
  lat: number; 
  lng: number;
};

function page() {
  const router = useRouter()
  const [vehicle, setVehicle] = useState<vehicleType>()
  const [mobile, setMobile] = useState("")
  const [pickUp, setPickUp] = useState("")
  const [drop, setDrop] = useState("")
  const [pickUpCountry, setPickUpCountry] = useState("")
  const [pickUpLat, setPickUpLat] = useState<Number>()
  const [pickUpLon, setPickUpLon] = useState<Number>()
  const [dropCountry, setDropCountry] = useState("")
  const [dropLat, setDropLat] = useState<Number>()
  const [dropLon, setDropLon] = useState<Number>()
  const [locating, setLocating] = useState(false)
  const [pickUpSuggestions, setPickUpSuggestions] = useState<Place[]>([])
  const [dropSuggestions, setDropSuggestions] = useState<Place[]>([])

  const progress = [!!vehicle, !!(mobile.length == 10), !!pickUp, !!drop].filter(Boolean).length
  const canContinue = !!(vehicle && mobile && pickUp && drop && pickUpLat && pickUpLon && dropLat && dropLon)

  const searchAddress = async (q: string, setResults: (r: Place[]) => void, restrict?: string | null) => {
    try {
      if (!q || q.trim().length < 3) {
        setResults([])
        return;
      }
      const { data } = await axios.get("https://api.geoapify.com/v1/geocode/autocomplete", {
        params: {
          text: q.trim(),
          apiKey: process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY,
          filter: "countrycode:in",
          limit: 5
        }
      })
      let results: Place[] = (data.features ?? []).map((f: any) => ({
        id: String(f.properties.osm_id),
        name: f.properties.name,
        city: f.properties.city,
        state: f.properties.state,
        country: f.properties.country,
        countrycode: f.properties.countrycode,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0]
      }))
      if (restrict) {
        results = results.filter(r => r.country == restrict)
      }
      setResults(results)
    } catch (error) {
      console.log(error)
      setResults([])
    }
  }

  const suggestion = (p: Place) => [p.name, p.city, p.state, p.country].filter(Boolean).join(", ")

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true)
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const { data } = await axios.get("https://api.geoapify.com/v1/geocode/reverse", {
          params: {
            lat: coords.latitude,
            lon: coords.longitude,
            apiKey: process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY,
            filter: "countrycode:in"
          }
        })
        if (data.features.length) {
          const p = data.features[0].properties
          const address = [p.name, p.street, p.city, p.state, p.country].filter(Boolean).join(", ")
          setPickUp(address)
          setPickUpCountry(p.country)
          setPickUpLat(coords.latitude)
          setPickUpLon(coords.longitude)
          setPickUpSuggestions([])
          setLocating(false)
        }
      } catch (error) {
        console.log(error)
        setLocating(false)
      }
    })
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#0b0c10] via-[#090a0f] to-[#12131c] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden'>
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Header Bar */}
        <div className='flex items-center gap-4 mb-6 px-1'>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => router.push("/")}
            className="w-11 h-11 rounded-2xl bg-[#1a1b28] border border-white/15 shadow-md flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={16} className='text-white' />
          </motion.button>
          <div className='flex-1 min-w-0'>
            <h1 className='text-white text-2xl font-black tracking-tight'>Book a Ride</h1>
            <p className='text-zinc-400 text-xs mt-0.5 font-medium'>Select vehicle & locations to continue</p>
          </div>

          <div className='flex items-center gap-1.5 flex-shrink-0'>
            {[0, 1, 2, 3].map((d, i) => (
              <motion.div
                key={i}
                animate={{ width: i < progress ? 20 : 8, background: i < progress ? "#a855f7" : "rgba(255,255,255,0.2)" }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Main Card Container */}
        <div className='bg-[#12131c]/90 backdrop-blur-xl rounded-3xl border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(168,85,247,0.15)] overflow-visible p-6 sm:p-8 space-y-7'>

          {/* Step 1: Vehicle Selection */}
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 }}
          >
            <div className='flex items-center gap-2 mb-3.5'>
              <div className='w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md'>
                <span className='text-white text-[10px] font-black'>1</span>
              </div>
              <p className='text-xs font-bold text-zinc-300 uppercase tracking-widest'>
                Choose Vehicle Class
              </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2.5'>
              {VEHICLES.map((v, i) => {
                const active = vehicle == v.id
                return (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.07 + i * 0.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setVehicle(v.id as vehicleType)}
                    className={`relative p-3.5 rounded-2xl border flex flex-col items-start gap-2 text-left cursor-pointer transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-br from-purple-600/25 to-indigo-600/25 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                        : "bg-[#181926] border-white/10 hover:border-white/25 hover:bg-[#1f2030]"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      active ? "bg-purple-600 text-white" : "bg-white/5 text-zinc-300"
                    }`}>
                      <v.Icon size={18} />
                    </div>
                    <div className='min-w-0 w-full'>
                      <p className={`text-xs font-bold truncate ${active ? "text-white" : "text-zinc-200"}`}>{v.label}</p>
                      <p className='text-[10px] text-zinc-400 truncate mt-0.5'>{v.desc}</p>
                    </div>

                    {active && (
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute top-2.5 right-2.5"
                      >
                        <CheckCircle size={14} className="text-purple-400 fill-purple-400/20" />
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <div className='h-px bg-white/10' />

          {/* Step 2: Mobile Number */}
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md'>
                <span className='text-white text-[10px] font-black'>2</span>
              </div>
              <p className='text-xs font-bold text-zinc-300 uppercase tracking-widest'>
                Mobile Contact
              </p>
            </div>

            <div className='flex items-center gap-3 bg-[#181926] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all'>
              <div className='w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0'>
                <Phone size={14} className='text-purple-400' />
              </div>
              <input
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 10-digit mobile number"
                inputMode="numeric"
                maxLength={15}
                className="flex-1 bg-transparent text-sm font-semibold text-white placeholder:text-zinc-500 outline-none"
              />
              <AnimatePresence>
                {mobile.length == 10 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <CheckCircle size={16} className="text-emerald-400 fill-emerald-400/20 flex-shrink-0" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className='text-zinc-400 text-[10px] mt-1.5 ml-1 font-medium'>Ride OTP & dispatch updates will be sent to this number</p>
          </motion.div>

          <div className='h-px bg-white/10' />

          {/* Step 3: Route Locations */}
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
          >
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md'>
                <span className='text-white text-[10px] font-black'>3</span>
              </div>
              <p className='text-xs font-bold text-zinc-300 uppercase tracking-widest'>
                Route Coordinates
              </p>
            </div>

            <div className='bg-[#181926] border border-white/10 rounded-2xl overflow-visible'>
              {/* Pickup Input */}
              <div className='relative z-20'>
                <div className='flex items-center gap-3 px-4 py-3.5 rounded-t-2xl transition-colors'>
                  <div className='flex flex-col items-center flex-shrink-0'>
                    <div className='w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#181926] shadow-[0_0_10px_rgba(52,211,153,0.5)]' />
                    <div className='w-px h-5 bg-white/20 my-1' />
                  </div>

                  <input
                    onChange={(e) => {
                      setPickUp(e.target.value)
                      searchAddress(e.target.value, setPickUpSuggestions)
                    }}
                    value={pickUp}
                    placeholder="Set Pickup Location"
                    className="flex-1 bg-transparent text-sm font-semibold text-white placeholder:text-zinc-500 outline-none"
                  />
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={useCurrentLocation}
                    disabled={locating}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center flex-shrink-0 text-white"
                  >
                    <LocateFixed size={14} className={locating ? "animate-spin text-purple-400" : "text-zinc-300"} />
                  </motion.button>
                </div>

                {/* Pickup Suggestions Dropdown */}
                <AnimatePresence>
                  {pickUpSuggestions?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      className="absolute left-0 right-0 top-full mt-1 bg-[#1c1d2e] border border-white/15 rounded-2xl shadow-2xl max-h-48 overflow-y-auto z-50 p-1"
                    >
                      {pickUpSuggestions.map((p, i) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setPickUp(suggestion(p))
                            setPickUpCountry(p.country ?? "")
                            setPickUpLat(p.lat)
                            setPickUpLon(p.lng)
                            setPickUpSuggestions([])
                          }}
                          className="flex items-center gap-3 w-full px-3.5 py-2.5 text-left hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                        >
                          <MapPin size={14} className="text-emerald-400 flex-shrink-0" />
                          <span className="text-xs text-zinc-200 font-medium truncate">{suggestion(p)}</span>
                          <ChevronRight size={13} className="text-zinc-500 flex-shrink-0 ml-auto" />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className='h-px bg-white/10' />

              {/* Drop Input */}
              <div className='relative z-10'>
                <div className='flex items-center gap-3 px-4 py-3.5 rounded-b-2xl transition-colors'>
                  <div className='flex flex-col items-center flex-shrink-0'>
                    <div className='w-3 h-3 rounded-full bg-purple-500 border-2 border-[#181926] shadow-[0_0_10px_rgba(168,85,247,0.5)]' />
                  </div>

                  <input
                    onChange={(e) => {
                      setDrop(e.target.value)
                      searchAddress(e.target.value, setDropSuggestions, pickUpCountry)
                    }}
                    disabled={!pickUpCountry}
                    value={drop}
                    placeholder={pickUpCountry ? "Set Dropoff Destination" : "Select Pickup Location First"}
                    className="flex-1 bg-transparent text-sm font-semibold text-white placeholder:text-zinc-500 outline-none disabled:opacity-50"
                  />
                  <Navigation size={14} className='text-purple-400 flex-shrink-0' />
                </div>

                {/* Drop Suggestions Dropdown */}
                <AnimatePresence>
                  {dropSuggestions?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      className="absolute left-0 right-0 top-full mt-1 bg-[#1c1d2e] border border-white/15 rounded-2xl shadow-2xl max-h-48 overflow-y-auto z-50 p-1"
                    >
                      {dropSuggestions.map((p, i) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setDrop(suggestion(p))
                            setDropCountry(p.country ?? "")
                            setDropLat(p.lat)
                            setDropLon(p.lng)
                            setDropSuggestions([])
                          }}
                          className="flex items-center gap-3 w-full px-3.5 py-2.5 text-left hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                        >
                          <Navigation size={14} className="text-purple-400 flex-shrink-0" />
                          <span className="text-xs text-zinc-200 font-medium truncate">{suggestion(p)}</span>
                          <ChevronRight size={13} className="text-zinc-500 flex-shrink-0 ml-auto" />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Submit Action */}
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={canContinue ? { scale: 1.02 } : {}}
              disabled={!canContinue}
              onClick={() => {
                router.push(`/user/search?pickup=${encodeURIComponent(pickUp)}&drop=${encodeURIComponent(drop)}&vehicle=${vehicle}&mobile=${encodeURIComponent(mobile)}&pickuplat=${pickUpLat}&pickuplon=${pickUpLon}&droplat=${dropLat}&droplon=${dropLon}`)
              }}
              className="w-full h-14 rounded-2xl bg-white hover:bg-zinc-200 disabled:opacity-40 text-black font-extrabold text-sm tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-white/10 disabled:shadow-none"
            >
              <span>Confirm & Find Drivers</span>
              <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default page
