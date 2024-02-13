<template>
  <div class="w-bonus">
    <div class="w-bonus__wrap">
      <div class="w-bonus__amount">
        <h4 class="w-bonus__amount-title">Total Balance</h4>
        <div class="w-bonus__amount-sum">${{ $app.filters.rounded(walletBonus.usd_amount, 8) }}</div>
      </div>
      <div class="w-bonus__subtitle">Transactions</div>
      <div v-if="personalBonus.length" class="w-bonus__list">
        <transition-group name="fade" tag="div">
          <div v-for="item in personalBonus" :key="item?.uuid" class="w-bonus__item">
            <div :class="['w-bonus__item-pic', { 'w-bonus__item-pic--minus': item.type !== 'debit_to_client' }]">
              <a-icon width="18" height="18" :name="item.type === 'debit_to_client' ? Icon.MonoPlus : Icon.MonoMinus" />
            </div>
            <div class="w-bonus__item_info">
              <div class="w-bonus__item_info-title">{{ getDescBonus(item) }}</div>
              <div class="w-bonus__item_info-date">{{ $app.filters.dayjs(item?.created_at)?.format('D MMMM YY') }}</div>
            </div>
            <div class="w-bonus__item_sums">
              <div class="w-bonus__item_info-usd">{{item.type === 'debit_to_client' ? '+' : '-'}} ${{ $app.filters.rounded(item?.usd_amount, 2) }}</div>
            </div>
          </div>
        </transition-group>
      </div>
      <div v-if="personalBonus.length && hasNextPage" class="w-bonus__more">
        <div @click="loadMoreReferrals" class="w-bonus__more-text">Load more</div>
      </div>

      <div v-if="!personalBonus.length" class="w-bonus__empty">
        <img class="w-bonus__empty-pic" src="/img/cloud.png" alt="empty" />
        <div class="w-bonus__empty-title">You don’t have any transactions yet.</div>
        <div class="w-bonus__empty-text">
          Invite your friends using your <span @click="openRefModal" class="w-bonus__empty-link">Referral code.</span>
        </div>
      </div>
    </div>
  </div>
  <e-referral-share-modal v-model="isOpenRefModal" />
  <w-onboarding :steps="renderedSteps" next-route-name="personal-buy-shares" />
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import EReferralShareModal from '~/src/entities/e-referral-share-modal/e-referral-share-modal.vue'
import WOnboarding from '~/src/widgets/w-onboarding/w-onboarding.vue'

const { $app } = useNuxtApp()

const walletBonus = ref([])
const personalBonus = ref([])
const currentPage = ref(1)
const hasNextPage = ref(true)

const isOpenRefModal = ref(false)

const openRefModal = () => {
  isOpenRefModal.value = true
}

const getDescBonus = (item) => {
  switch (item?.desc_type) {
    case 'welcome_bonus': {
      return '🎉 Welcome bonus'
    }
    case 'welcome_bonus_ref': {
      return 'Referral bonus'
    }
    case 'kyc_bonus': {
      return 'Bonus for completing KYC'
    }
    case 'russia_bonus': {
      return 'Эксклюзивный бонус для России'
    }
    default:
      return 'Bonus'
  }
}

const getWalletBonus = async () => {
  await $app.api.eth.billingEth
    .getWallet({ type: 'bonus' })
    .then((response: any) => {
      walletBonus.value = response.data
      $app.store.user.walletBonus = response.data
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const getPersonalBonus = async () => {
  await $app.api.eth.billingEth
    .getTransactions({
      page: currentPage.value,
      per_page: 4,
      type: 'bonus',
    })
    .then((response: any) => {
      hasNextPage.value = !!response.data.next_page_url
      personalBonus.value = [...personalBonus.value, ...response.data.data]
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const loadMoreBonus = async () => {
  currentPage.value += 1
  await getPersonalBonus()
}

onMounted(async () => {
  await getWalletBonus()
  await getPersonalBonus()
})

// Onboarding
const { width } = useWindowSize()

const steps = computed(() => {
  return [
    {
      attachTo: { element: width.value < 1024 ? '#personal-bonus-tab-mobile' : '#personal-bonus-tab' },
      content: {
        title: 'Bonus Wallet',
        description: 'Check out your sign-up bonus dollars here.',
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
        afterStep: async function (options) {
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

<style src="./w-bonus.scss" lang="scss" />
