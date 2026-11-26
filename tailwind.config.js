/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sunflare: {
          DEFAULT: "#F7B638",
          light: "#FFF4DC",
          hover: "#E8A326",
          dark: "#A86700",
        },
        bloodwine: {
          DEFAULT: "#780115",
          hover: "#620111",
          deep: "#5A0110",
          tint: "#FCEEF1",
          tintHover: "#F3DDE2",
        },
        cream: {
          DEFAULT: "#FFFCF7",
          subtle: "#FFF9F0",
          card: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#2B1A1D",
          muted: "#6E6268",
          soft: "#92848B",
          line: "#EADFE2",
          lineWarm: "#EFDFD0",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(120, 1, 21, 0.06)",
        card: "0 10px 30px -4px rgba(120, 1, 21, 0.08)",
        floating: "0 20px 40px -10px rgba(120, 1, 21, 0.16)",
      },
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
