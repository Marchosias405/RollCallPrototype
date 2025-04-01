/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",  
    "./app/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-gray-200', 'bg-gray-500',
    'bg-green-200', 'bg-green-500',
    'bg-blue-200', 'bg-blue-500',
    'bg-red-200', 'bg-red-500',
  ],
};
