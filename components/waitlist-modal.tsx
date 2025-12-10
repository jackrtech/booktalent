"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { submitWaitlist } from "@/app/actions/waitlist";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-[#1a1a1a] p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Join the Waitlist
        </h2>

        {/* IMPORTANT: Direct binding to the SERVER ACTION */}
        <form
          action={async (formData) => {
            setStatus("loading");
            const result = await submitWaitlist(formData);

            if (result?.success) {
              setStatus("success");
              setTimeout(() => {
                onClose();
                setStatus("idle");
              }, 1500);
            } else {
              setStatus("error");
              setErrorMessage(result?.error || "Something went wrong.");
            }
          }}
          className="space-y-4"
        >
          <input
            name="name"
            required
            placeholder="Name"
            className="w-full p-3 rounded bg-[#2a2a2a] text-white"
          />

          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full p-3 rounded bg-[#2a2a2a] text-white"
          />

          {status === "error" && (
            <div className="text-red-500 text-sm border border-red-500 p-2 rounded">
              {errorMessage}
            </div>
          )}

          {status === "success" && (
            <div className="text-green-500 text-sm border border-green-500 p-2 rounded">
              Success!
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 bg-[#14DFFF] rounded font-bold"
          >
            {status === "loading" ? "Joining..." : "Join"}
          </button>
        </form>
      </div>
    </div>
  );
}
