"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface UploadResponse {
  message: string;
  upload_id: string;
}

export default function UploadForm() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [uploading, setUploading] = useState<boolean>(false);

   const [uploadIdToPoll, setUploadIdToPoll] = useState<string | null>(null);

  const handleFormAction = async (formData: FormData) => {
    const token = await getToken();

    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      alert("No file selected.");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("File type should be PDF.");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload/syllabys", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        alert("Internal server processing error.");
        return;
      }

      const data: UploadResponse = await response.json();
      console.log("Ingestion successful:", data);
      setUploadIdToPoll(data.upload_id); 
    } catch (error) {
      console.error("Network fault:", error);
    } finally {
      setUploading(false);
    }
  }

  // 5. The Polling State Machine
  useEffect(() => {
    // If there is no ID to poll, go to sleep.
    if (!uploadIdToPoll) return;

    console.log(`Starting to poll status for upload: ${uploadIdToPoll}`);

    const intervalId = setInterval(async () => {
      try {
        const token = await getToken();
        // Hit the new FastAPI status endpoint we just built
        const res = await fetch(`http://127.0.0.1:8000/upload/${uploadIdToPoll}/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Status check failed");

        const statusData = await res.json();
        console.log("Current AI Status:", statusData.status);

        if (statusData.status === "COMPLETED") {
          // Success! Kill the polling thread
          clearInterval(intervalId);
          
          // Reset our UI state
          setUploadIdToPoll(null);
          setUploading(false);
          
          // Force the Server Component (page.tsx) to re-fetch the database!
          router.refresh(); 
        } else if (statusData.status === "FAILED") {
          clearInterval(intervalId);
          setUploadIdToPoll(null);
          setUploading(false);
          alert("AI Processing Failed.");
        }
        
      } catch (err) {
        console.error("Polling error:", err);
        clearInterval(intervalId);
        setUploading(false);
      }
    }, 3000); // Poll every 3 seconds

    // Cleanup function: If the user navigates away, kill the interval
    return () => clearInterval(intervalId);

  }, [uploadIdToPoll, getToken, router]); // Dependency array: wake up when uploadIdToPoll changes

    return (
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg max-w-sm">
        {/* React 19 forms accept functions directly inside action attributes */}
        <form action={handleFormAction} className="flex flex-col gap-3">
          <input
            type="file"
            name="file"
            accept="application/pdf"
            className="text-slate-300 file:bg-slate-800 file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:mr-2"
          />
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-indigo-600 rounded text-white disabled:bg-slate-700 transition"
          >
            {uploading ? "Ingesting System Config..." : "Upload Syllabus"}
          </button>
        </form>
      </div>
    );
  }