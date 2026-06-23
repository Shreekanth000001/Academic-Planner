"use client";

import { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Note: Using the exact spelling from your FastAPI route: /uploads/syllabys
      const response = await fetch("http://127.0.0.1:8000/uploads/syllabys", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload syllabus");
      }

      setStatus("success");
      setMessage("Syllabus uploaded and queued for processing!");
      setFile(null); // Reset form
      
      // Optional: Force a hard refresh of the page to show the new schedule once processed
      // setTimeout(() => window.location.reload(), 2000);

    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("An error occurred during upload.");
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-white mb-4">Upload New Syllabus</h2>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select PDF Syllabus
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-600 file:text-white
              hover:file:bg-indigo-700
              focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={!file || status === "uploading"}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            !file || status === "uploading"
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
          }`}
        >
          {status === "uploading" ? "Uploading & Processing..." : "Upload & Generate Plan"}
        </button>

        {status === "success" && (
          <p className="text-sm text-green-400 mt-2">{message}</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-400 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}