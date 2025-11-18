export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Simple Notes',
      meta: [
        { name: 'description', content: 'A minimal notes app built with Nuxt 3' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><circle cx=%2212%22 cy=%2212%22 r=%2210%22 fill=%22%232563EB%22/></svg>' }
      ],
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || '',
      frontendUrl: process.env.NUXT_PUBLIC_FRONTEND_URL || '',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || '',
      nodeEnv: process.env.NUXT_PUBLIC_NODE_ENV || '',
      telemetryDisabled: process.env.NUXT_PUBLIC_NEXT_TELEMETRY_DISABLED || '',
      enableSourceMaps: process.env.NUXT_PUBLIC_ENABLE_SOURCE_MAPS || '',
      port: process.env.NUXT_PUBLIC_PORT || '',
      trustProxy: process.env.NUXT_PUBLIC_TRUST_PROXY || '',
      logLevel: process.env.NUXT_PUBLIC_LOG_LEVEL || '',
      healthcheckPath: process.env.NUXT_PUBLIC_HEALTHCHECK_PATH || '',
      featureFlags: process.env.NUXT_PUBLIC_FEATURE_FLAGS || '',
      experimentsEnabled: process.env.NUXT_PUBLIC_EXPERIMENTS_ENABLED || '',
    }
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
  },
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      port: 3000,
    },
  },
})
