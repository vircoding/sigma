import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'], // 300, 400, 500, 600, 700
        ubuntu: ['Ubuntu Sans', 'sans-serif'],
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
        keppel: {
          '50': '#f2fbf9',
          '100': '#d3f4ed',
          '200': '#a6e9dc',
          '300': '#72d6c7',
          '400': '#45bcae',
          '500': '#2eab9e',
          '600': '#208179',
          '700': '#1e6762',
          '800': '#1c5350',
          '900': '#1b4643',
          '950': '#0a2928',
        },
        affair: {
          '50': '#faf7fd',
          '100': '#f3edfa',
          '200': '#e9ddf7',
          '300': '#d8c3ef',
          '400': '#c09ce4',
          '500': '#a775d7',
          '600': '#9058c5',
          '700': '#7b44ac',
          '800': '#683c8d',
          '900': '#553172',
          '950': '#391a51',
        },
      },
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9',
      },
    },
  },
};
