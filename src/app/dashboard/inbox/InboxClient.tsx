"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Send, Upload, User, Loader2, ArrowLeft, MoreVertical, Paperclip } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// -- API Types --
type Participant = {
    id: string;
    name: string | null;
    image: string | null;
    profession: string | null;
};

type Message = {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
    read: boolean;
};

type ConversationPreview = {
    id: string;
    participants: Participant[];
    messages: Message[];
    updatedAt: string;
    hasUnread: boolean;
};

type FullConversation = ConversationPreview & {
    messages: Message[];
};

export default function InboxClient() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const chatParam = searchParams.get("chat");

    const [conversations, setConversations] = useState<ConversationPreview[]>([]);
    const [activeChat, setActiveChat] = useState<FullConversation | null>(null);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingChat, setLoadingChat] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Load - Get all conversations
    useEffect(() => {
        async function fetchConversations() {
            try {
                const res = await fetch("/api/messages/conversations");
                if (res.ok) {
                    const data = await res.json();
                    setConversations(data);
                }
            } catch (e) {
                console.error("Failed to load conversations", e);
            } finally {
                setLoadingConversations(false);
            }
        }
        fetchConversations();
    }, []);

    // Load active chat if param is present
    useEffect(() => {
        if (!chatParam) { setActiveChat(null); return; }

        async function fetchChat() {
            setLoadingChat(true);
            try {
                const res = await fetch(`/api/messages/${chatParam}`);
                if (res.ok) {
                    const data = await res.json();
                    setActiveChat(data);

                    // Mark as read in local preview list so badging updates
                    setConversations(prev => prev.map(c =>
                        c.id === chatParam ? { ...c, hasUnread: false } : c
                    ));

                    setTimeout(() => scrollToBottom(), 100);
                }
            } catch (e) {
                console.error("Failed to load chat", e);
            } finally {
                setLoadingChat(false);
            }
        }
        fetchChat();
    }, [chatParam]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat || !session?.user) return;

        const contentSent = newMessage.trim();
        setIsSending(true);
        setNewMessage(""); // Optimistically clear input

        try {
            const res = await fetch(`/api/messages/${activeChat.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: contentSent }),
            });

            if (res.ok) {
                const msg = await res.json();
                setActiveChat(prev => {
                    if (!prev) return null;
                    return { ...prev, messages: [...prev.messages, msg] };
                });

                // Also update the preview in the left rail
                setConversations(prev => prev.map(c => {
                    if (c.id === activeChat.id) {
                        return { ...c, messages: [msg], updatedAt: msg.createdAt };
                    }
                    return c;
                }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));

                setTimeout(() => scrollToBottom(), 100);
            }
        } catch (error) {
            console.error(error);
            setNewMessage(contentSent); // Revert on failure
        } finally {
            setIsSending(false);
        }
    };

    const getOtherParticipant = (participants: Participant[]) => {
        return participants[0] || { name: "Unknown User", id: "unknown" };
    };

    if (loadingConversations) {
        return (
            <div className="h-[calc(100vh-100px)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-pan-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-[#F5F3EF] h-[calc(100vh-80px)] flex flex-col md:p-6 overflow-hidden">

            <div className="flex-1 bg-white md:rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex">

                {/* Left Rail: Conversations List */}
                <div className={clsx(
                    "w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col bg-gray-50 border-r border-gray-200 transition-all",
                    chatParam ? "hidden md:flex" : "flex"
                )}>
                    <div className="p-5 bg-white border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-black text-pan-black">Messages</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm font-bold text-gray-500 mb-2">Network is Quiet</p>
                                <p className="text-xs text-gray-400 mb-4">You have no active conversations yet.</p>
                                <Link
                                    href="/dashboard/network"
                                    className="text-xs font-bold text-pan-gold hover:underline"
                                >
                                    Go to Network Roster →
                                </Link>
                            </div>
                        ) : (
                            conversations.map(chat => {
                                const other = getOtherParticipant(chat.participants);
                                const latestMsg = chat.messages[0];
                                const isActive = activeChat?.id === chat.id;

                                return (
                                    <button
                                        key={chat.id}
                                        onClick={() => router.push(`/dashboard/inbox?chat=${chat.id}`)}
                                        className={clsx(
                                            "w-full text-left p-4 flex items-start gap-4 hover:bg-white transition-colors border-b border-gray-100 relative",
                                            isActive ? "bg-white border-l-4 border-l-pan-gold shadow-sm z-10" : "bg-transparent border-l-4 border-l-transparent",
                                            chat.hasUnread && "bg-amber-50/30"
                                        )}
                                    >
                                        <div className="relative shrink-0">
                                            <img
                                                src={other.image || `https://ui-avatars.com/api/?name=${other.name || 'U'}&background=random`}
                                                className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-100"
                                            />
                                            {chat.hasUnread && (
                                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <span className={clsx("font-bold text-sm truncate", chat.hasUnread ? "text-pan-black" : "text-gray-900")}>
                                                    {other.name}
                                                </span>
                                                {latestMsg && (
                                                    <span className="text-[10px] text-gray-400 font-medium shrink-0 ml-2">
                                                        {new Date(latestMsg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={clsx("text-xs truncate", chat.hasUnread ? "font-bold text-gray-800" : "text-gray-500 font-medium")}>
                                                {latestMsg ? (
                                                    latestMsg.senderId === session?.user?.id ? `You: ${latestMsg.content}` : latestMsg.content
                                                ) : "New Conversation"}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Main Content: Chat Window */}
                <div className={clsx(
                    "flex-1 flex flex-col bg-white",
                    !chatParam ? "hidden md:flex" : "flex"
                )}>
                    {!chatParam ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50">
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-gray-100 text-pan-gold/50">
                                <Send size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Your Messages</h3>
                            <p className="text-sm text-gray-500 max-w-sm text-center">Select a conversation from the left to start sending messages and coordinating your next deal.</p>
                        </div>
                    ) : loadingChat ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                        </div>
                    ) : activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-white z-10 shadow-sm relative">
                                <button
                                    onClick={() => router.push('/dashboard/inbox')}
                                    className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900"
                                >
                                    <ArrowLeft size={20} />
                                </button>

                                {(() => {
                                    const other = getOtherParticipant(activeChat.participants);
                                    return (
                                        <>
                                            <img
                                                src={other.image || `https://ui-avatars.com/api/?name=${other.name || 'U'}&background=random`}
                                                className="w-10 h-10 rounded-full shadow-sm border border-gray-100"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900">{other.name}</h3>
                                                <p className="text-xs text-pan-gold font-bold uppercase tracking-wider">{other.profession}</p>
                                            </div>
                                            <button className="p-2 text-gray-400 hover:text-pan-black transition-colors rounded-full hover:bg-gray-50">
                                                <MoreVertical size={20} />
                                            </button>
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Messages Viewport */}
                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-cloud-dancer">

                                <div className="text-center my-6">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1 rounded-full shadow-inner">
                                        End of Conversation History
                                    </span>
                                </div>

                                {activeChat.messages.map((msg, i) => {
                                    const isMe = msg.senderId === session?.user?.id;
                                    const showTail = i === activeChat.messages.length - 1 || activeChat.messages[i + 1].senderId !== msg.senderId;

                                    return (
                                        <div key={msg.id} className={clsx("flex flex-col max-w-[75%]", isMe ? "self-end items-end" : "self-start items-start")}>
                                            <div className={clsx(
                                                "px-5 py-3 text-sm shadow-sm relative",
                                                isMe
                                                    ? "bg-pan-gold text-pan-black font-medium"
                                                    : "bg-white text-gray-900 border border-gray-100",

                                                // Dynamic border radius for messaging bubbles
                                                isMe ? "rounded-l-2xl rounded-tr-2xl" : "rounded-r-2xl rounded-tl-2xl",
                                                showTail && isMe ? "rounded-br-none" : "",
                                                showTail && !isMe ? "rounded-bl-none" : "",
                                            )}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold mt-1 px-1 opacity-70">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Form */}
                            <div className="p-4 bg-white border-t border-gray-200">
                                <form onSubmit={sendMessage} className="flex gap-2">
                                    <button type="button" className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition">
                                        <Paperclip size={20} />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Write a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pan-gold focus:ring-2 focus:ring-pan-gold/20 transition-all font-medium"
                                        disabled={isSending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || isSending}
                                        className="px-6 py-3 bg-pan-black text-pan-gold font-bold text-sm rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-black/10"
                                    >
                                        {isSending ? <Loader2 size={18} className="animate-spin text-pan-gold" /> : "Send"}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <span className="text-gray-500 font-medium">Chat Error</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
