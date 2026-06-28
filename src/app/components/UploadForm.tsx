"use client";

import React, { useState } from "react";

interface UploadResponse {
  message: string;
}

export default function UploadForm() {
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFormAction = async (formData: FormData) => {
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
      const response = await fetch("http://127.0.0.1:8000/uploads/syllabys", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Internal server processing error.");
        return;
      }

      const data: UploadResponse = await response.json();
      console.log("Ingestion successful:", data);
    } catch (error) {
      console.error("Network fault:", error);
    } finally {
      setUploading(false);
    }
  };

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