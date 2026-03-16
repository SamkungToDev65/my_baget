/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'selector',// เพิ่มบรรทัดนี้เพื่อให้ระบบ Dark Mode ในโค้ดทำงานได้
  theme: {
    extend: {},
  },
  plugins: [],
}