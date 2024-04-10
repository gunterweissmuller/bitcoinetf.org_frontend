<template>
  <div class="w-referrals">
    <div class="w-referrals__wrap">
      <div class="w-referrals__amount">
        <div class="w-referrals__amount-sum">
          <div class="w-referrals__amount-title">Total Balance</div>
          <div class="w-referrals__amount-text">${{ $app.filters.rounded(walletReferrals.usd_amount, 2) }}</div>
        </div>
        <a-button
          class="w-referrals__amount-withdraw"
          variant="secondary"
          text="Withdraw"
          :disabled="!walletReferrals?.usd_amount"
          :icon="Icon.MonoWithdraw"
          @click="openModal"
        />
      </div>
      <button @click="openShareModal" class="w-referrals__invite" type="button">
        <div class="w-referrals__invite-info">
          <div class="w-referrals__invite-info-title">Earn from referrals 💸</div>
          <div class="w-referrals__invite-info-text">Invite your friends and family to earn referral rewards!</div>
        </div>
        <a-icon width="18" height="18" class="w-referrals__invite-chevron" :name="Icon.MonoChevronRight" />
      </button>
      <div class="w-referrals__subtitle">Transactions</div>
      <div v-if="personalReferrals.length" class="w-referrals__list">
        <transition-group name="fade" tag="div">
          <div v-for="item in personalReferrals" :key="item?.uuid" class="w-referrals__item">
            <div class="w-referrals__item-pic" :class="['w-referrals__item-pic', { 'w-referrals__item-pic--minus': item.type !== 'debit_to_client' }]">
              <a-icon width="18" height="18" :name="item.type === 'debit_to_client' ? Icon.MonoPlus : Icon.MonoMinus"
              />
            </div>
            <div class="w-referrals__item_info">
              <div class="w-referrals__item_info-title">Referral</div>
              <div class="w-referrals__item_info-date">
                {{ $app.filters.dayjs(item?.created_at)?.format('D MMMM YY HH:mm:ss') }}
              </div>
            </div>
            <div v-if="item.status === 'pending'" class="w-referrals__item_sums">Pending</div>
            <div v-else class="w-referrals__item_sums">
              <div class="w-referrals__item_info-usd">{{item.type === 'debit_to_client' ? '+' : '-'}} ${{ $app.filters.rounded(item?.usd_amount, 2) }}</div>
            </div>
          </div>
        </transition-group>
      </div>
      <div v-if="personalReferrals.length && hasNextPage" class="w-referrals__more">
        <div @click="loadMoreReferrals" class="w-referrals__more-text">Load more</div>
      </div>
      <div v-if="!personalReferrals.length" class="w-referrals__empty">
        <img class="w-referrals__empty-pic" src="/img/cloud.png" alt="empty" />
        <div class="w-referrals__empty-title">You don’t have any transactions yet.</div>
        <div class="w-referrals__empty-text">
          Invite your friends using your <span @click="openShareModal">Referral code.</span>
        </div>
      </div>
    </div>
  </div>
  <e-referral-share-modal v-model="isOpenShareModal" />
  <f-referrals-modal :address="address" :method="method" v-model="isOpenModal" @accept="setMethod" />
  <w-onboarding :steps="renderedSteps" next-route-name="personal-bonus" />
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import FReferralsModal from '~/src/features/f-referrals-modal/f-referrals-modal.vue'
import EReferralShareModal from '~/src/entities/e-referral-share-modal/e-referral-share-modal.vue'
import { Centrifuge } from 'centrifuge'
import { onUnmounted } from 'vue'
import WOnboarding from '~/src/widgets/w-onboarding/w-onboarding.vue'

const isOpenModal = ref(false)
const isOpenShareModal = ref(false)

const checkKyc = async () => {
  return await $app.api.eth.kyc.getForms().then((formsResponse: any) => {
    return formsResponse.data[0].status === 'passed'
  })
}
const openModal = async () => {
  const isKycFinished = await checkKyc()

  if (isKycFinished) {
    isOpenModal.value = true
  } else {
    navigateTo({ name: 'personal-kyc' })
  }
}

