"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, MoreVertical, Flag, X } from "lucide-react";

interface Message {
    id: string;
    senderId: string;
    content: string;
    attachmentUrl?: string;
    createdAt: string;
    sender: { name: string | null; image: string | null };
}

interface ChatWindowProps {
    conversationId?: string;
    recipientId?: string;
    recipientName?: string;
    onClose?: () => void;
}

export default function ChatWindow({ conversationId, recipientId, recipientName, onClose }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Polling for messages
    useEffect(() => {
        if (!conversationId) return;

        const fetchMessages = async () => {
            try {
                // In a real app, you'd fetch by conversation ID
                // For MVP, we might mock or use a specific endpoint
                const res = await fetch(`/api/messages?conversationId=${conversationId}`);
                if (res.ok) {
                    const data = await res.json();
                    // Assuming API returns list of conversations, we need to extract messages from the specific one
                    // Simplified: just assuming this endpoint returns messages for now
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [conversationId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversationId,
                    recipientId,
                    content: newMessage
                })
            });

            if (res.ok) {
                const sentMsg = await res.json();
                setMessages(prev => [...prev, { ...sentMsg, sender: { name: "Me", image: null } }]); // Optimistic update
                setNewMessage("");
            }
        } catch (e) {
            console.error("Failed to send", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] w-full max-w-md bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl font-body">
            {/* Header */}
            <div className="bg-cloud-dancer p-4 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-peach-fuzz/20 flex items-center justify-center text-deep-brown font-black font-heading">
                        {recipientName ? recipientName[0] : "?"}
                    </div>
                    <span className="font-black text-deep-brown font-heading">{recipientName || "Chat"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button title="Report User" className="text-mocha-mousse hover:text-red-500 transition">
                        <Flag className="h-4 w-4" />
                    </button>
                    {onClose && (
                        <button onClick={onClose} className="text-mocha-mousse hover:text-deep-brown transition">
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.length === 0 && (
                    <div className="text-center text-mocha-mousse text-sm mt-10 font-bold">
                        Start the conversation with {recipientName || "them"}.<br />
                        Say hello! 👋
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.senderId === "ME" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm font-medium ${msg.senderId === "ME"
                            ? "bg-peach-fuzz text-deep-brown rounded-tr-none"
                            : "bg-white text-deep-brown border border-gray-100 rounded-tl-none"
                            }`}>
                            <p>{msg.content}</p>
                            {msg.attachmentUrl && (
                                <div className="mt-2 text-xs opacity-75 flex items-center gap-1 bg-black/5 p-1 rounded">
                                    <Paperclip className="h-3 w-3" /> Attachment
                                </div>
                            )}
                            <span className="text-[10px] opacity-60 block text-right mt-1 font-bold">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                <button type="button" className="text-mocha-mousse hover:text-deep-brown transition">
                    <Paperclip className="h-5 w-5" />
                </button>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-deep-brown focus:outline-none focus:border-peach-fuzz placeholder-mocha-mousse/50 font-medium transition"
                />
                <button
                    type="submit"
                    disabled={loading || !newMessage.trim()}
                    className="bg-deep-brown text-white p-2 rounded-full hover:bg-mocha-mousse disabled:opacity-50 transition shadow-md"
                >
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
}
