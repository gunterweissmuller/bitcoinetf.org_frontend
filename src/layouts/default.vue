<template>
  <div
    :class="[
      { 'l-main': route.name !== 'personal-kyc' },
      { 'l-main--indent': isVisibleInfo },
      // { 'l-main--indent-wallet': route.path.includes('wallet') },
      { 'l-main--indent-more': route.name === 'personal-more' },
      { 'l-main--no-header': route.name === 'personal-purchase' || route.name === 'personal-buy-shares'  }, 
      { 'l-main--no-header': route.path.includes('wallet') },
    ]"
  ><!---->
    <w-header v-if="route.name !== 'personal-buy-shares' && route.name !== 'personal-sell-etfs'" :list-info="listInfo" /> <!---->
    <template v-if="route.name !== 'personal-kyc'">
      <w-aside v-if="isDesktop || isLaptop"  />
    </template>
    <m-loading v-show="!loading" @loading="changeLoadingStatus" />
    <main v-show="loading" class="l-main__content">
      <div class="l-container">
        <e-buy-shares-success-modal :values="infoPayment" v-model="isOpenSuccessModal" />
        <e-invest-modal />
        <slot />
      </div>
    </main>
    <w-menu-bottom
      v-if="route.name !== 'personal-buy-shares' && route.name !== 'personal-kyc'"
    />
  </div>
</template>

<script setup lang="ts">
import useMediaDevice from '~/composables/useMediaDevice'
import WHeader from '~/src/widgets/layouts/w-header/w-header.vue'
import WAside from '~/src/widgets/layouts/w-aside/w-aside.vue'
import WMenuBottom from '~/src/widgets/layouts/w-menu-bottom/w-menu-bottom.vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import EProcessingPayment from '~/src/entities/e-processing-payment/e-processing-payment.vue'
import { Centrifuge } from 'centrifuge'
import EBuySharesSuccessModal from '~/src/entities/e-buy-shares-success-modal/e-buy-shares-success-modal.vue'
import EInvestModal from '~/src/entities/e-invest-modal/e-invest-modal.vue'
import MLoading from '~/src/shared/ui/molecules/m-loading/m-loading.vue'

const route = useRoute()
const { isLaptop, isDesktop } = useMediaDevice()
const { $app } = useNuxtApp()

const loading = ref(false)
const listInfo = ref([])

// const toggleMenu = () => {
//   $app.store.user.menu = !$app.store.user.menu
//   document.body.classList.toggle('no-scroll', $app.store.user.menu)
// }

// const closeMenu = () => {
//   $app.store.user.menu = false
//   document.body.classList.remove('no-scroll')
// }

const isUserAuthenticated = computed(() => {
  return $app.store.auth.isUserAuthenticated
})

watch(isUserAuthenticated, async (boolean) => {
  if (boolean) {
    await $app.api.eth.auth.getUser().then((resp) => {
      $app.store.user.info = resp?.data
    })
    await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
      $app.store.user.blockchainUserWallet = resp?.data.uid
    })
  }
})

const changeLoadingStatus = async (status: boolean) => {
  $app.store.asset.loading = status
  loading.value = status
}

const isVisibleInfo = computed(() => {
  console.log("",route.name)
  return (
    route.name === 'personal-analytics' ||
    route.name === 'personal-performance' ||
    route.name === 'personal-fund' ||
    route.name === 'personal-portfolio'
  )
})

// Payment and sockets
const centrifuge = ref(null)

const accountUuid = computed(() => {
  return $app.store.user.info?.account?.uuid
})

const infoPayment = ref(null)

const isOpenSuccessModal = ref(false)

watch(infoPayment, (value) => {
  if (value) {
    isOpenSuccessModal.value = true
  }
})

onMounted(async () => {

  const config = useRuntimeConfig()
  const centrifugeURL = config.public.WS_URL
  const centrifugeToken = config.public.WS_TOKEN
  centrifuge.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })

  centrifuge.value.connect()

  const sub = centrifuge.value.newSubscription(`replenishment.${accountUuid.value}`)

  sub
    .on('publication', async function (ctx) {
      if (ctx.data.message?.data?.status === 'success') {
        infoPayment.value = ctx.data.message?.data
      }
    })
    .subscribe()
})

onUnmounted(() => {
  centrifuge.value?.disconnect()
})
</script>

<style lang="scss">
.v-enter-active {
  transition: all 0.3s ease-out;
}

.v-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.v-enter-from,
.v-leave-to {
  transform: translateX(-100%);
}
</style>
