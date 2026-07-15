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

  const [statusText, setStatusText] = useState<string>("Upload Syllabus");

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/syllabys`, {
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
      alert(data.message);
      setUploadIdToPoll(data.upload_id); 

      setStatusText("AI is reading syllabus..."); 

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/${uploadIdToPoll}/status`, {
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
          setStatusText("Upload Syllabus"); 
          
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

  useEffect(() => {
    async function checkActiveUpload() {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch("http://127.0.0.1:8000/upload/active", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await res.json();
        if (data.has_active) {
          console.log("Found active upload, resuming poll...");
          setUploading(true);
          setStatusText("Resuming AI process...");
          setUploadIdToPoll(data.upload_id); // This instantly wakes up your polling useEffect!
        }
      } catch (e) {
        console.error("Failed to check active uploads");
      }
    }
    
    checkActiveUpload();
  }, [getToken]); // Only runs on mount

    return (
    // Removed max-w-sm, added w-full and responsive padding
    <div className="p-5 md:p-6 bg-slate-900 border border-slate-800 rounded-xl w-full shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">New Schedule</h3>
        <p className="text-xs text-gray-400">Upload a PDF syllabus to extract tasks.</p>
      </div>
      
      <form action={handleFormAction} className="flex flex-col gap-4">
        <input
          type="file"
          name="file"
          accept="application/pdf"
          className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 transition-colors"
        />
        <button
          type="submit"
          disabled={uploading}
          className="w-full px-4 py-2.5 bg-indigo-600 rounded-md text-white font-medium disabled:bg-slate-800 disabled:text-slate-500 transition-colors"
        >
          {statusText}
        </button>
      </form>
    </div>
  );
}