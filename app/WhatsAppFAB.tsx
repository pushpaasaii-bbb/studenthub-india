"use client";

import { MessageCircle } from "lucide-react";

const WhatsAppFAB = () => {
  const phoneNumber = "919999999999";

  const message =
    "Hello StudentHub India team, I need help regarding colleges, exams, or student services.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with StudentHub India on WhatsApp"
      className="
        fixed
        bottom-5
        right-5
        z-50
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-green-500
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:scale-110
        hover:bg-green-600
        focus:outline-none
        focus:ring-4
        focus:ring-green-300
        dark:focus:ring-green-700
        sm:h-16
        sm:w-16
      "
    >
      <MessageCircle
        size={28}
        strokeWidth={2.5}
        className="sm:h-8 sm:w-8"
      />

      <span className="sr-only">
        Contact StudentHub India through WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppFAB;