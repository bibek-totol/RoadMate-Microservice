'use client'
import React, { useState } from 'react'
import { motion } from "motion/react"
import { ArrowLeft, CircleDashed, FileCheck, UploadCloud } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

type docsType="aadhar"|"license"|"rc"
function page() {
  const router = useRouter()
  const [docs,setDocs]=useState<Record<docsType,File | null>>({
    aadhar:null,
    license:null,
    rc:null
  })

  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")

  const handleDocs=async ()=>{
    setLoading(true)
    setError("")
    try {
      const formdata=new FormData()
      if(!docs.aadhar || !docs.license || !docs.rc){
       
          setError("all documents are required")
          setLoading(false)
           return null
      }
      formdata.append("aadhar",docs.aadhar)
       formdata.append("license",docs.license)
        formdata.append("rc",docs.rc)

      const {data}=await axios.post("/api/partner/onboarding/documents",formdata)
      setLoading(false)
      router.push("/partner/onboarding/bank")
    } catch (error:any) {
      setError(error?.response?.data?.message ?? "something went wrong")
      console.log(error)
      setLoading(false)
    }
  }

  const handleImage=(doc:docsType,file:File | null)=>{
if(!file){
  return
}
setDocs((prev)=>({...prev,[doc]:file}))
  }

  const isCompleted=docs.aadhar && docs.license && docs.rc
  return (
    <div className='min-h-screen bg-[#0b0c10] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden'>
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-[#0d0e15]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 sm:p-8 relative z-10 text-white"
      >
        <div className='relative text-center'>
          <button className='absolute left-0 top-0 w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition text-white'
            onClick={() => router.back()}
          ><ArrowLeft size={18} /></button>

          <p className='text-xs text-purple-400 font-semibold uppercase tracking-wider'>
            Step 2 of 3
          </p>

          <h1 className='text-2xl font-extrabold text-white mt-1'>
            Upload Documents
          </h1>
          <p className='text-sm text-gray-400 mt-1'>
            Required for identity & vehicle verification
          </p>

        </div>

        <div className='mt-8 space-y-4'>
          <motion.label
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-purple-500/50 hover:bg-white/10 transition"
          >
            <div>
              <p className='text-sm font-bold text-white'>ID Proof</p>
              <p className='text-xs text-gray-400 mt-0.5'>Government issued ID</p>
            </div>
           
            {docs.aadhar ? 
            <span className='text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full'>Uploaded</span>
            :
            <div className='flex items-center gap-2'>
              <span className='text-xs text-gray-400'>Upload</span>
              <div className='w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)]'><UploadCloud size={18}/></div>
            </div>}          

            <input type='file' hidden accept='image/*,.pdf' onChange={(e)=>handleImage("aadhar",e.target?.files?.[0] || null)}/>

          </motion.label>

           <motion.label
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-purple-500/50 hover:bg-white/10 transition"
          >
            <div>
              <p className='text-sm font-bold text-white'>Driving License</p>
              <p className='text-xs text-gray-400 mt-0.5'>Valid driving license</p>
            </div>
            {docs.license ? 
            <span className='text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full'>Uploaded</span>
            :
            <div className='flex items-center gap-2'>
              <span className='text-xs text-gray-400'>Upload</span>
              <div className='w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)]'><UploadCloud size={18}/></div>
            </div>}     
 <input type='file' hidden accept='image/*,.pdf' onChange={(e)=>handleImage("license",e.target?.files?.[0] || null)}/>
          </motion.label>
           <motion.label
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-purple-500/50 hover:bg-white/10 transition"
          >
            <div>
              <p className='text-sm font-bold text-white'>Vehicle RC</p>
              <p className='text-xs text-gray-400 mt-0.5'>Registration Certificate</p>
            </div>
            {docs.rc ? 
            <span className='text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full'>Uploaded</span>
            :
            <div className='flex items-center gap-2'>
              <span className='text-xs text-gray-400'>Upload</span>
              <div className='w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)]'><UploadCloud size={18}/></div>
            </div>}     
 <input type='file' hidden accept='image/*,.pdf' onChange={(e)=>handleImage("rc",e.target?.files?.[0] || null)}/>
          </motion.label>
        </div>

        <div className='mt-6 flex items-start gap-3 text-xs text-gray-400 bg-white/5 p-3 rounded-xl border border-white/10'>
          <FileCheck size={16} className="mt-0.5 text-purple-400 shrink-0"/>
          <p> Documents are securely encrypted and manually verified by our compliance team.</p>
        </div>
          {error && <p className='text-rose-400 mt-4 text-xs font-semibold'>*{error}</p>}

         <motion.button
         whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDocs}
          disabled={!isCompleted || loading}
          className="mt-8 w-full h-13 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 transition shadow-[0_0_20px_rgba(147,51,234,0.4)]"
         >
         {loading?<CircleDashed className='text-white animate-spin'/>: "Continue"}
         </motion.button>

      </motion.div>
    </div>
  )
}

export default page
