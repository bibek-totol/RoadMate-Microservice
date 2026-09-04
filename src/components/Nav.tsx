'use client'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import AuthModal from './AuthModal'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { ChevronRight, LogOut, Menu, X, Github } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { setUserData } from '@/redux/userSlice'
import axios from 'axios'
import { getSocket } from '@/lib/socket'

function Nav() {
    const _pathName = usePathname()
    const [authOpen, setAuthOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { userData } = useSelector((state: RootState) => state.user)
    const [pendingCount, setPendingCount] = useState(0)
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()

    const handleLogOut = async () => {
        await signOut({ redirect: false })
        dispatch(setUserData(null))
        setProfileOpen(false)
        router.push('/')
        router.refresh()
    }

    const fetchCount = async () => {
        try {
            const { data } = await axios.get("/api/partner/bookings/pending-requests-count")
            setPendingCount(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (userData?.role === "partner") {
            fetchCount()
        }
    }, [userData?.role])

    useEffect(() => {
        const socket = getSocket()
        socket.on("new-booking", () => {
            setPendingCount(prev => prev + 1)
        })
        return () => {
            socket.off("new-booking")
        }
    }, [])

    return (
        <>
            {/* Cella Floating Absolute Navbar over Dark Ambient Hero Backdrop */}
            <header className="absolute top-0 inset-x-0 z-50 h-20 w-full px-4 sm:px-8">
                <div className="max-w-6xl mx-auto h-full flex items-center justify-between gap-4">
                    {/* Left Brand Logo & Nav Links */}
                    <div className="flex items-center gap-6 md:gap-10">
                        <div
                            className="flex items-center gap-2 cursor-pointer focus-effect rounded-lg py-1 px-1 transition-transform hover:scale-105"
                            onClick={() => router.push('/')}
                        >
                            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-md ring-1 ring-amber-500/30 bg-[#090a0f] p-0.5 flex items-center justify-center shrink-0">
                                <Image
                                    src="/loco.png"
                                    alt="RoadMate"
                                    width={36}
                                    height={36}
                                    priority
                                    className="object-cover w-full h-full rounded-lg scale-135"
                                />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                                roadmate
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            </span>
                        </div>

                        {/* Nav Links */}
                        <nav className="hidden md:flex items-center gap-7">
                            {(userData?.role === "user" || !userData) && (
                                <>
                                    <a href="#core-features" className="text-xs font-medium text-zinc-300 hover:text-white transition">Features</a>
                                    
                                </>
                            )}
                            
                            {userData?.role === "partner" ? (
                                <>
                                    <Link
                                        className="text-xs font-medium text-purple-300 hover:text-white transition flex items-center gap-1"
                                        href="/partner"
                                    >
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link
                                        className="text-xs font-medium text-purple-300 hover:text-white transition flex items-center gap-1"
                                        href="/partner/bookings"
                                    >
                                        <span>Bookings</span>
                                    </Link>
                                    <Link
                                        className="text-xs font-medium text-amber-400 flex items-center gap-1.5 hover:underline"
                                        href="/partner/pending-requests"
                                    >
                                        <span>Requests</span>
                                        {pendingCount > 0 && (
                                            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-black">
                                                {pendingCount}
                                            </span>
                                        )}
                                    </Link>
                                </>
                            ) : (
                                <a href="/partner/onboarding/vehicle" className="text-xs font-medium text-zinc-300 hover:text-white transition">Become a Partner</a>
                            )}
                        </nav>
                    </div>

                    {/* Right Utility Icons & Sign In Pill Button */}
                    <div className="flex items-center gap-3">
                      

                        <a
                            href="https://github.com/bibek-totol/RoadMate-Microservice"
                            target="_blank"
                            rel="noreferrer"
                            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition"
                        >
                            <Github size={16} />
                        </a>

                        {!userData ? (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="px-4 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition shadow-md"
                                onClick={() => setAuthOpen(true)}
                            >
                                Sign in
                            </motion.button>
                        ) : (
                            <div className="relative">
                                <button
                                    className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center border border-white/20 hover:ring-2 hover:ring-purple-400 transition"
                                    onClick={() => setProfileOpen(p => !p)}
                                >
                                    {userData.name.charAt(0).toUpperCase()}
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                            className="absolute top-11 right-0 w-56 bg-[#13141c] text-white rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 p-3"
                                        >
                                            <div className="pb-2.5 mb-2 border-b border-white/10">
                                                <p className="font-semibold text-xs text-white">{userData.name}</p>
                                                <p className="text-[10px] text-zinc-400 uppercase">{userData.role}</p>
                                            </div>

                                            {userData.role === "partner" ? (
                                                <>
                                                    <button
                                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-xs text-zinc-300 transition"
                                                        onClick={() => { setProfileOpen(false); router.push("/partner") }}
                                                    >
                                                        <span>Partner Dashboard</span>
                                                        <ChevronRight size={14} className="text-zinc-500" />
                                                    </button>
                                                    <button
                                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-xs text-zinc-300 transition"
                                                        onClick={() => { setProfileOpen(false); router.push("/partner/bookings") }}
                                                    >
                                                        <span>Bookings</span>
                                                        <ChevronRight size={14} className="text-zinc-500" />
                                                    </button>
                                                    <button
                                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-xs text-zinc-300 transition"
                                                        onClick={() => { setProfileOpen(false); router.push("/partner/pending-requests") }}
                                                    >
                                                        <span>Ride Requests</span>
                                                        <ChevronRight size={14} className="text-zinc-500" />
                                                    </button>
                                                </>
                                            ) : userData.role === "admin" ? (
                                                <button
                                                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-xs text-zinc-300 transition"
                                                    onClick={() => { setProfileOpen(false); router.push("/admin") }}
                                                >
                                                    <span>Admin Dashboard</span>
                                                    <ChevronRight size={14} className="text-zinc-500" />
                                                </button>
                                            ) : (
                                                <button
                                                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-xs text-zinc-300 transition"
                                                    onClick={() => { setProfileOpen(false); router.push("/user/bookings") }}
                                                >
                                                    <span>My Bookings</span>
                                                    <ChevronRight size={14} className="text-zinc-500" />
                                                </button>
                                            )}

                                            <button
                                                className="w-full flex items-center gap-2 p-2 hover:bg-red-950/40 text-red-400 rounded-lg text-xs transition mt-2 border-t border-white/10 pt-2"
                                                onClick={handleLogOut}
                                            >
                                                <LogOut size={14} />
                                                <span>Sign Out</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <button
                            className="md:hidden p-2 text-zinc-300 hover:text-white"
                            onClick={() => setMenuOpen(p => !p)}
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Nav Drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed top-20 inset-x-0 bg-[#0b0c10]/95 backdrop-blur-xl border-b border-white/10 p-5 z-50 md:hidden space-y-3"
                    >


                        {
                            userData?.role === "user" || !userData ?  (
                                <>
                               <a href="#core-features" onClick={() => setMenuOpen(false)} className="block p-2 text-xs font-semibold text-zinc-300 hover:text-white">Features</a>
                        <a href="#fleet" onClick={() => setMenuOpen(false)} className="block p-2 text-xs font-semibold text-zinc-300 hover:text-white">Fleet</a>
                        <a href="#ride-sharing" onClick={() => setMenuOpen(false)} className="block p-2 text-xs font-semibold text-zinc-300 hover:text-white">Ride Sharing</a>
                                </>
                            )
                            :(
                                <>
                                </>
                            )
                        }
                       
                        
                        {userData?.role === "partner" ? (
                            <div className="border-t border-white/10 pt-3 space-y-1">
                                <p className="text-[10px] uppercase font-bold text-purple-400 tracking-wider px-2 mb-1">Partner Navigation</p>
                                <Link href="/partner" onClick={() => setMenuOpen(false)} className="block p-2 text-xs font-semibold text-zinc-300 hover:text-white">Partner Dashboard</Link>
                                <Link href="/partner/bookings" onClick={() => setMenuOpen(false)} className="block p-2 text-xs font-semibold text-purple-300 hover:text-white">Bookings</Link>
                                <Link href="/partner/pending-requests" onClick={() => setMenuOpen(false)} className="flex items-center justify-between p-2 text-xs font-semibold text-amber-400 hover:text-white">
                                    <span>Ride Requests</span>
                                    {pendingCount > 0 && <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-black">{pendingCount}</span>}
                                </Link>
                            </div>
                        ) : userData?.role !== "admin" ? (
                            <a href="/partner/onboarding/vehicle" onClick={() => setMenuOpen(false)} className="block p-2 text-xs font-semibold text-zinc-300 hover:text-white">Become a Partner</a>
                        ) : null}

                        {!userData ? (
                            <button
                                className="w-full py-2.5 rounded-lg bg-white text-black font-bold text-xs uppercase shadow-md"
                                onClick={() => { setMenuOpen(false); setAuthOpen(true); }}
                            >
                                Sign in
                            </button>
                        ) : (
                            <button
                                className="w-full py-2.5 rounded-lg bg-red-950/50 text-red-400 font-semibold text-xs flex items-center justify-center gap-2"
                                onClick={() => { setMenuOpen(false); handleLogOut(); }}
                            >
                                <LogOut size={14} />
                                Sign Out
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    )
}

export default Nav
