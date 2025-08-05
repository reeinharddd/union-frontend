/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts}'],
  // Comentamos experimental por compatibilidad con Node 22.x
  // experimental: {
  //   optimizeUniversalDefaults: true,
  // },
  theme: {
    // ---------------------------------------------------------------------
    // 1. ESCALAS DE COLORES PERSONALIZADAS
    // ---------------------------------------------------------------------
    colors: {
      // --- Base "brand" -----------------------------------------------
      primary: {
        50:  '#fff3eb',
        100: '#ffeadb',
        200: '#ffd0b7',
        300: '#ffb392',
        400: '#ff9a6d',
        500: '#EB6228',   // DEFAULT
        600: '#c74d1f',
        700: '#a4441c',   // "dark"
        800: '#6f2c12',
        900: '#3a1608',
        DEFAULT: '#EB6228',
        dark:    '#A4441C',
      },

      secondary: {
        50:  '#fff7ef',
        100: '#fbead4',
        200: '#f7d5a9',
        300: '#f3c17e',
        400: '#efac53',
        500: '#EB9728',  // DEFAULT
        600: '#bc7920',
        700: '#8d5b18',
        800: '#5e3c10',
        900: '#2f1e08',
        DEFAULT: '#EB9728',
        dark:    '#bc7920',
      },

      accent: {
        50:  '#ffeef1',
        100: '#ffd8de',
        200: '#ffb0bd',
        300: '#ff869c',
        400: '#ff5d7b',
        500: '#EB2843',  // DEFAULT  *("danger"/"error")*
        600: '#c42137',
        700: '#A41C2F',  // "dark"
        800: '#67121e',
        900: '#33090f',
        DEFAULT: '#EB2843',
        dark:    '#A41C2F',
      },

      // --- Estados semánticos -----------------------------------------
      success: {
        50:  '#eafaea',
        100: '#d5f5d6',
        200: '#abecae',
        300: '#81e486',
        400: '#57db5e',
        500: '#28a745',   // Bootstrap-like
        600: '#208637',
        700: '#186628',
        800: '#104619',
        900: '#08230b',
        DEFAULT: '#28a745',
      },
      warning: {
        50:  '#fffbea',
        100: '#fff4c7',
        200: '#ffe98f',
        300: '#ffde56',
        400: '#ffd32d',
        500: '#ffc107',
        600: '#d39c06',
        700: '#a77705',
        800: '#6b4e03',
        900: '#372701',
        DEFAULT: '#ffc107',
      },
      info: {
        50:  '#e7f9fb',
        100: '#c3f1f6',
        200: '#87e3ee',
        300: '#4ad5e5',
        400: '#1dc6dc',
        500: '#17a2b8',
        600: '#128292',
        700: '#0e6170',
        800: '#09414d',
        900: '#05202b',
        DEFAULT: '#17a2b8',
      },

      // --- Neutros & utilidades ---------------------------------------
      neutral: {
        50:  '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        DEFAULT: '#737373',
      },

      // --- Colores básicos de Tailwind (necesarios para compatibilidad) ---
      blue: {
        50:  '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        DEFAULT: '#3b82f6',
      },
      green: {
        50:  '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        DEFAULT: '#22c55e',
      },
      yellow: {
        50:  '#fefce8',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        DEFAULT: '#f59e0b',
      },
      purple: {
        50:  '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87',
        DEFAULT: '#a855f7',
      },
      red: {
        50:  '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        DEFAULT: '#ef4444',
      },
      gray: {
        50:  '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        DEFAULT: '#6b7280',
      },

      // Atajos de superficie / texto
      background:  '#F5F5F5',
      surface:     '#FFFFFF',
      border:      '#E5E5E5',
      'text-base':   '#171717',
      'text-muted':  '#525252',
      'text-invert': '#FFFFFF',
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#FFFFFF',
    },

    // ---------------------------------------------------------------------
    // 2. TIPOGRAFÍA, SOMBRAS, ANIMACIONES, BREAKPOINTS
    // ---------------------------------------------------------------------
    extend: {
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
      },

      boxShadow: {
        soft:  '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.03)',
        hover: '0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -2px rgba(0,0,0,0.05)',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease-out',
        'slide-in':  'slideIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },

      // Breakpoints: añadimos xs
      screens: {
        xs:  '475px',
        ...require('tailwindcss/defaultTheme').screens,
      },
    },
  },

  // ---------------------------------------------------------------------
  // 3. CONFIGURACIÓN GENERAL
  // ---------------------------------------------------------------------
  darkMode: 'class',           // Habilita modo oscuro por clase
  plugins: [
    // Comentamos plugins para evitar problemas con ES modules por ahora
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    // require('tailwindcss-animate'),
  ],
  corePlugins: {
    container: false,          // Definirás tu propio contenedor si lo necesitas
  },
};