const route = useRoute()

const openShareModal = () => {
  isOpenShareModal.value = true
}

const { $app } = useNuxtApp()
const centrifuge = ref(null)

const walletReferrals = ref([])
const personalReferrals = ref([])
const currentPage = ref(1)
const hasNextPage = ref(true)
const transactionsKey = ref(0)

const method = ref('')
const address = ref('')
const setMethodError = ref('')

const setMethod = () => {
  setTimeout(async ()=>{
    await getWalletReferrals()
  }, 2000)
}

const typeWorkMethod = computed(() => {
  return 'Manual'
})

const typeMethodIcon = computed(() => {
  if (method.value === 'polygon_usdt') {
    return Icon.ColorfulUsdt
  }

  return method.value === 'tron' ? Icon.ColorfulTron : Icon.ColorfulUsdant
})

const typeMethodText = computed(() => {
  if (method.value === 'polygon_usdt') {
    return 'Polygon'
  }

  return method.value === 'tron' ? 'Tron' : 'USDANT'
})

const selectedAddressShort = computed(() => {
  if (!address.value) return ''
  if (address.value?.length <= 5) return address.value
  return address.value.slice(0, 5) + '...' + address.value.slice(address.value.length - 4)
})

const getWalletReferrals = async () => {
  await $app.api.eth.billingEth
    .getWallet({ type: 'referral' })
    .then((response: any) => {
      walletReferrals.value = response.data
      $app.store.user.walletReferral = response.data
      address.value = response.data?.withdrawal_address || ''
      method.value = 'polygon_usdt'
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const getPersonalReferrals = async (initial) => {
  if (initial) {
    currentPage.value = 1
  }
  await $app.api.eth.billingEth
    .getTransactions({
      page: currentPage.value,
      per_page: 4,
      type: 'referral',
    })
    .then((response: any) => {
      if (initial) {
        personalReferrals.value = []
      }
      hasNextPage.value = !!response.data.next_page_url
      personalReferrals.value = [...personalReferrals.value, ...response.data.data]

      transactionsKey.value += 1
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const withdrawalReferrals = async () => {
  $app.api.eth.billingEth
    .withdrawalReferrals()
    .then(() => {
      getWalletReferrals()
    })
    .catch((e) => {
      console.error(e.errors)
    })
}

const loadMoreReferrals = async () => {
  currentPage.value += 1
  await getPersonalReferrals()
}
const config = useRuntimeConfig()
const centrifugeURL = config.public.WS_URL
const centrifugeToken = config.public.WS_TOKEN

onMounted(async () => {
  await getWalletReferrals()
  await getPersonalReferrals()

  centrifuge.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })

  centrifuge.value.connect()

  const sub = centrifuge.value.newSubscription(`wallet.${$app.store.user.info?.account?.uuid}`)

  sub
    .on('publication', async function (ctx) {
      if (ctx.data.message.status === 'success') {
        await getPersonalReferrals(true)
      } else if (ctx.data.message.status === 'pending') {
        personalReferrals.value = [ctx.data.message, ...personalReferrals.value]
      }
    })
    .subscribe()
})

onUnmounted(() => {
  centrifuge.value?.disconnect()
})

// Onboarding
const { width } = useWindowSize()

const steps = computed(() => {
  return [
    {
      attachTo: { element: width.value < 1024 ? '#personal-referrals-tab-mobile' : '#personal-referrals-tab' },
      content: {
        title: 'Referral Wallet',
        description:
          'Earn here when friends join BitcoinETF.org through your referral. Withdraw or reinvest to amplify your Dividends.',
      },
      options: {
        overlay: {
          padding: 16,
          borderRadius: 16,
        },
      },
      on: {
        beforeStep: async function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.add('onboarding-index')
        },
        afterStep: function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.remove('onboarding-index')
        },
      },
    },
  ]
})

const renderedSteps = computed(() => {
  return steps.value.filter((step) => step.isRender !== false)
})
</script>

<style src="./w-referrals.scss" lang="scss" />
