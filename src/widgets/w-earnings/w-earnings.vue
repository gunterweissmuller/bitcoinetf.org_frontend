<template>
  <div v-if="!isEmpty(lastPayment)" class="w-earnings page-max-width--small">
    <w-chart-earnings :earnings="lastPayment" :apy="paymentStatistic?.dividends"/>
    <w-chart-dividends
      :dateWithThreeYears="$app.filters.dayjs($app.store.user.lastPayment.created_at).add(3, 'year').add(1,'day').format('DD MMM YYYY')"
      :statistic="paymentStatistic?.statistic"
      :dividends="paymentStatistic?.dividends"
      :wallet="wallet"
      :personalDividends="personalDividends"
    />
    <e-stats-apy :apy="paymentStatistic?.dividends"/>
    <e-stats-protection :statistic="vault" :vault="transactions"/>
  </div>
  <e-earnings-empty v-else/>
  <w-onboarding :steps="renderedSteps" next-route-name="personal-wallet"/>
</template>

<script setup lang="ts">
import WChartEarnings from '~/src/widgets/w-chart-earmings/w-chart-earnings.vue'
import WChartDividends from '~/src/widgets/w-chart-dividends/w-chart-dividends.vue'
import EStatsApy from '~/src/entities/e-stats-apy/e-stats-apy.vue'
import EStatsProtection from '~/src/entities/e-stats-protection/e-stats-protection.vue'
import {useNuxtApp} from '#app'

const {$app} = useNuxtApp()
const transactions = ref(null)
const transactionsDividends = ref([])
const wallet = ref(null)
import {RECEIVED_VARIANTS_STATS} from '~/src/shared/constants/global'
import EEarningsEmpty from '~/src/entities/e-earnings-empty/e-earnings-empty.vue'
import { onUnmounted, ref } from 'vue'
import EEarningProcessing from '~/src/entities/e-earning-processing/e-earning-processing.vue'
import EProcessingPayment from '~/src/entities/e-processing-payment/e-processing-payment.vue'
import WOnboarding from '~/src/widgets/w-onboarding/w-onboarding.vue'
import {isEmpty} from "lodash";

const lastPayment = computed(() => {
  return $app.store.user.lastPayment
});

// onMounted(() => {
//   $app.api.eth.billingEth
//   .getLastPayment()
//   .then((response: any) => {
//
//     $app.store.user.lastPayment = response.data
//   })
//   .catch(() => {
//     // Todo: notify something went wrond
//   })
// })

const paymentStatistic = computed(() => {
  const paymentStatisticIntro = $app.filters.cloneDeep(paymentStatisticInfo.value)
  if (paymentStatisticIntro?.statistic) {
    paymentStatisticIntro.statistic = {
      ...paymentStatisticInfo.value?.statistic,
      [RECEIVED_VARIANTS_STATS.BASIS.value]: {
        usd: paymentStatisticIntro?.statistic?.received_dividends_usd,
        btc: paymentStatisticIntro?.statistic?.received_dividends_usd / paymentStatisticIntro?.statistic?.btc_price,
      },
      [RECEIVED_VARIANTS_STATS.ACTUAL.value]: {
        usd: paymentStatisticIntro?.statistic?.received_dividends_btc * paymentStatisticIntro?.statistic?.btc_price,
        btc: paymentStatisticIntro?.statistic?.received_dividends_btc,
      },
      received_variant:
        paymentStatisticIntro?.statistic?.received_dividends_usd >
        paymentStatisticIntro?.statistic?.received_dividends_btc * paymentStatisticIntro?.statistic?.btc_price
          ? RECEIVED_VARIANTS_STATS.BASIS.value
          : RECEIVED_VARIANTS_STATS.ACTUAL.value,
    }
  }

  return paymentStatisticIntro
})

const personalDividends = computed(() => {
  let personalDividends = transactionsDividends.value
  if (personalDividends.length) {
    if (personalDividends.length >= 4) {
      personalDividends.pop()
    }

    personalDividends = personalDividends.map((item) => ({
      date: $app.filters.dayjs(item.created_at).format('D MMM YY'),
      time: $app.filters.dayjs(item.created_at).format('mm:ss'),
      btc: $app.filters.convertValue($app.filters.rounded(item.btc_amount, 8)),
      usd: `$${$app.filters.rounded(item.usd_amount, 8)}`,
      type: item.type
    }))
  }

  return personalDividends
})

