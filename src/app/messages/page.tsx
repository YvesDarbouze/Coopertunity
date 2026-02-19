
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send, CheckCircle, MoreVertical, Phone, Video, Loader2 } from "lucide-react";
import clsx from "clsx";
import { useSession } from "next-auth/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Participant = {
    id: string;
    name: string | null;
    image: string | null;
};

type ConversationPreview = {
    id: string;
    updatedAt: string;
    participants: Participant[];
    messages: { id: string; content: string; senderId: string; createdAt: string }[];
};

type Message = {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
    sender: Participant;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getOtherParticipant(conv: ConversationPreview, myId: string): Participant {
    return conv.participants.find((p) => p.id !== myId) ?? conv.participants[0];
}

function formatTime(iso: string) {
    const date = new Date(iso);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MessagesPage() {
    const { data: session } = useSession();
    const myId = session?.user?.id ?? "";

    const [conversations, setConversations] = useState<ConversationPreview[]>([]);
    const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [search, setSearch] = useState("");

    const [loadingConvs, setLoadingConvs] = useState(true);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [sending, setSending] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    // ── Fetch conversation list ──
    useEffect(() => {
        async function loadConversations() {
            setLoadingConvs(true);
            try {
                const res = await fetch("/api/messages");
                if (res.ok) {
                    const data: ConversationPreview[] = await res.json();
                    setConversations(data);
                    if (data.length > 0 && !selectedConvId) {
                        setSelectedConvId(data[0].id);
                    }
                }
            } catch (err) {
                console.error("Failed to load conversations", err);
            } finally {
                setLoadingConvs(false);
            }
        }
        if (myId) loadConversations();
    }, [myId]);

    // ── Fetch messages when conversation changes ──
    useEffect(() => {
        if (!selectedConvId) return;
        async function loadMessages() {
            setLoadingMsgs(true);
            try {
                const res = await fetch(`/api/messages?conversationId=${selectedConvId}`);
                if (res.ok) {
                    const data: Message[] = await res.json();
                    setMessages(data);
                }
            } catch (err) {
                console.error("Failed to load messages", err);
            } finally {
                setLoadingMsgs(false);
            }
        }
        loadMessages();
    }, [selectedConvId]);

    // ── Auto-scroll to bottom ──
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ── Send a message ──
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedConvId || sending) return;

        setSending(true);
        const content = messageInput;
        setMessageInput("");

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId: selectedConvId, content }),
            });

            if (res.ok) {
                const newMsg: Message = await res.json();
                // Attach sender info optimistically (we know it's us)
                const enriched: Message = {
                    ...newMsg,
                    sender: {
                        id: myId,
                        name: session?.user?.name ?? null,
                        image: session?.user?.image ?? null,
                    },
                };
                setMessages((prev) => [...prev, enriched]);

                // Refresh conversation list to update last-message preview
                const listRes = await fetch("/api/messages");
                if (listRes.ok) setConversations(await listRes.json());
            }
        } catch (err) {
            console.error("Failed to send message", err);
            // Restore the input if something went wrong
            setMessageInput(content);
        } finally {
            setSending(false);
        }
    };

    // ── Derived ──
    const selectedConv = conversations.find((c) => c.id === selectedConvId) ?? null;
    const otherUser = selectedConv ? getOtherParticipant(selectedConv, myId) : null;

    const filteredConversations = conversations.filter((c) => {
        const other = getOtherParticipant(c, myId);
        return other.name?.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* ── Sidebar ── */}
            <div className="w-80 border-r border-zinc-800 flex flex-col">
                <div className="p-6 border-b border-zinc-800">
                    <h1 className="text-2xl font-heading font-bold mb-4">Messages</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search conversations..."
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-pan-gold outline-none transition"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingConvs ? (
                        <div className="flex items-center justify-center h-32 text-gray-500">
                            <Loader2 className="animate-spin mr-2" size={18} /> Loading…
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">
                            No conversations yet. <br /> Match with someone to start chatting!
                        </div>
                    ) : (
                        filteredConversations.map((conv) => {
                            const other = getOtherParticipant(conv, myId);
                            const lastMsg = conv.messages[0];
                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedConvId(conv.id)}
                                    className={clsx(
                                        "p-4 flex gap-3 cursor-pointer transition hover:bg-zinc-900",
                                        selectedConvId === conv.id
                                            ? "bg-zinc-900 border-l-2 border-pan-gold"
                                            : "border-l-2 border-transparent"
                                    )}
                                >
                                    <div className="relative shrink-0">
                                        {other.image ? (
                                            <img
                                                src={other.image}
                                                alt={other.name ?? "User"}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold uppercase">
                                                {other.name?.[0] ?? "?"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-sm truncate">{other.name ?? "Unknown"}</h3>
                                            {conv.updatedAt && (
                                                <span className="text-[10px] text-gray-500 shrink-0 ml-1">
                                                    {formatTime(conv.updatedAt)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 truncate">
                                            {lastMsg
                                                ? lastMsg.senderId === myId
                                                    ? `You: ${lastMsg.content}`
                                                    : lastMsg.content
                                                : "Start a conversation"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── Chat Area ── */}
            <div className="flex-1 flex flex-col bg-zinc-900/50">
                {selectedConv && otherUser ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                            <div className="flex items-center gap-3">
                                {otherUser.image ? (
                                    <img
                                        src={otherUser.image}
                                        alt={otherUser.name ?? "User"}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center font-bold uppercase">
                                        {otherUser.name?.[0] ?? "?"}
                                    </div>
                                )}
                                <div>
                                    <h2 className="font-bold text-white flex items-center gap-2">
                                        {otherUser.name ?? "Unknown"}
                                        <CheckCircle className="w-4 h-4 text-pan-green fill-current" />
                                    </h2>
                                </div>
                            </div>
                            <div className="flex gap-4 text-gray-400">
                                <button className="hover:text-white"><Phone size={20} /></button>
                                <button className="hover:text-white"><Video size={20} /></button>
                                <button className="hover:text-white"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {loadingMsgs ? (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <Loader2 className="animate-spin mr-2" size={18} /> Loading messages…
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                    No messages yet. Say hello!
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.senderId === myId;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={clsx(
                                                "flex flex-col max-w-[70%]",
                                                isMe ? "ml-auto items-end" : "items-start"
                                            )}
                                        >
                                            <div
                                                className={clsx(
                                                    "p-4 rounded-2xl text-sm font-body leading-relaxed",
                                                    isMe
                                                        ? "bg-pan-gold text-black rounded-tr-none"
                                                        : "bg-zinc-800 text-white rounded-tl-none"
                                                )}
                                            >
                                                {msg.content}
                                            </div>
                                            <span className="text-[10px] text-gray-500 mt-1 px-1">
                                                {formatTime(msg.createdAt)}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                            <form onSubmit={handleSend} className="flex gap-4">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message…"
                                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-pan-gold outline-none transition"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageInput.trim() || sending}
                                    className="bg-pan-gold hover:bg-yellow-500 text-black p-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
