import type { Config } from "tailwindcss";

const config: Config = {
  // Tell Tailwind where to look for CSS classes
  // It scans these files and removes unused CSS automatically
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Dark mode controlled by a class on <html> tag
  // next-themes will add/remove this class automatically
  darkMode: "class",

  theme: {
    extend: {
      // ============================================
      // BRAND COLORS — StudentHub India
      // ============================================
      colors: {
        // Primary Blue — used for buttons, links, headers
        primary: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af", // Main brand blue
          900: "#1e3a8a",
          950: "#172554",
        },
        // Accent Orange — used for highlights, badges, CTAs
        accent: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c", // Main accent orange
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        // Success Green — used for positive indicators
        success: {
          500: "#22c55e",
          600: "#16a34a",
        },
        // Warning Yellow — used for alerts, deadlines
        warning: {
          500: "#eab308",
          600: "#ca8a04",
        },
        // Danger Red — used for errors, urgent notices
        danger: {
          500: "#ef4444",
          600: "#dc2626",
        },
      },

      // ============================================
      // FONTS — Inter for clean, modern look
      // ============================================
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      // ============================================
      // FONT SIZES — optimized for readability
      // ============================================
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        xs:   ["0.75rem",  { lineHeight: "1rem" }],
        sm:   ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem",     { lineHeight: "1.5rem" }],
        lg:   ["1.125rem", { lineHeight: "1.75rem" }],
        xl:   ["1.25rem",  { lineHeight: "1.75rem" }],
        "2xl":["1.5rem",   { lineHeight: "2rem" }],
        "3xl":["1.875rem", { lineHeight: "2.25rem" }],
        "4xl":["2.25rem",  { lineHeight: "2.5rem" }],
        "5xl":["3rem",     { lineHeight: "1" }],
      },

      // ============================================
      // BREAKPOINTS — Mobile first approach
      // 80%+ Indian students use mobile phones
      // ============================================
      screens: {
        "xs":  "375px",  // Small phones (iPhone SE)
        "sm":  "640px",  // Large phones
        "md":  "768px",  // Tablets
        "lg":  "1024px", // Small laptops
        "xl":  "1280px", // Desktops
        "2xl": "1536px", // Large screens
      },

      // ============================================
      // SPACING — consistent spacing system
      // ============================================
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      // ============================================
      // BORDER RADIUS — modern rounded corners
      // ============================================
      borderRadius: {
        "4xl": "2rem",
      },

      // ============================================
      // BOX SHADOW — subtle depth effects
      // ============================================
      boxShadow: {
        "card":  "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.12)",
        "nav":   "0 1px 3px rgba(0, 0, 0, 0.1)",
      },

      // ============================================
      // ANIMATION — smooth transitions
      // ============================================
      animation: {
        "fade-in":    "fadeIn 0.3s ease-in-out",
        "slide-up":   "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        slideDown: {
          "0%":   { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)",     opacity: "1" },
        },
      },

      // ============================================
      // BACKGROUND IMAGE — gradient utilities
      // ============================================
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%)",
        "gradient-accent":
          "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #1e3a8a 0%, #1e40af 40%, #1d4ed8 100%)",
      },
    },
  },

  plugins: [],
};

export default config;