const aspectRatio = require('@tailwindcss/aspect-ratio');
const tailwindForms = require('@tailwindcss/forms');
const lineClamp = require('@tailwindcss/line-clamp');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './resources/scripts/**/*.js',
    './resources/scripts/**/*.ts',
    './src/**/*.liquid',
    './src/config/settings_schema.json',
  ],

  safelist: [
    {
      pattern: /shopify-(challenge|policy)__(container|title|message|body)/,
    },
    {
      pattern: /product__media--aspect--(4\/5|1\/1|5\/7)/,
    },
  ],

  theme: {
    extend: {
      colors: {
        'primary-text': 'rgb(var(--primary-text) / <alpha-value>)',
        'secondary-text': 'rgb(var(--secondary-text) / <alpha-value>)',
        'accent-1': 'rgb(var(--accent-1) / <alpha-value>)',
        'accent-2': 'rgb(var(--accent-2) / <alpha-value>)',
        'primary-bg': 'rgb(var(--primary-bg) / <alpha-value>)',
        'secondary-bg': 'rgb(var(--secondary-bg) / <alpha-value>)',
        'accent-1-bg': 'rgb(var(--accent-1-bg) / <alpha-value>)',
        'accent-2-bg': 'rgb(var(--accent-2-bg) / <alpha-value>)',
        'primary-button-bg': 'rgb(var(--primary-button-bg) / <alpha-value>)',
        'primary-button-bg-hover': 'rgb(var(--primary-button-bg-hover) / <alpha-value>)',
        'primary-button-text': 'rgb(var(--primary-button-text) / <alpha-value>)',
        'primary-button-text-hover': 'rgb(var(--primary-button-text-hover) / <alpha-value>)',
        'secondary-button-bg': 'rgb(var(--secondary-button-bg) / <alpha-value>)',
        'secondary-button-bg-hover': 'rgb(var(--secondary-button-bg-hover) / <alpha-value>)',
        'secondary-button-text': 'rgb(var(--secondary-button-text) / <alpha-value>)',
        'secondary-button-text-hover': 'rgb(var(--secondary-button-text-hover) / <alpha-value>)',
        'accent-button-bg': 'rgb(var(--accent-button-bg) / <alpha-value>)',
        'accent-button-bg-hover': 'rgb(var(--accent-button-bg-hover) / <alpha-value>)',
        'accent-button-text': 'rgb(var(--accent-button-text) / <alpha-value>)',
        'accent-button-text-hover': 'rgb(var(--accent-button-text-hover) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        caution: 'rgb(var(--caution) / <alpha-value>)',
      },

      animation: {
        'horizon-pulse': 'horizon-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'horizon-ping': 'horizon-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },

      keyframes: {
        'horizon-pulse': {
          '50%': { opacity: 0.5 },
        },
        'horizon-ping': {
          '75%, 100%': { transform: 'scale(2)', opacity: 0 },
        },
      },

      fontFamily: {
        serif: ['var(--heading-font-family)', 'ui-sans-serif'],
        sans: ['var(--body-font-family)', 'ui-serif'],
      },

      fontSize: {
        sm: [
          '0.833rem',
          {
            lineHeight: '1.082rem',
            letterSpacing: 'var(--body-font-spacing)',
          },
        ],
        base: [
          '1rem',
          {
            lineHeight: '1.75rem',
            letterSpacing: 'var(--body-font-spacing)',
          },
        ],
        xl: [
          '1rem',
          {
            lineHeight: '1.3rem',
            letterSpacing: 'var(--heading-font-spacing)',
          },
        ],
        '2xl': [
          '1.2rem',
          {
            lineHeight: '1.56rem',
            letterSpacing: 'var(--heading-font-spacing)',
          },
        ],
        '3xl': [
          '1.44rem',
          {
            lineHeight: '1.871rem',
            letterSpacing: 'var(--heading-font-spacing)',
          },
        ],
        '4xl': [
          '1.728rem',
          {
            lineHeight: '2.246rem',
            letterSpacing: 'var(--heading-font-spacing)',
          },
        ],
        '5xl': [
          '2.074rem',
          {
            lineHeight: '2.696rem',
            letterSpacing: 'var(--heading-font-spacing)',
          },
        ],
        '6xl': [
          '2.488rem',
          {
            lineHeight: '3.234rem',
            letterSpacing: 'var(--heading-font-spacing)',
          },
        ],
        '7xl': [
          '2.986rem',
          {
            lineHeight: '3.882rem',
            letterSpacing: 'var(--heading-font-spacing)',
          },
        ],
        '8xl': [
          '3.583rem',
          {
            lineHeight: '4.658rem',
            letterSpacing: 'var(--heading-font-spacing)',
          },
        ],
        '9xl': [
          '4.3rem',
          {
            lineHeight: '5.59rem',
            letterSpacing: 'var(--heading-font-spacing)',
          },
        ],
      },

      borderRadius: {
        DEFAULT: 'var(--rounded)',
        xs: 'var(--rounded-xs)',
        sm: 'var(--rounded-sm)',
        lg: 'var(--rounded-lg)',
      },
    },
  },

  corePlugins: {
    aspectRatio: false,
  },

  plugins: [aspectRatio, tailwindForms, lineClamp],
};
