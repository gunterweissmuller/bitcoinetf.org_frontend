<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <notifications />
    <component :is="'script'" src="https://telegram.org/js/telegram-widget.js?22"></component>
    <component :is="'script'" type="text/javascript" src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></component>
<!--    <component async :is="'script'" src="https://connect.facebook.net/en_US/sdk.js"></component>-->
    <component :is="'script'" id="pap_x2s6df8d" src="https://bitcoinetf.postaffiliatepro.com/scripts/trackjs.js"></component>
    <component :is="'script'" type="text/javascript" src="https://cdn.jsdelivr.net/npm/multicoin-address-validator@0.5.16/dist/wallet-address-validator.min.js"></component>
    <!-- <component :is="'script'" type="text/javascript" src="https://cdn.jsdelivr.net/npm/crypto-wallet-address-validator@0.2.1/dist/wallet-address-validator.min.js"></component> -->
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useRouter, useRoute } from '#app'
import { Centrifuge } from 'centrifuge'
const { notifications } = useNotification()
const { $app } = useNuxtApp()
import { useWindowSize } from '@vueuse/core'
import {watch} from "vue";
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/vue'

const route = useRoute()
const centrifuge = ref(null)
const centrifugeAssets = ref(null)
const centrifugeAum = ref(null)


const assets = computed(() => {
  return $app.store.assets.items
})

const currentTheme = computed<string>(() => {
  const theme = localStorage.getItem('theme')

  $app.store.user.theme = theme || 'dark'
  return $app.store.user.theme || 'dark'
})


useHead({
  bodyAttrs: {
    'data-theme': computed<string>(() => currentTheme.value),
  }
})


const { height: heightWindow } = useWindowSize()

onMounted(() => {
  if (!localStorage.getItem('display-currency')) {
    localStorage.setItem('display-currency', 'btc')
  }

  document.body.dataset.theme = localStorage.getItem('theme') || 'dark'
  $app.store.user.theme = localStorage.getItem('theme') || 'dark'


  try {
    PostAffTracker.setAccountId('bitcoinetf.postaffiliatepro.com');

    PostAffTracker.track();
  } catch (err) { }

  const urlParams = new URLSearchParams(window.location.search);
  const aAidParam = urlParams.get('a_aid');
  if(aAidParam) {
    const str = window.location.search.replace('?', '');
    window.localStorage.setItem('a_aid', aAidParam);
    window.localStorage.setItem('a_utm', str);


  }
})

watch(
  heightWindow,
  (value) => {
    if (typeof window !== 'undefined') {
      const vh = value * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
  },
  {
    immediate: true,
  },
)

const config = useRuntimeConfig()
const centrifugeURL = config.public.WS_URL
const centrifugeToken = config.public.WS_TOKEN
const wsUpdateBtcPrice = () => {
  centrifuge.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })
  centrifuge.value.connect()

  const sub = centrifuge.value.newSubscription('event_update_btc_price')

  sub
    .on('publication', function (ctx) {
      const message = ctx.data.message

      $app.store.user.btcValue = message.price
      $app.store.assets.btcValue = message.price
    })
    .subscribe()
}

const wsUpdateAssets = () => {
  centrifugeAssets.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })

  centrifugeAssets.value.connect()

  const subAssets = centrifugeAssets.value.newSubscription('event_asset')

  subAssets
    .on('publication', function (ctx) {
      if ($app.store.assets?.items?.length) {
        const updatedAssetIndex = $app.store.assets.items.findIndex((asset) => asset.uuid === ctx.data.message.uuid)
        if (~updatedAssetIndex) {
          $app.store.assets.items[updatedAssetIndex].full_balance = ctx.data.message.full_balance
          $app.store.assets.items[updatedAssetIndex].apy = ctx.data.message.apy
        }
      }
    })
    .subscribe()
}

const wsUpdateAum = () => {
  centrifugeAum.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })
  centrifugeAum.value.connect()

  const sub = centrifugeAum.value.newSubscription('events_statistics')

  sub
    .on('publication', function (ctx) {
      const message = ctx.data.message
      $app.store.user.statistic.aum_usd = message.amount
    })
    .subscribe()
}

const centrifugeLatestTrade = ref(null);

const waUpateLatestTrade = async () => {
  const requestParams = {
    per_page: 4,
    page: 1,
  }

  await $app.api.info.event.getDeals(requestParams).then((dealsResponse) => {
    $app.store.user.latestTrade = dealsResponse.data.data[dealsResponse.data.data.length - 1].result_amount;
  });

  centrifugeLatestTrade.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })

  centrifugeLatestTrade.value.connect()

  const sub = centrifugeLatestTrade.value.newSubscription('event_deal')
  sub
    .on('publication', function (ctx) {
      $app.store.user.latestTrade = ctx.data.message?.result_amount
    })
    .subscribe()
}

waUpateLatestTrade();

onMounted(() => {
  wsUpdateBtcPrice();
  wsUpdateAssets();
  wsUpdateAum();
})

onUnmounted(() => {
  centrifuge.value?.disconnect()
  centrifugeAssets.value?.disconnect()
  centrifugeAum.value?.disconnect()
  centrifugeLatestTrade.value?.disconnect();
})

const router = useRouter()

router.beforeEach((to, from, next) => {
  $app.store.user.routeFrom = from.name
  $app.store.user.routeTo = to.name

  next()
})

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// walletConnect
// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '2c405771381e1a1f65a48a216a166f61'

// 2. Set chains
const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
}

// 3. Create your application's metadata object
const metadata = {
    name: 'My Website',
    description: 'My Website description',
    url: 'https://mywebsite.com', // url must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
    /*Required*/
    metadata,

    /*Optional*/
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: true, // true by default
    rpcUrl: '...', // used for the Coinbase SDK
    defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
const modal = createWeb3Modal({
    ethersConfig,
    chains: [mainnet],
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true // Optional - false as default
})

$app.api.eth.auth.walletConnectGetCredentials().then((msg) => {
  $app.store.registration.walletConnectData.signatureMessage = msg.data?.message;
})

// metamask

onMounted(() => {
    // metamask support

    $app.store.auth.isMetamaskSupported = typeof (window as any).ethereum !== 'undefined'
        if ($app.store.auth.isMetamaskSupported) {
            (window as any).ethereum.on('chainChanged', (chainId: string) => {
              // if (chainId !== '0x1') {
              //     metamaskError.value = 'This network is not supported. Please change the network to Ethereum.'
              // } else if (chainId === '0x1') {
              //     metamaskError.value = ''
              // }
            })
        } else {
            console.log('Metamask is not installed')
        }
})
</script>
