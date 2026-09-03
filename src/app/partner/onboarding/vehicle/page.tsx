'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { ArrowLeft, Bike, Car, CircleDashed, Package, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
const VEHICLES = [
    { id: "bike", label: "Bike", icon: Bike, desc: "2 wheeler" },
    { id: "auto", label: "Auto", icon: Car, desc: "3 wheeler ride" },
    { id: "car", label: "Car", icon: Car, desc: "4 wheeler ride" },
    { id: "loading", label: "Loading", icon: Package, desc: "Small goods" },
    { id: "truck", label: "Truck", icon: Truck, desc: "Heavy transport" },
];
function page() {
    const router = useRouter()
    const [vehicleType, setVehicleType] = useState("")
    const [vehicleNumber, setVehicleNumber] = useState("")
      const [vehicleModel, setVehicleModel] = useState("")
      const [loading,setLoading]=useState(false)
     const [error,setError]=useState("")
      const handleVehicle=async ()=>{
        setError("")
        if (!vehicleType) {
            setError("Please select a Vehicle Type (Bike, Auto, Car, Loading, or Truck)")
            return
        }
        if (!vehicleNumber.trim()) {
            setError("Please enter a valid Vehicle Registration Number")
            return
        }
        if (!vehicleModel.trim()) {
            setError("Please enter your Vehicle Model")
            return
        }
        try {
            setLoading(true)
            const {data}=await axios.post("/api/partner/onboarding/vehicle",{
                type:vehicleType, number:vehicleNumber.trim(), vehicleModel:vehicleModel.trim()
            })
            setLoading(false)
            
           router.push("/partner/onboarding/documents")
        } catch (error:any) {
            setError(error?.response?.data?.message ?? "something went wrong")
            setLoading(false)
        }
      }

      useEffect(()=>{
        const handleGetVehicle=async ()=>{
        try {
            const {data}=await axios.get("/api/partner/onboarding/vehicle")
            setVehicleType(data.type ?? "")
            setVehicleNumber(data.number ?? "")
            setVehicleModel(data.vehicleModel ?? "")
           
        } catch (error:any) {
        console.log(error)
        }
      }
      handleGetVehicle()
      },[])
    return (
        <div className='min-h-screen bg-[#0b0c10] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden'>
            {/* Ambient Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-xl bg-[#0d0e15]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 sm:p-8 relative z-10 text-white"
            >
                <div className='relative text-center'>
                    <button className='absolute left-0 top-0 w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition text-white'
                        onClick={() => router.back()}
                    ><ArrowLeft size={18} /></button>

                    <p className='text-xs text-purple-400 font-semibold uppercase tracking-wider'>
                        Step 1 of 3
                    </p>

                    <h1 className='text-2xl font-extrabold text-white mt-1'>
                        Vehicle Details
                    </h1>
                    <p className='text-sm text-gray-400 mt-1'>
                        Add your vehicle information
                    </p>

                </div>

                <div className='mt-8 space-y-6'>
                    <div>
                        <div className='flex items-center justify-between mb-3'>
                            <p className='text-xs font-semibold text-gray-300 uppercase tracking-wider'>
                                Vehicle Type <span className='text-rose-400'>*</span>
                            </p>
                            {!vehicleType && (
                                <span className='text-[10px] text-amber-300 font-medium px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 animate-pulse'>
                                    Select one below
                                </span>
                            )}
                        </div>
                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                            {VEHICLES.map((v, i) => {
                                const Icon = v.icon
                                const active = vehicleType == v.id
                                return (
                                    <motion.div
                                        key={v.id}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => {
                                            setVehicleType(v.id)
                                            if (error) setError("")
                                        }}
                                        className={`rounded-xl border p-4 flex flex-col items-center gap-2 cursor-pointer transition-all
                      ${active
                                                ? "bg-gradient-to-br from-purple-900/60 to-indigo-900/60 text-white border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                                                : "bg-white/5 border-white/10 hover:border-purple-500/50 text-gray-300"
                                            }`}
                                    >

                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition
                        ${active
                                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                                                : "bg-white/10 text-gray-300"
                                            }`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className='text-sm font-bold'>
                                            {v.label}
                                        </div>
                                        <p className={`text-xs ${active
                                                ? "text-purple-200"
                                                : "text-gray-400"
                                            }`}>
                                            {v.desc}
                                        </p>

                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="vn" className='text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-1.5'>Vehicle Registration Number</label>
                        <input 
                        type="text"
                        onChange={(e)=>setVehicleNumber(e.target.value.toUpperCase())}
                        value={vehicleNumber}
                         placeholder='DHAKA METRO-HA-11-2233' 
                         id='vn' 
                         className='w-full bg-[#161824] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition'/>
                        <p className="text-[11px] text-gray-400 mt-1">Example format: <span className="text-purple-300 font-mono">DHAKA METRO-HA-11-2233</span> or <span className="text-purple-300 font-mono">DHAKA-GA-11-2233</span></p>
                    </div>
                    <div>
                        <label htmlFor="vm" className='text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-1.5'>Vehicle Model</label>
                        <input 
                        type="text"
                        onChange={(e)=>setVehicleModel(e.target.value)}
                        value={vehicleModel}
                         placeholder='Tata Ace' 
                         id='vm' 
                         className='w-full bg-[#161824] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition'/>
                    </div>
                </div>
                {error && <p className='text-rose-400 mt-4 text-xs font-semibold'>*{error}</p>}

                <motion.button
                 whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="mt-8 w-full h-13 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 transition shadow-[0_0_20px_rgba(147,51,234,0.4)]"
          onClick={handleVehicle}
                >{loading?<CircleDashed className='text-white animate-spin'/>: "Continue"}</motion.button>

            </motion.div>
        </div>
    )
}

export default page
