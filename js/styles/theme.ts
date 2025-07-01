/**
 * Design System Configuration
 *
 * This file contains the design tokens and theme configuration
 * that complement Tailwind CSS for the Remote Map application.
 */

export const theme = {
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
    },
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      600: "#4b5563",
      700: "#374151",
      900: "#111827",
    },
  },
  spacing: {
    sidebar: "20rem", // 320px
  },
  shadows: {
    card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    sidebar:
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  zIndex: {
    mapControls: 1000,
    sidebar: 10,
    modal: 50,
  },
  mapMarker: {
    iconSize: {
      width: 25,
      height: 41,
    },
    iconAnchor: {
      x: 12,
      y: 41,
    },
    popupAnchor: {
      x: 1,
      y: -34,
    },
    shadowSize: {
      width: 41,
      height: 41,
    },
  },
  sizes: {
    xs: {
      iconSize: 12,
      height: 24,
      padding: 6,
      borderRadius: 6,
      fontSize: 8,
    },
    sm: {
      height: 32,
      padding: 12,
      borderRadius: 8,
      fontSize: 12,
      iconSize: 14,
    },
    md: {
      height: 44,
      padding: 20,
      borderRadius: 10,
      fontSize: 14,
      iconSize: 18,
    },
    lg: {
      height: 52,
      padding: 25,
      borderRadius: 12,
      fontSize: 16,
      iconSize: 22,
    },
    xl: {
      height: 56,
      padding: 29,
      borderRadius: 14,
      fontSize: 18,
      iconSize: 28,
    },
  },
} as const;

export type Theme = typeof theme;
export type Size = keyof typeof theme.sizes;
