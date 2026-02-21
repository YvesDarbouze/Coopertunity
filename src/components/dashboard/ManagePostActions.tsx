"use client";

import { Edit3, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ManagePostActions({ postId }: { postId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to close this Coopertunity?")) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/coopertunities/manage`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: postId })
            });
            if (res.ok) {
                toast.success("Coopertunity closed successfully");
                router.refresh();
            } else {
                toast.error("Failed to close Coopertunity");
            }
        } catch (e) {
            toast.error("Internal error");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
            <Link
                href={`/coopertunities/${postId}`}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
            >
                <Eye size={16} /> View
            </Link>
            <button
                onClick={() => toast.info("Edit mode coming soon")}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-pan-blue hover:bg-pan-blue/5 transition"
            >
                <Edit3 size={16} /> Edit
            </button>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center p-2 border border-gray-200 rounded-lg text-pan-red hover:bg-pan-red/5 transition disabled:opacity-50"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}
