"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface ChatBoxProps {
  uploadId: string;
}

export default function ChatBox({ uploadId }: ChatBoxProps) {
  const { getToken } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // The Network Handler
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    // 1. Optimistic UI Update: Show the user's message instantly
    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const token = await getToken();

      // 2. The API Contract: Firing to your new FastAPI endpoint
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          upload_id: uploadId,
          question: userMessage,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();

      // 3. Update UI with AI's response
      setMessages((prev) => [...prev, { role: "ai", content: data.answer }]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "⚠️ Network error. Could not reach the AI worker." }
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    // Fixed height bug: changed h-125 to responsive h-[500px] lg:h-[600px]
    <div className="flex flex-col h-[500px] lg:h-[600px] border border-gray-800 bg-gray-950 rounded-xl overflow-hidden shadow-lg w-full">
      {/* Chat Header */}
      <div className="bg-gray-900 px-4 py-3 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-200">🤖 Syllabus Assistant</h3>
      </div>

      {/* Message History Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-4">Ask a question about your syllabus!</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] md:max-w-[75%] px-4 py-2 rounded-xl text-sm ${msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-400 px-4 py-2 rounded-xl text-xs rounded-bl-none animate-pulse">
              AI is thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}