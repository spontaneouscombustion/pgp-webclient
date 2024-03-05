/** @type {import('tailwindcss').Config} */

import TailwindCSSTypography from '@tailwindcss/typography'
import DaisyUI from 'daisyui'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    TailwindCSSTypography,
    DaisyUI
  ],
}

