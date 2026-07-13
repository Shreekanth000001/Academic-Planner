"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface DeleteButtonProps {
  scheduleId: string;
}

export default function DeleteButton({ scheduleId }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { getToken } = useAuth();

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this schedule?");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const token = await getToken();

      const response = await fetch(`http://localhost:8000/schedules/${scheduleId}`,{
        method:"DELETE",
        headers:{
            Authorization: `Bearer ${token}`
        }
      }
      )

      if(!response.ok){
        throw new Error("Failed to delete");
      }

      router.refresh();

    } catch (error) {
      console.error(error);
      alert("Failed to delete schedule.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}