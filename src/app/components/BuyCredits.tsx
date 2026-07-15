"use client"; // Strict Boundary: Interactivity & Window mutation

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function BuyCreditsButton() {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckout() {
    setIsLoading(true);
    
    try {
      const token = await getToken();

      if (!token) {
        alert("Authentication lost. Please log out and log back in.");
        setIsLoading(false);
        return;
      }
      
      // 1. Ask FastAPI to generate the Stripe session
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/create-checkout-session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      // 2. The Redirect: Send the user to the Stripe URL
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }

    } catch (error) {
      console.error("Billing error:", error);
      alert("Could not initiate checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button 
      onClick={handleCheckout}
      disabled={isLoading}
      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
    >
      {isLoading ? "Connecting to Stripe..." : "Buy 1000 Credits ($5)"}
    </button>
  );
}