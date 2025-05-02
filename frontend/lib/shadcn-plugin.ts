import plugin from "tailwindcss/plugin"
import { fontFamily } from "tailwindcss/defaultTheme"

export const shadcnPlugin = plugin(
  // Add CSS variable definitions to the base layer
  ({ addBase }) => {
    addBase({
      ":root": {
        "--radius": "0.5rem",
      },
    })
  },
  // Add components, utilities, etc.
  {
    theme: {
      extend: {
        fontFamily: {
          sans: ["var(--font-sans)", ...fontFamily.sans],
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
      },
    },
  },
)
