'use client'
import axios from 'axios'
import { Send, Sparkles, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getSocket } from '@/lib/socket'

type message = {
    _id?: string,
    bookingId: string,
    sender: "user" | "driver",
    text: string,
    createdAt: Date | string
}

function RideChat({ currentRole, bookingId, userName, driverName }: any) {
    const otherName = currentRole == "user" ? driverName : userName
    const myName = currentRole == "user" ? userName : driverName
    const [messages, setMessages] = useState<message[]>([])
    const [lastMessage, setLastMessage] = useState("")
    const [text, setText] = useState("")
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showAI, setShowAI] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const sendMsg = async () => {
        if (!text.trim()) return
        const msgText = text.trim()
        setText("")

        const tempMsg: message = {
            bookingId,
            sender: currentRole,
            text: msgText,
            createdAt: new Date().toISOString()
        }

        const socket = getSocket()
        try {
            const { data } = await axios.post("/api/chat/send", {
                sender: currentRole,
                text: msgText,
                bookingId
            })
            const finalMsg = data || tempMsg
            setMessages(prev => {
                if (finalMsg._id && prev.some(m => m._id === finalMsg._id)) return prev
                return [...prev, finalMsg]
            })
            setLastMessage(msgText)
            socket.emit("chat-message", finalMsg)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllMsgs = async () => {
        try {
            const { data } = await axios.post("/api/chat/get-all", {
                bookingId
            })
            if (Array.isArray(data)) {
                setMessages(data)
                if (data.length > 0) {
                    setLastMessage(data[data.length - 1].text)
                }
            }
        } catch (error: any) {
            console.log(error?.response?.data?.message || error)
        }
    }

    const formatTime = (dateInput: Date | string) => {
        const date = new Date(dateInput)
        if (isNaN(date.getTime())) return ""
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    useEffect(() => {
        getAllMsgs()
    }, [bookingId])

    useEffect(() => {
        const socket = getSocket()
        if (bookingId) {
            socket.emit("join-ride", bookingId)
        }

        const handleChatMessage = (data: message) => {
            setMessages((prev) => {
                if (data._id && prev.some(m => m._id === data._id)) return prev
                if (prev.some(m => m.sender === data.sender && m.text === data.text && Math.abs(new Date(m.createdAt).getTime() - new Date(data.createdAt).getTime()) < 3000)) {
                    return prev
                }
                return [...prev, data]
            })
            if (data.text) setLastMessage(data.text)
        }

        socket.on("chat-message", handleChatMessage)

        return () => {
            socket.off("chat-message", handleChatMessage)
        }
    }, [bookingId])

    const getAISuggestions = async () => {
        setAiLoading(true)
        setShowAI(true)
        try {
            const recentMsg = messages.length > 0 ? messages[messages.length - 1].text : lastMessage
            const { data } = await axios.post("/api/chat/ai-suggestions", {
                role: currentRole, 
                lastMessage: recentMsg
            })
          
            const jsonData = typeof data === "string" ? JSON.parse(data) : data
            setSuggestions(jsonData.suggestions || [])
            setAiLoading(false)
        } catch (error) {
            console.log(error)
            setAiLoading(false)
        }
    }

    return (
        <div className='flex flex-col h-full min-h-0 bg-white rounded-2xl overflow-hidden border border-zinc-100'>

            <div className='flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-zinc-100'>
                <div className='relative flex-shrink-0'>
                    <div className='w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center text-white text-xs font-bold'>
                        {(otherName || "D").charAt(0).toUpperCase()}
                    </div>
                    <span className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white' />
                </div>

                <div className='flex-1 min-w-0'>
                    <p className='text-sm font-bold text-zinc-900 leading-none'>{otherName || "Driver/Customer"}</p>
                    <p className='text-[11px] text-emerald-500 font-semibold mt-0.5'>Active Now</p>
                </div>
            </div>

            <div
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-zinc-50"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                {messages.length === 0 && (
                    <div className='flex flex-col items-center justify-center h-full gap-3 py-16'>
                        <div className='w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center'>
                            <Send size={18} className="text-zinc-400" />
                        </div>
                        <p className='text-sm text-zinc-400 font-medium'>No messages yet</p>
                        <p className='text-xs text-zinc-300'>Start the conversation below</p>
                    </div>
                )}

                {messages.length > 0 && (
                    messages.map((m, i) => {
                        const isMine = m.sender === currentRole
                        return (
                            <motion.div
                                key={m._id || i}
                                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[72%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl shadow-sm ${isMine
                                    ? "bg-zinc-950 text-white rounded-br-sm"
                                    : "bg-white border border-zinc-200 text-zinc-900 rounded-bl-sm"
                                    }`}>
                                    <p className='break-words'>{m.text}</p>
                                    <div className='text-right mt-1'>
                                        <span className={`text-[9px] ${isMine ? 'text-zinc-400' : 'text-zinc-400'}`}>
                                            {formatTime(m.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <AnimatePresence>
                {showAI && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex-shrink-0 overflow-hidden border-t border-zinc-100 bg-white"
                    >
                        <div className='px-4 pt-3 pb-2'>
                            <div className='flex items-center justify-between mb-2'>
                                <div className='flex items-center gap-1.5'>
                                    <Sparkles size={12} className="text-violet-500" />
                                    <span className='text-[11px] font-semibold text-zinc-500 uppercase tracking-wider'>AI Suggestions</span>
                                </div>
                                <button onClick={() => setShowAI(false)}>
                                    <X size={14} className="text-zinc-400 hover:text-zinc-600" />
                                </button>
                            </div>

                            {aiLoading ? (
                                <div className='flex flex-col gap-1.5'>
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-9 bg-zinc-100 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className='flex flex-col gap-1.5'>
                                    {suggestions.map((s, i) => (
                                        <motion.div
                                            key={i}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => { setText(s); setShowAI(false); }}
                                            className="text-left text-sm text-zinc-700 bg-zinc-50 hover:bg-violet-50
                                 hover:text-violet-700 border border-zinc-100 hover:border-violet-200
                                 px-3 py-2 rounded-xl transition-all cursor-pointer"
                                        >
                                            {s}
                                        </motion.div>
                                    ))}

                                    <button 
                                        onClick={getAISuggestions}
                                        className='text-[11px] text-violet-500 hover:text-violet-700 font-semibold text-center mt-1 transition-colors'
                                    >
                                        Refresh Suggestions
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className='flex-shrink-0 px-4 pb-4 pt-2 bg-white'>
                <div className='flex items-center gap-2 bg-zinc-100 rounded-2xl pl-3 pr-1.5 py-1.5'>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => getAISuggestions()}
                        className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            showAI
                                ? "bg-violet-600 text-white"
                                : "bg-white text-violet-500 hover:bg-violet-50 border border-zinc-200"
                        }`}
                        title="AI Quick Replies"
                    >
                        <Sparkles size={14} />
                    </motion.button>

                    <input 
                        type="text" 
                        value={text}
                        placeholder='Type a message...'
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                sendMsg()
                            }
                        }}
                        className='flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none py-1.5 min-w-0'
                    />

                    <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => sendMsg()}
                        disabled={!text.trim()}
                        className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            text.trim()
                                ? "bg-zinc-950 text-white hover:bg-zinc-800"
                                : "bg-transparent text-zinc-300 cursor-not-allowed"
                        }`}
                    >
                        <Send size={14} />
                    </motion.button>
                </div>
            </div>
        </div>
    )
}

export default RideChat
