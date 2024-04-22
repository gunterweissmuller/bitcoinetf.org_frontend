import { Centrifuge } from 'centrifuge'
import { ref, computed } from 'vue'

export function useConnectReplenishmentChannel($app) {
  const centrifuge = ref<Centrifuge | null>(null)

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

  function connectToReplenishment() {
    const config = useRuntimeConfig()
    const centrifugeURL = config.public.WS_URL
    const centrifugeToken = config.public.WS_TOKEN
    centrifuge.value = new Centrifuge(centrifugeURL, {
      token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken,
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
  }
  return {connectToReplenishment}
}
