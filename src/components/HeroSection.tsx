'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "motion/react"
import { ArrowRight, Car } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import BackgroundCurve from './BackgroundCurve'

const TOTAL_FRAMES = 177

function getFrameUrl(index: number): string {
    const frameNumber = String(index + 1).padStart(3, '0')
    return `/hero-frames/ezgif-frame-${frameNumber}.webp`
}

export default function HeroSection({ onAuthRequired }: { onAuthRequired: () => void }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const router = useRouter()

    const containerRef = useRef<HTMLDivElement>(null)
    // The visible <img> element that displays the current frame
    const imgRef = useRef<HTMLImageElement>(null)
    // In-memory image cache — decoded and ready to swap in
    const imagesRef = useRef<HTMLImageElement[]>([])
    const currentFrameRef = useRef(0)

    const [imagesLoaded, setImagesLoaded] = useState(false)
    const [loadProgress, setLoadProgress] = useState(0)
    const [currentFrame, setCurrentFrame] = useState(0)

    // Framer Motion scroll binding
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const smoothScrollProgress = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 30,
        restDelta: 0.0001
    })

    const frameIndexTransform = useTransform(smoothScrollProgress, [0, 1], [0, TOTAL_FRAMES - 1])

    // Preload all 177 frames into in-memory HTMLImageElement cache
    useEffect(() => {
        let isMounted = true
        const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES)
        let count = 0

        const onSettled = () => {
            if (!isMounted) return
            count++
            setLoadProgress(Math.round((count / TOTAL_FRAMES) * 100))
            if (count === TOTAL_FRAMES) setImagesLoaded(true)
        }

        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image()
            img.decoding = 'async'
            img.src = getFrameUrl(i)
            img.onload = onSettled
            img.onerror = onSettled
            loadedImages[i] = img
        }
        imagesRef.current = loadedImages

        return () => { isMounted = false }
    }, [])

    /**
     * showFrame: swaps the src of the display <img> directly.
     * The browser uses its native GPU-accelerated image rendering path —
     * far sharper than canvas drawImage.
     */
    const showFrame = useCallback((frameIdx: number) => {
        const el = imgRef.current
        if (!el) return
        const cached = imagesRef.current[frameIdx]
        if (cached?.complete && cached.naturalWidth > 0) {
            // Direct currentSrc swap — GPU composites at full resolution
            el.src = cached.src
        }
        currentFrameRef.current = frameIdx
    }, [])

    // Render frame 0 as soon as assets are loaded
    useEffect(() => {
        if (imagesLoaded) showFrame(0)
    }, [imagesLoaded, showFrame])

    // Sync scroll → frame
    useMotionValueEvent(frameIndexTransform, "change", (latest) => {
        if (true) {
            const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(latest)))
            setCurrentFrame(idx)
            showFrame(idx)
        }
    })

    // Auto-360 loop is removed

    const handleBookingClick = () => {
        if (!userData) onAuthRequired()
        else router.push("/user/book")
    }

    const progressPercent = Math.round((currentFrame / (TOTAL_FRAMES - 1)) * 100)

    return (
        <section ref={containerRef} className="relative w-full h-[320vh] bg-[#010202] text-white">

            {/* ── Sticky viewport ── */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-between">

                {/* Loading Screen */}
                {!imagesLoaded && (
                    <div className="absolute inset-0 z-50 bg-[#010202] flex flex-col items-center justify-center gap-6">
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                           
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-sm font-semibold tracking-widest text-purple-300 uppercase">
                                Loading Experience
                            </p>
                            <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-200"
                                    style={{ width: `${loadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs font-mono text-zinc-400">{loadProgress}% loaded</p>
                        </div>
                    </div>
                )}

                {/*
                  Native <img> frame renderer at NATIVE RESOLUTION.
                  Sources: 1280×720 WebP (no generation loss, converted directly from originals).
                  object-contain: image NEVER upscales — it fills available space without
                  exceeding its native pixel dimensions. Dark background fills any letterbox.
                */}
                <img
                    ref={imgRef}
                    src={getFrameUrl(0)}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-contain z-0"
                    draggable={false}
                />

                {/* Edge vignettes — thin linear overlays, not touching the car center */}
                <div
                    className="absolute inset-0 z-[1] pointer-events-none"
                    style={{
                        background: `
                            linear-gradient(to bottom, rgba(1,2,2,0.55) 0%, rgba(1,2,2,0) 22%),
                            linear-gradient(to top,   rgba(1,2,2,0.60) 0%, rgba(1,2,2,0) 20%)
                        `
                    }}
                />

                {/* Ambient glow accents */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[140px] pointer-events-none z-[1]" />

                {/* ── Overlay Content ── */}
                <div className="relative z-20 w-full max-w-6xl mx-auto px-4 h-full flex flex-col justify-center items-center pt-14 pb-16 md:pt-18 md:pb-20 pointer-events-none">

                    {/* Hero text */}
                    <div className="w-full flex flex-col items-center text-center pointer-events-auto">

                        {/* Stage 1: Headline (frames 0-129) */}
                        <div className={`transition-all duration-700 ${currentFrame < 130 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none absolute"}`}>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                                className="font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.1] drop-shadow-2xl"
                                style={{ textShadow: '0 2px 24px rgba(0,0,0,0.8)' }}
                            >
                                Book Any Vehicle. <br className="hidden sm:inline" />
                                Travel & Transport Faster.
                            </motion.h1>

                            <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
                                <button
                                    onClick={handleBookingClick}
                                    className="px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-100 transition-all flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95"
                                >
                                    <Car size={18} />
                                    <span>Book Your Ride Now</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Stage 2: CTA (frames 130-177) */}
                        <div className={`transition-all duration-700 ${currentFrame >= 130 ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none absolute"}`}>
                            <h2
                                className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight"
                                style={{ textShadow: '0 2px 24px rgba(0,0,0,0.8)' }}
                            >
                                Ready to Ride?
                            </h2>
                            <p className="mt-3 text-zinc-200 text-sm sm:text-base max-w-md mx-auto drop-shadow-lg">
                                Join thousands of riders moving effortlessly across the city every single day.
                            </p>
                            <div className="mt-14 flex items-center justify-center gap-4">
                                <button
                                    onClick={handleBookingClick}
                                    className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-sm hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-xl hover:scale-105"
                                >
                                    <span>Get Started Now</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Curved bottom divider */}
                <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
                    <BackgroundCurve position="bottom" height="clamp(3rem, 7vw, 6rem)" />
                </div>
            </div>
        </section>
    )
}
