<template>
  <div class="w-wallet page-max-width--big">
    <div class="w-wallet__box">
      <!-- <e-send-to-buy-shares :active-component="activeComponent?.id" /> -->
      <div class="w-wallet__box-main">
        <keep-alive :key="activeComponent.id">
          <component
            v-if="activeComponent?.component"
            :is="activeComponent?.component"
            :key="`active-tab-route-${route.name}`"
          />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import ESendToBuyShares from '~/src/entities/e-send-to-buy-shares/e-send-to-buy-shares.vue'

const route = useRoute()

interface ITabsItem {
  text: string
  name: string
}

const tabsList = ref<ITabsItem[]>([
  { text: 'Dividends', name: 'personal-dividends' },
  { text: 'Referrals', name: 'personal-referrals' },
])

const activeTab = ref<string>('dividends')

const dividends = defineAsyncComponent(() => import('~/src/widgets/w-dividends/w-dividends.vue'))
const referrals = defineAsyncComponent(() => import('~/src/widgets/w-referrals/w-referrals.vue'))
const bonus = defineAsyncComponent(() => import('~/src/widgets/w-bonus/w-bonus.vue'))
const etfs = defineAsyncComponent(() => import('~/src/widgets/w-etfs/w-etfs.vue'))

const components = {
  'personal-dividends': { component: dividends, id: 'personal-dividends' },
  'personal-etfs': { component: etfs, id: 'personal-etfs' },
}

const activeComponent = computed(() => components?.[route?.name])

// Onboarding
// const { width } = useWindowSize()
//
// const steps = computed(() => {
//   return [
//     {
//       attachTo: { element: width.value < 1024 ? '#menu-personal-dividends-bottom' : '#menu-personal-dividends' },
//       content: { title: 'Wallet', description: 'With BitcoinETF, manage three distinct digital wallets.' },
//       options: {
//         overlay: {
//           padding: 10,
//           borderRadius: 40,
//         },
//         popper: {
//           placement: width.value < 1024 ? 'top' : 'bottom',
//         },
//       },
//       on: {
//         beforeStep: async function (options) {
//           const elem = document.querySelector(options.step.attachTo.element)
//           elem?.classList.add('onboarding-index')
//         },
//         afterStep: async function (options) {
//           const elem = document.querySelector(options.step.attachTo.element)
//           elem?.classList.remove('onboarding-index')
//         },
//       },
//     },
//     {
//       attachTo: { element: width.value < 1024 ? '#personal-dividends-tab-mobile' : '#personal-dividends-tab' },
//       content: {
//         title: 'Dividends Wallet',
//         description:
//           "This is your daily dividend destination, paid in Bitcoin. Convert to cash or retain as Bitcoin – we'll guide you through either choice.",
//       },
//       options: {
//         overlay: {
//           padding: 16,
//           borderRadius: 16,
//         },
//       },
//       on: {
//         beforeStep: async function (options) {
//           const elem = document.querySelector(options.step.attachTo.element)
//           elem?.classList.add('onboarding-index')
//         },
//         afterStep: function (options) {
//           const elem = document.querySelector(options.step.attachTo.element)
//           elem?.classList.remove('onboarding-index')
//         },
//       },
//     },
//     {
//       attachTo: { element: width.value < 1024 ? '#personal-referrals-tab-mobile' : '#personal-referrals-tab' },
//       content: {
//         title: 'Referral Wallet',
//         description:
//           'Earn here when friends join BitcoinETF.org through your referral. Withdraw or reinvest to amplify your Dividends.',
//       },
//       options: {
//         overlay: {
//           padding: 16,
//           borderRadius: 16,
//         },
//       },
//       on: {
//         beforeStep: async function (options) {
//           const elem = document.querySelector(options.step.attachTo.element)
//           elem?.classList.add('onboarding-index')
//         },
//         afterStep: function (options) {
//           const elem = document.querySelector(options.step.attachTo.element)
//           elem?.classList.remove('onboarding-index')
//         },
//       },
//     },
//     {
//       attachTo: { element: width.value < 1024 ? '#personal-bonus-tab-mobile' : '#personal-bonus-tab' },
//       content: {
//         title: 'Bonus Wallet',
//         description: 'Check out your sign-up bonus dollars here.',
//       },
//       options: {
//         overlay: {
//           padding: 16,
//           borderRadius: 16,
//         },
//       },
//       on: {
//         beforeStep: async function (options) {
//           const elem = document.querySelector(options.step.attachTo.element)
//           elem?.classList.add('onboarding-index')
//         },
//         afterStep: async function (options) {
//           const elem = document.querySelector(options.step.attachTo.element)
//           elem?.classList.remove('onboarding-index')
//         },
//       },
//     },
//   ]
// })
//
// const renderedSteps = computed(() => {
//   return steps.value.filter((step) => step.isRender !== false)
// })
</script>

<style src="./w-wallet.scss" lang="scss" />
