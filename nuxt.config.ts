// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: {enabled: true},

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://127.0.0.1:8000/api'
    }
  },

  plugins: [
    '~/plugins/api',
  ],

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/test-utils',
    '@nuxt/scripts',
    '@nuxt/image',
    'reka-ui/nuxt',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],
  ui: {
    fonts: false
    // prefix: 'Nuxt'
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  pinia: {
    storesDir: ['./stores/**'],
  },

})