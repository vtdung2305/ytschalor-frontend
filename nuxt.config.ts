import UnpluginComponentsVite from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  // server side rendering mode
  ssr: false,

  // typescripts
  typescript: {
    strict: true,
    typeCheck: false,
  },

  // css
  css: [
    'ant-design-vue/dist/reset.css',
    '~/assets/sass/vendor.scss',
    '~/assets/sass/app.scss',
  ],

  // plugins
  plugins: [
    '~/plugins/nuxtServerInit.ts',
    '~/plugins/navbar.ts',
    '~/plugins/api.ts',
    '~/plugins/recaptcha.ts',
    '~/plugins/modal.ts',
    '~/plugins/googleOauth.ts',
  ],

  // build
  build: {
    transpile: ['@headlessui/vue'],
  },

  // modules
  modules: [
    'unplugin-icons/nuxt',
    '@intlify/nuxt3',
    '@pinia/nuxt',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-windicss',
    '@ant-design-vue/nuxt',
    'vue-recaptcha/nuxt',
    '@nuxtjs/device',
  ],

  antd: {},

  // experimental features
  experimental: {
    reactivityTransform: false,
  },

  // auto import components
  components: true,

  // vite plugins
  vite: {
    plugins: [
      UnpluginComponentsVite({
        dts: true,
        resolvers: [
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@import "../assets/sass/_variables.scss"; @import "../assets/sass/_media.scss"; @import "../assets/sass/_custom.scss";',
        },
      },
    },
    resolve: {
      alias: {
        'ant-design-vue/dist': 'ant-design-vue/dist',
        'ant-design-vue/es': 'ant-design-vue/es',
        'ant-design-vue/lib': 'ant-design-vue/es',
        'ant-design-vue': 'ant-design-vue/es',
      },
    },
  },

  // app config
  app: {
    // global transition
    pageTransition: { name: 'page', mode: 'out-in' },
    // layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  // localization - i18n config
  intlify: {
    localeDir: 'locales',
    vueI18n: {
      locale: 'ja',
      fallbackLocale: 'ja',
      availableLocales: ['en', 'id', 'ja', 'ko'],
      fallbackWarn: false,
      missingWarn: false,
    },
  },

  // vueuse
  vueuse: {
    ssrHandlers: true,
  },

  // windicss
  windicss: {
    analyze: {
      analysis: {
        interpretUtilities: false,
      },
      server: {
        port: 4000,
        open: false,
      },
    },
    scan: true,
  },

  // content
  content: {
    documentDriven: false,
    markdown: {
      mdc: true,
    },
    highlight: {
      theme: 'github-dark',
    },
  },

  // runtime config
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
      apiVer: process.env.API_VER,
      apiCloud: process.env.API_CLOUD,
      homeUrl: process.env.HOME_URL,
      siteKey: process.env.RECAPTCHA_V2_SITEKEY,
      secretKey: process.env.GOOGLE_CLIENT_SECRET,
      clientId: process.env.GOOGLE_CLIENT_ID,
      supportSiteUrl: process.env.SUPPORT_SITE_URL,
      recaptcha: {
        v2SiteKey: process.env.RECAPTCHA_V2_SITEKEY,
      },
    },
  },

  recaptcha: {
    plugin: false,
  },
})
