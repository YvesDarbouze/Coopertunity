"use client";

import { useState, useEffect } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { Users, Plus, Save, Loader2, ArrowRight, UserPlus, Zap, MessageCircle } from "lucide-react";
import Link from "next/link";
import WatchlistSidebar from "./WatchlistSidebar";
import ConnectionRequestsInbox from "./ConnectionRequestsInbox";

// Types corresponding to API
type NetworkUser = {
    id: string;
    name: string | null;
    profession: string | null;
    image: string | null;
    location: string | null;
};

type Stakeholder = {
    id: string;
    name: string;
    members: NetworkUser[];
};

// -- Draggable User Card --
function DraggableUser({ user, isDragging }: { user: NetworkUser, isDragging?: boolean }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: user.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-amber-200 transition"
        >
            <img
                src={user.image || `https://ui-avatars.com/api/?name=${user.name || 'U'}&background=random`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover pointer-events-none"
            />
            <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">{user.name || "Unknown Connection"}</p>
                <p className="text-xs text-gray-400 truncate">{user.profession || "No profession listed"}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onPointerDown={(e) => {
                        // Stop propagation so we don't accidentally start a drag event when clicking the button
                        e.stopPropagation();
                    }}
                    onClick={async (e) => {
                        e.stopPropagation();
                        // Instead of forcing a push, we could use the next-navigation router, but to keep DraggableUser pure let's just use window.location or Link logic
                        // A simple window.location is fine here for an action button inside a drag context
                        window.location.href = `/api/messages/redirect?targetId=${user.id}`;
                    }}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    title="Message User"
                >
                    <MessageCircle size={16} />
                </button>
            </div>

            {/* Drag Handle */}
            <div className="text-gray-300 ml-1">
                <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2" cy="4" r="2" fill="currentColor" />
                    <circle cx="2" cy="10" r="2" fill="currentColor" />
                    <circle cx="2" cy="16" r="2" fill="currentColor" />
                    <circle cx="10" cy="4" r="2" fill="currentColor" />
                    <circle cx="10" cy="10" r="2" fill="currentColor" />
                    <circle cx="10" cy="16" r="2" fill="currentColor" />
                </svg>
            </div>
        </div>
    );
}

