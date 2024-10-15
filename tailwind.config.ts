import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'], // 300, 400, 500, 600, 700
        ubuntu: ['Ubuntu Sans', 'sans-serif'],
        archivo: ['Archivo', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'], // All weights (italic)
      },
      colors: {
        lbackground: '#ecf7f7',
        dbackground: '#161212',
        azure: {
          50: '#ecf6fe',
          100: '#d6ecfc',
          200: '#b5dffa',
          300: '#82cbf6',
          400: '#46adf2',
          500: '#1183ea',
          600: '#1668cc',
          700: '#1c59b4',
          800: '#1c478f',
          900: '#1d3e6f',
          950: '#162743',
        },
      },
    },
  },
};
