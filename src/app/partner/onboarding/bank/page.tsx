'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { ArrowLeft, BadgeCheck, CheckCircle, CircleDashed, CreditCard, Landmark, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { p } from 'motion/react-client'
const ROUTING_REGEX = /^[0-9]{9}$|^[0-9A-Z]{6,12}$/i
function page() {
    const router = useRouter()
    const [accountHolder,setAccountHolder]=useState("")
    const [accountNumber,setAccountNumber]=useState("")
    const [ifsc,setIfsc]=useState("")
    const [upi,setupi]=useState("")
    const [mobileNumber,setMobileNumber]=useState("")
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")

const sanitizedIfsc=ifsc.trim()

const isNameValid=accountHolder.trim().length>=3
const isAccountValid=accountNumber.trim().length>=9
const isIfscValid=ROUTING_REGEX.test(sanitizedIfsc)
const isMobileValid=/^(?:\+88)?01[3-9]\d{8}$/.test(mobileNumber.trim()) || mobileNumber.trim().length===11 || mobileNumber.trim().length===10

const canSubmit=isNameValid && isAccountValid && isIfscValid && isMobileValid
  
    const handleBank=async ()=>{
        setLoading(true)
        setError("")
        try {
            const {data}=await axios.post("/api/partner/onboarding/bank",{
                accountHolder,accountNumber,ifsc:sanitizedIfsc,upi,mobileNumber
            })
            console.log(data)
            setLoading(false)
           window.location.href="/"
        } catch (error:any) {
            setError(error?.response?.data?.message || "something went wrong")
            console.log(error)
            setLoading(false)
        }
    }

useEffect(()=>{
     const handleGetBank=async ()=>{
        try {
            const {data}=await axios.get("/api/partner/onboarding/bank")
            console.log(data)
           setAccountHolder(data.partnerBank.accountHolder)
           setAccountNumber(data.partnerBank.accountNumber)
           setIfsc(data.partnerBank.ifsc)
           setMobileNumber(data.mobileNumber)
           setupi(data.partnerBank.upi)
           
        } catch (error:any) {
            console.log(error)
        }
    }
    handleGetBank()

},[])

    return (
        <div className='min-h-screen bg-[#0b0c10] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden'>
            {/* Ambient Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl bg-[#0d0e15]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 sm:p-8 relative z-10 text-white"
            >
                <div className='relative text-center'>
                    <button className='absolute left-0 top-0 w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition text-white'
                        onClick={() => router.back()}
                    ><ArrowLeft size={18} /></button>

                    <p className='text-xs text-purple-400 font-semibold uppercase tracking-wider'>
                        Step 3 of 3
                    </p>

                    <h1 className='text-2xl font-extrabold text-white mt-1'>
                        Bank & Payout Setup
                    </h1>
                    <p className='text-sm text-gray-400 mt-1'>
                        Used for direct partner payouts & earnings
                    </p>

                </div>

                <div className='mt-8 space-y-5'>
                    <div>
                        <label htmlFor="ahn" className='text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-1.5'>Account Holder Name</label>
                        <div className='flex items-center gap-3 bg-[#161824] border border-white/10 rounded-xl px-4 py-3 focus-within:border-purple-500 transition'>
                            <BadgeCheck className="text-purple-400 shrink-0" size={18} />
                            <input 
                            type="text" 
                            id='ahn' 
                            placeholder='As per bank records' 
                            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none" 
                            value={accountHolder} 
                            onChange={(e)=>setAccountHolder(e.target.value)}/>
                        </div>
                        {!isNameValid && accountHolder.length>0 && <p className='mt-1 text-xs text-rose-400 font-semibold'>Minimum 3 characters required</p>}
                    </div>

                    <div>
                        <label htmlFor="accNo" className='text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-1.5'>Bank Account Number</label>
                        <div className='flex items-center gap-3 bg-[#161824] border border-white/10 rounded-xl px-4 py-3 focus-within:border-purple-500 transition'>
                            <CreditCard className="text-purple-400 shrink-0" size={18} />
                            <input type="text" id='accNo' placeholder='Enter account number' className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none" value={accountNumber} onChange={(e)=>setAccountNumber(e.target.value)}/>
                        </div>
                         {!isAccountValid && accountNumber.length>0 && <p className='mt-1 text-xs text-rose-400 font-semibold'>Account number must be at least 9 digits</p>}
                    </div>

                    <div>
                        <label htmlFor="ifscInp" className='text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-1.5'>Bank Routing Number (BEFTN)</label>
                        <div className='flex items-center gap-3 bg-[#161824] border border-white/10 rounded-xl px-4 py-3 focus-within:border-purple-500 transition'>
                            <Landmark className="text-purple-400 shrink-0" size={18} />
                            <input type="text" id='ifscInp' placeholder='060271234' className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none" value={ifsc} onChange={(e)=>setIfsc(e.target.value)}/>
                        </div>
                         <p className="text-[11px] text-gray-400 mt-1">9-digit Bangladesh Bank BEFTN/EFTN routing number</p>
                         {!isIfscValid && ifsc.length>0 && <p className='mt-1 text-xs text-rose-400 font-semibold'>Invalid Routing Number format (9 digits required, e.g. 060271234)</p>}
                    </div>

                    <div>
                        <label htmlFor="mob" className='text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-1.5'>Mobile Number</label>
                        <div className='flex items-center gap-3 bg-[#161824] border border-white/10 rounded-xl px-4 py-3 focus-within:border-purple-500 transition'>
                            <Phone className="text-purple-400 shrink-0" size={18} />
                            <input type="text" id='mob' placeholder='01712345678' className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none" value={mobileNumber} onChange={(e)=>setMobileNumber(e.target.value)}/>
                        </div>
                         {!isMobileValid && mobileNumber.length>0 && <p className='mt-1 text-xs text-rose-400 font-semibold'>Enter a valid 11-digit Bangladeshi mobile number</p>}
                    </div>

                    <div>
                        <label htmlFor="upiInp" className='text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-1.5'>Mobile Banking / MFS (bKash / Nagad) (Optional)</label>
                        <div className='flex items-center gap-3 bg-[#161824] border border-white/10 rounded-xl px-4 py-3 focus-within:border-purple-500 transition'>
                            <input type="text" id='upiInp' placeholder='01712345678 (bKash / Nagad)' className='w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none' value={upi} onChange={(e)=>setupi(e.target.value)}/>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">Optional bKash, Nagad, or Rocket account number for instant payouts</p>
                    </div>
                </div>

 {error && <p className='text-rose-400 mt-4 text-xs font-semibold'>*{error}</p>}
                <div className='mt-6 flex items-start gap-3 text-xs text-gray-400 bg-white/5 p-3 rounded-xl border border-white/10'>
                    <CheckCircle size={16} className="mt-0.5 text-emerald-400 shrink-0" />
                    <p> Bank details are verified before first payout.
                        This usually takes 24–48 hours.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleBank}
                    disabled={!canSubmit || loading}
                    className="mt-8 w-full h-13 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm uppercase tracking-wider disabled:opacity-40 transition flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.4)]"
                >
 {loading?<CircleDashed className='text-white animate-spin'/>: "Complete Setup"}
                </motion.button>


            </motion.div>
        </div>
    )
}

export default page