const getTransactions = async () => {
  await $app.api.eth.billingEth
    .getTransactions({type: 'vault', per_page: 4})
    .then((response: any) => {
      transactions.value = response.data.data
      if (transactions.value?.length) {
        if (transactions.value?.length >= 4) {
          transactions.value.pop()
        }
        transactions.value = transactions.value.map((item) => ({
          date: $app.filters.dayjs(item.created_at).format('D MMM YY'),
          time: $app.filters.dayjs(item.created_at).format('mm:ss'),
          btc: $app.filters.convertValue($app.filters.rounded(item.btc_amount, 8)),
          usd: `$${$app.filters.rounded(item.usd_amount, 2)}`,
        }))
      }
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const getTransactionsDividends = async () => {
  await $app.api.eth.billingEth
    .getTransactions({type: 'dividends', per_page: 4})
    .then((response: any) => {
      transactionsDividends.value = response.data.data || []
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const getWallet = async () => {
  await $app.api.eth.billingEth
    .getWallet({type: 'dividends'})
    .then((response: any) => {
      wallet.value = response.data
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

// Onboarding
const {width} = useWindowSize()

const journeySteps = computed(() => {
  return [
    {
      attachTo: {element: width.value < 1024 ? '#menu-personal-earnings-bottom' : '#menu-personal-earnings'},
      content: {title: 'Dividends', description: 'Your personal Dividends dashboard.'},
      options: {
        overlay: {
          padding: 10,
          borderRadius: 40,
        },
        popper: {
          placement: width.value < 1024 ? 'top' : 'bottom',
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

const steps = computed(() => {
  return [
    {
      attachTo: {element: '#chart--earnings'},
      content: {
        title: 'Projection',
        description: "Find out your expected Dividends at the investment period's end.",
      },
      options: {
        overlay: {
          padding: 10,
          borderRadius: 16,
        },
        popper: {
          placement: 'bottom',
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
    {
      attachTo: {element: '#chart-earnings-view'},
      content: {
        title: 'Verification',
        description: 'View your shares on the blockchain.',
      },
      options: {
        overlay: {
          padding: 10,
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
    {
      attachTo: {element: '#chart--dividends'},
      content: {
        title: 'Dividends',
        description: 'Your latest daily dividend updates.',
      },
      options: {
        overlay: {
          padding: 10,
          borderRadius: 16,
        },
        popper: {
          placement: 'bottom',
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
    {
      attachTo: {element: '#e-stat-statements'},
      content: {
        title: 'Financial Records',
        description: 'Download your statements. These have QR codes for easy income verification.',
      },
      options: {
        overlay: {
          padding: 10,
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
    {
      attachTo: {element: '#e-stat-vault'},
      content: {
        title: 'Protection Vault',
        description:
          "This is your safety net. If the fund doesn't meet our promised APY, you can still withdraw from this vault, ensuring you earn regardless of market dynamics.",
      },
      options: {
        overlay: {
          padding: 10,
          borderRadius: 16,
        },
        popper: {
          // Todo: подумать над другим решением
          placement: 'bottom',
        },
      },
      on: {
        beforeStep: async function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.add('onboarding-index')

          // Todo: подумать над другим решением
          const elem1 = document.querySelector('.e-stats-protection')
          elem1?.classList.add('onboarding-padding')
        },
        afterStep: function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.remove('onboarding-index')

          const elem1 = document.querySelector('.e-stats-protection')
          elem1?.classList.remove('onboarding-padding')
        },
      },
    },
  ]
})

const renderedSteps = computed(() => {
  const journey = localStorage.getItem('journey')

  if (!journey) {
    return journeySteps.value.filter((step) => step.isRender !== false)
  }

  return steps.value.filter((step) => step.isRender !== false)
})

const vault = ref(null)

const getVault = async () => {
  await $app.api.eth.billingEth
    .getWallet({type: 'vault'})
    .then((response: any) => {
      vault.value = response.data
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const paymentStatisticInfo = ref(null)

const getPaymentStatistic = async () => {
  await $app.api.eth.billingEth
    .getPaymentStatistic()
    .then((response: any) => {
      paymentStatisticInfo.value = response.data
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

onMounted(async () => {
  await getPaymentStatistic()
  await getTransactionsDividends()
  await getTransactions()
  await getWallet()
  await getVault()
})

</script>

<style src="./w-earnings.scss" lang="scss"/>
