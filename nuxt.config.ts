export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabasePublishableKey: '',
      siteUrl: 'https://products.droneworld.tech'
    }
  },
  app: {
    head: {
      title: 'Partdro Products | UAV & Drone Supplier Directory',
      meta: [
        { name: 'description', content: 'Explore professional UAVs, cargo drones, agricultural aircraft and industrial drone solutions from verified manufacturers.' },
        { name: 'theme-color', content: '#102a2a' }
      ],
      link: [{ rel: 'preconnect', href: 'https://fonts.googleapis.com' }, { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }, { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap' }]
    }
  },
  nitro: {
    compressPublicAssets: true
  },
  typescript: { strict: true, typeCheck: true }
})
