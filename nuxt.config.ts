// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config

const stripScssMarkerProd = '.strip-scss-marker{color:red}'
const stripScssMarkerLocal = '/* STYLES STRIP IMPORTS MARKER */'
const stripScssMarker = process.env.NODE_ENV === 'production' ? stripScssMarkerProd : stripScssMarkerLocal
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: 'BitcoinETF',
      titleTemplate: '%s',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, height=device-height, initial-scale=1.0, shrink-to-fit=no, viewport-fit=cover, maximum-scale=1',
        },
        {
          name: 'msapplication-TileColor',
          content: '#603cba',
        },
        {
          name: 'msapplication-config',
          content: '/img/favicons/browserconfig.xml',
        },
        {
          name: 'theme-color',
          content: '#ffffff',
        },
      ],
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/img/favicons/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/favicons/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/img/favicons/favicon-16x16.png' },
        { rel: 'shortcut icon', href: '/img/favicons/favicon.ico' },
        { rel: 'manifest', href: '/img/favicons/site.webmanifest' },
        { rel: 'mask-icon', href: '/img/favicons/safari-pinned-tab.svg', color: '#ff7900' },
      ],
      noscript: [
        {
          children: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5VFHBBD7 height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        },
      ],
      script: [
        { type: 'text/javascript', id: 'pap_x2s6df8d', src: 'https://bitcoinetf.postaffiliatepro.com/scripts/trackjs.js' },
      ]
    },
  },
  /*devServer: {
    port: 80
  },*/
  telemetry: false,
  experimental: {
    inlineSSRStyles: false,
    watcher: 'parcel',
  },
  build: {
    extractCSS: true,
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '.',
    },
  },
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/devtools',
    '@nuxt/image',
    '@nuxtjs/device',
    [
      '@/modules/iconica',
      {
        iconDir: "public/img/icons",
        outputFile: 'src/shared/constants/icons.ts',
      },
    ],
    [
      '@/modules/fontagon',
      {
        iconDir: 'public/img/icons',
        dest: 'assets/fonts/icons/dist',
        fontName: 'icons',
        templateOptions: {
          baseSelector: '.a-icons',
          classPrefix: 'icon-',
        },
        cssTemplate: 'assets/fonts/icons/sass-template.hbs',
      },
    ],
  ],
  components: {
    global: true,
    dirs: [
      {
        path: 'src/shared/ui/site/sections',
        extensions: ['vue'],
      },
      {
        path: 'src/shared/ui/site/molecules',
        extensions: ['vue'],
      },
      {
        path: 'src/widgets/w-news',
        extensions: ['vue'],
      },
      {
        path: 'src/shared/ui/promolandings',
        extensions: ['vue'],
      }
    ],
  },
  dir: {
    layouts: 'src/layouts',
    pages: 'src/pages',
    plugins: 'src/app/plugins',
    middleware: 'src/app/middleware',
  },
  vueuse: {
    ssrHandlers: true,
  },
  runtimeConfig: {
    public: {
      WS_TOKEN: process.env.NUXT_PUBLIC_WEBSOCKET_TOKEN,
      WS_URL: process.env.NUXT_PUBLIC_WEBSOCKET_URL,
      INFO_API: process.env.NUXT_PUBLIC_INFO_API,
      ETH_API: process.env.NUXT_PUBLIC_ETH_API,
      EXPLORER_API: process.env.NUXT_PUBLIC_EXPLORER_API,
      RESERVE_WALLET_ADDRESS: process.env.NUXT_PUBLIC_RESERVE_WALLET_ADDRESS,
      ICON_API: process.env.NUXT_PUBLIC_ICON_API,
      DOMAIN: process.env.DOMAIN,
      APP_DOMAIN: process.env.APP_DOMAIN,
      MOONPAY_API_KEY: process.env.NUXT_PUBLIC_MOONPAY_API_KEY,
    },
  },
  css: ['@/src/app/styles/proxy-global.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/src/app/styles/global";${stripScssMarker}`,
        },
      },
    },
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
        },
      },
    },
    plugins: [
      {
        name: 'vite-plugin-vue-strip-css',
        transform(src: string, id) {
          if (id.endsWith('.vue') && !id.includes('node_modules') && src.includes('@extend')) {
            console.warn(
              'You are using @extend in your component. This is likely not working in your styles. Please use mixins instead.',
              id.replace(`@/src/app/styles/`, ''),
            )
          }

          if (!id.includes('proxy-global.scss') && src.includes(stripScssMarker)) {
            const newSource = src.split(stripScssMarker)

            return {
              code: newSource[1],
              map: null,
            }
          }

          return {
            code: src,
            map: null,
          }
        },
      },
    ],
  },
  nitro: {
    moduleSideEffects: ['reflect-metadata'],
  },
  routeRules: {
    '/img/**': { headers: { 'cache-control': `public,max-age=31536000,s-maxage=31536000` } },
    '/_nuxt/**': { headers: { 'cache-control': `public,max-age=31536000,s-maxage=31536000` } },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
      },
    },
  },
  hooks: {
    // prevent some prefetch behaviour
    'build:manifest': (manifest) => {
      for (const key in manifest) {
        manifest[key].dynamicImports = []

        const file = manifest[key]
        if (file.assets) {
          file.assets = file.assets.filter((assetName) => !/.+\.(gif|jpe?g|png|svg)$/.test(assetName))
        }
      }
    },
    'pages:extend'(routes) {
      const extendedRoutes = [
        {
          name: 'personal-fund',
          path: '/personal/fund',
          file: '~/src/widgets/w-fund/w-fund.vue',
        },
        {
          name: 'personal-protection',
          path: '/personal/fund/protection',
          file: '~/src/widgets/w-fund/w-fund.vue',
        },
        {
          name: 'personal-shareholders',
          path: '/personal/fund/shareholders',
          file: '~/src/widgets/w-fund/w-fund.vue',
        },
        {
          name: 'personal-portfolio',
          path: '/personal/fund/portfolio',
          file: '~/src/widgets/w-fund/w-fund.vue',
        },
        {
          name: 'personal-assets',
          path: '/personal/assets',
          file: '~/src/widgets/w-assets/w-assets.vue',
        },
        {
          name: 'personal-assets-symbol',
          path: '/personal/assets/:symbol',
          file: '~/src/widgets/w-assets/w-assets.vue',
        },
        {
          name: 'personal-wallet',
          path: '/personal/wallet',
          file: '~/src/widgets/w-wallet/w-wallet.vue',
        },
        {
          name: 'personal-dividends',
          path: '/personal/wallet/dividends',
          file: '~/src/widgets/w-wallet/w-wallet.vue',
        },
        {
          name: 'personal-referrals',
          path: '/personal/wallet/referrals',
          file: '~/src/widgets/w-wallet/w-wallet.vue',
        },
        {
          name: 'personal-etfs',
          path: '/personal/wallet/etfs',
          file: '~/src/widgets/w-etfs/w-etfs.vue',
        },
        {
          name: 'personal-sell-etfs',
          path: '/personal/wallet/sell/etfs',
          file: '~/src/widgets/w-sell-etfs/w-sell-etfs.vue',
        },
      ]
      routes.push(...extendedRoutes)
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  router: {
    // https://router.vuejs.org/api/interfaces/routeroptions.html
    options: {}
  },
  devtools: {
    timeline: {
      enabled: true,
    },
  },
})
