"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("todo_token");
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const whatsappNumber = "923118716038";
  const defaultMessage = "Hello, I need help with Todo-App.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Contact us on WhatsApp"
    >
      {/* Pulse animation rings */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping" />
      <div className="absolute inset-1 rounded-full bg-[#25D366] opacity-50 animate-pulse" />

      {/* Main button */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/50 backdrop-blur-xl border border-white/20 transition-all hover:scale-110 active:scale-95 group-hover:shadow-[#25D366]/70">
        <MessageCircle className="h-7 w-7" strokeWidth={2.5} />
      </div>
    </a>
  );
}
