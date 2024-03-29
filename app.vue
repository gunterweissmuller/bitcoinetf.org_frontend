<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <notifications />
    <component :is="'script'" src="https://telegram.org/js/telegram-widget.js?22"></component>
    <component :is="'script'" type="text/javascript" src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></component>
    <component :is="'script'" id="pap_x2s6df8d" src="https://bitcoinetf.postaffiliatepro.com/scripts/trackjs.js"></component>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useRouter, useRoute } from '#app'
import { Centrifuge } from 'centrifuge'
const { notifications } = useNotification()
const { $app } = useNuxtApp()
import { useWindowSize } from '@vueuse/core'
import {watch} from "vue";

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
const ignoredChatRoutesSpecial = ['tetherspecial','weloverussia']
const ignoredChatRoutesAlways = ['personal']
const ignoreChatSpecial = ref(false)
const ignoreChatAlways = ref(false)
const bodyAttrIgnoreSpecial = computed(() => {
  return ignoreChatSpecial.value
})
const bodyAttrIgnoreAlways = computed(() => {
  return ignoreChatAlways.value
})
watch(
  () => route.name,
  (value) => {
    ignoreChatSpecial.value = ignoredChatRoutesSpecial.some(v => value?.includes(v))
    ignoreChatAlways.value = ignoredChatRoutesAlways.some(v => value?.includes(v))
  },
  {
    immediate: true,
  },
)
useHead({
  bodyAttrs: {
    'data-theme': computed<string>(() => currentTheme.value),
    'ignore-mini-chat-specials': computed(() => bodyAttrIgnoreSpecial.value),
    'ignore-mini-chat-always': computed(() => bodyAttrIgnoreAlways.value),
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

onMounted(() => {
  wsUpdateBtcPrice()
  wsUpdateAssets()
  wsUpdateAum()
})

onUnmounted(() => {
  centrifuge.value?.disconnect()
  centrifugeAssets.value?.disconnect()
  centrifugeAum.value?.disconnect()
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
</script>
