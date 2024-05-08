<template>
  <w-header-dark/>
  <div class="error_page">
    <div class="error_page-container">
        <div class="error_page__img">
          <img src="/img/error-message.png" alt="error">
        </div>
      <h1 class="error_page__title">Oops!</h1>
      <p class="error_page__text">It looks like that page doesn’t exist. Please check the URL and try again.</p>
      <a-button class="error_page__btn" text="Take me home" variant="primary" @click="$router.push({name: 'index'})"/>
    </div>
  </div>
</template>

<script setup>
import WHeaderDark from "~/src/widgets/layouts/w-header-dark/w-header-dark.vue";

import { useWindowSize } from '@vueuse/core'
import { useNuxtApp, useRouter } from '#app'
import { Centrifuge } from 'centrifuge'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'

const { $app } = useNuxtApp()

const centrifuge = ref(null)
const centrifugeAssets = ref(null)
const centrifugeAum = ref(null)

const currentTheme = computed(() => {
  const theme = localStorage.getItem('theme')

  $app.store.user.theme = theme || 'dark'
  return $app.store.user.theme || 'dark'
})

useHead({
  bodyAttrs: { 'data-theme': computed(() => currentTheme.value) },
})

const { height: heightWindow } = useWindowSize()

onMounted(() => {
  router.push('/') // tempfix?

  if (!localStorage.getItem('display-currency')) {
    localStorage.setItem('display-currency', 'btc')
  }

  document.body.dataset.theme = localStorage.getItem('theme') || 'dark'
  $app.store.user.theme = localStorage.getItem('theme') || 'dark'
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
</script>


<style scoped lang="scss">
.error_page {
  padding-top: torem(180);

  @include breakpoint($break-desktop-1024) {
    padding-top: torem(245);
  }

  &__img {
    margin: 0 auto var(--spacing-m-3);
    width: torem(210);
    height: torem(210);
  }

  &__title {
    color: var(--text-primary);
    text-align: center;
    font-family: Dm, sans-serif;
    font-size: torem(32);
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-bottom: var(--spacing-m-1);
  }

  &__text {
    color: var(--text-secondary);
    text-align: center;
    font-family: Dm, sans-serif;
    font-size: torem(16);
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: var(--spacing-m-3);
  }

  &-container {
    margin: 0 auto;
    max-width: torem(410);
    padding: 0 torem(15);
  }

  &__btn {
    width: 100%;
  }
}
</style>