// -- Dropzone (Stakeholder Container) --
function StakeholderDropzone({ stakeholder, users }: { stakeholder: Stakeholder, users: NetworkUser[] }) {
    const { isOver, setNodeRef } = useDroppable({
        id: stakeholder.id,
    });

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "p-5 rounded-3xl border-2 transition-all min-h-[160px] flex flex-col",
                isOver ? "border-amber-400 bg-amber-50 shadow-inner" : "border-gray-100 bg-white shadow-sm"
            )}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-gray-900">{stakeholder.name}</h3>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{users.length} Members</span>
            </div>

            <div className="flex-1">
                {users.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center text-gray-400 italic text-sm">
                        Drag connections here
                    </div>
                ) : (
                    <div className="space-y-2">
                        {users.map(u => (
                            <div key={u.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <img
                                    src={u.image || `https://ui-avatars.com/api/?name=${u.name || 'U'}&background=random`}
                                    className="w-6 h-6 rounded-full"
                                />
                                <span className="text-sm font-bold text-gray-700 truncate">{u.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


export default function NetworkPageClient() {
    const [network, setNetwork] = useState<NetworkUser[]>([]);
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [newStakeholderName, setNewStakeholderName] = useState("");
    const [isCreatingStakeholder, setIsCreatingStakeholder] = useState(false);

    // Sensitivities for mouse vs touch
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require dragging 8px before activation to distinguish from clicks
            },
        })
    );

    useEffect(() => {
        async function loadNetwork() {
            try {
                const res = await fetch("/api/network");
                if (res.ok) {
                    const data = await res.json();
                    setNetwork(data.network || []);
                    setStakeholders(data.stakeholders || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadNetwork();
    }, []);

    const createStakeholder = async () => {
        if (!newStakeholderName.trim()) return;
        setIsCreatingStakeholder(true);
        try {
            const res = await fetch("/api/network/stakeholders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newStakeholderName.trim() })
            });
            if (res.ok) {
                const newStakeholder = await res.json();
                setStakeholders([newStakeholder, ...stakeholders]);
                setNewStakeholderName("");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsCreatingStakeholder(false);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveDragId(event.active.id as string);
    };

    const handleDragEnd = async (event: any) => {
        setActiveDragId(null);
        const { active, over } = event;

        if (!over) return;

        const userId = active.id;
        const targetStakeholderId = over.id;

        // Skip if dropping onto the origin list (which doesn't have a droppable setup currently, but good guard)
        if (targetStakeholderId === "roster") return;

        // Optimistically update UI
        const userToMove = network.find(u => u.id === userId);
        if (!userToMove) return;

        // Find current stakeholder of this user to see if they're already in it (prevent duplicates)
        const targetStakeholderIndex = stakeholders.findIndex(s => s.id === targetStakeholderId);
        if (targetStakeholderIndex === -1) return;

        const isAlreadyInStakeholder = stakeholders[targetStakeholderIndex].members.some(m => m.id === userId);
        if (isAlreadyInStakeholder) return;

        // Add to new stakeholder
        setStakeholders(prev => prev.map(sq => {
            if (sq.id === targetStakeholderId) {
                return { ...sq, members: [...sq.members, userToMove] };
            }
            return sq;
        }));

        // Fire API
        try {
            const targetStakeholder = stakeholders[targetStakeholderIndex];
            const newMemberIds = [...targetStakeholder.members.map(m => m.id), userId];

            await fetch("/api/network/stakeholders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stakeholderId: targetStakeholderId, memberIds: newMemberIds })
            });
        } catch (e) {
            console.error("Failed to save drop state", e);
            // In a production app, we would revert optimistic UI here on failure
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F5F3EF]">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-[#F5F3EF] min-h-screen pb-24">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10 w-full mb-8 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                            <Users className="text-emerald-600" /> Network & Stakeholders
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">Build your active project teams and manage your connections.</p>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New Stakeholder Name..."
                            value={newStakeholderName}
                            onChange={(e) => setNewStakeholderName(e.target.value)}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                            onKeyDown={(e) => e.key === "Enter" && createStakeholder()}
                        />
                        <button
                            onClick={createStakeholder}
                            disabled={isCreatingStakeholder || !newStakeholderName.trim()}
                            className="bg-pan-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                        >
                            <Plus size={16} /> Create
                        </button>
                    </div>
                </div>
            </div>

            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="max-w-7xl mx-auto px-6">

                    <div className="grid lg:grid-cols-12 gap-8">

                        {/* ROSTER: The active connections list */}
                        <div className="lg:col-span-3 flex flex-col h-[calc(100vh-180px)]">
                            <ConnectionRequestsInbox />

                            <h2 className="font-black text-lg text-gray-900 mb-4 flex items-center justify-between">
                                Complete Roster
                                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full">{network.length}</span>
                            </h2>

                            <div className="bg-gray-100 p-4 rounded-3xl overflow-y-auto flex-1 inner-shadow border border-gray-200">
                                {network.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <UserPlus size={40} className="mx-auto mb-3 opacity-20" />
                                        <p className="text-sm font-medium">No active connections yet.</p>
                                        <Link href="/dashboard/explore" className="text-emerald-600 text-xs font-bold hover:underline mt-2 inline-block">Explore Network &rarr;</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <SortableContext items={network.map(u => u.id)} strategy={verticalListSortingStrategy}>
                                            {network.map(user => (
                                                <DraggableUser key={user.id} user={user} isDragging={activeDragId === user.id} />
                                            ))}
                                        </SortableContext>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SQUADS: The Dropzones */}
                        <div className="lg:col-span-6">
                            <h2 className="font-black text-lg text-gray-900 mb-4 flex items-center gap-2">
                                <Zap className="text-amber-500" /> Active Stakeholders
                            </h2>

                            {stakeholders.length === 0 ? (
                                <div className="bg-white p-12 rounded-3xl border border-gray-100 border-dashed text-center h-full flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                        <Users size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Build Your Dream Team</h3>
                                    <p className="text-gray-500 text-sm max-w-sm mb-6">Create a Stakeholder using the input above, then drag your connections into the circle to assemble your project team.</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {stakeholders.map(stakeholder => (
                                        <StakeholderDropzone key={stakeholder.id} stakeholder={stakeholder} users={stakeholder.members} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* WATCHLISTS */}
                        <div className="lg:col-span-3 h-[calc(100vh-180px)]">
                            <WatchlistSidebar />
                        </div>

                    </div>
                </div>
            </DndContext>
        </div>
    );
}
