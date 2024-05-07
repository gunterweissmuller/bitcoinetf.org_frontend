<template>
  <div class="w-buy-shares page-max-width--big">
    <w-chart-buy-shares
      v-model="pickerValue"
      :switches="switches"
      :wallets="wallets"
      :is-apply-ref-code="refApply"
    />
    <div class="w-buy-shares__wrap">
      <div class="w-buy-shares__switches">
        <div :class="['w-buy-shares__switch', { 'w-buy-shares__switch--active': switches.referral }]">
          <div class="w-buy-shares__switch-text">
            <m-popper hover :title="referralPopper.title" :text="referralPopper.text">
              <a-icon class="w-buy-shares__switch-text-icon" :name="Icon.MonoInfo" />
            </m-popper>
            Apply referral
          </div>
          <div class="w-buy-shares__switch-button">
            <a-switch
              :disabled="!wallets?.referral?.usd_amount || wallets?.referral?.usd_amount < 1"
              v-model="switches.referral"
              :label="referralAmount"
              label-position="left"
            ></a-switch>
          </div>
        </div>
        <div :class="['w-buy-shares__switch', { 'w-buy-shares__switch--active': switches.bonus }]">
          <div class="w-buy-shares__switch-text">
            <m-popper hover :title="bonusPopper.title" :text="bonusPopper.text">
              <a-icon class="w-buy-shares__switch-text-icon" :name="Icon.MonoInfo" />
            </m-popper>
            Apply bonus
          </div>
          <div class="w-buy-shares__switch-button">
            <a-switch v-model="switches.bonus" :label="bonusAmount" label-position="left" :disabled="!wallets?.bonus?.usd_amount || wallets?.bonus?.usd_amount < 1"></a-switch>
          </div>
        </div>
        <div :class="['w-buy-shares__switch', { 'w-buy-shares__switch--active': switches.dividends }]">
          <div class="w-buy-shares__switch-text">
            <m-popper hover :title="dividendsPopper.title" :text="dividendsPopper.text">
              <a-icon class="w-buy-shares__switch-text-icon" :name="Icon.MonoInfo" />
            </m-popper>

            Apply dividends
          </div>
          <div class="w-buy-shares__switch-button">
            <a-switch v-model="switches.dividends" :label="dividendsAmount" label-position="left" :disabled="!wallets?.dividends?.usd_amount || wallets?.dividends?.usd_amount < 1"></a-switch>
          </div>
        </div>
      </div>
      <m-accordion scroll ref="accordionRef" class="w-buy-shares__ref" title="Referral code">
        <div class="w-buy-shares__ref-wrap">
          <a-input label="Referral code" class="w-buy-shares__ref-code" v-model="refCode" />
          <a-button :disabled="!refCode" v-if="!(refCode === $app.store.user.info.referrals.used_code)" class="w-buy-shares__ref-button" text="Apply" @click="checkRefCode" />
        </div>
        <div
          v-if="refCodeMessage"
          :class="['w-buy-shares__ref-message', { 'w-buy-shares__ref-message--error': refCodeError }]"
        >
          {{ refCodeMessage }}
        </div>
        <!--        <div class="w-buy-shares__ref-link" @click="isOpenModalRefer = true">Get your referral code</div>-->
      </m-accordion>
      <div class="w-buy-shares__buy">
        <div class="w-buy-shares__picker" id="buy-shares-picker">
          <button
            :disabled="+pickerValue <= 100"
            class="w-buy-shares__picker-button w-buy-shares__picker-minus"
            type="button"
          >
            <a-icon width="24" height="24" :name="Icon.MonoMinus" @click="setValuePicker(false)" />
          </button>
          <input
            :value="$app.filters.rounded(pickerValue)"
            class="w-buy-shares__picker-input"
            type="text"
            @keypress="validate"
            :max="10000000"
            @input="onPickerValueInput"
          />
          <div class="w-buy-shares__picker-circulation">
            {{ getCirculation }}
          </div>
          <button
            class="w-buy-shares__picker-button w-buy-shares__picker-plus"
            type="button"
            :disabled="+pickerValue >= 10000000"
          >
            <a-icon width="24" height="24" :name="Icon.MonoPlus" @click="setValuePicker(true)" />
          </button>
        </div>
        <a-button
          class="w-buy-shares__button"
          :text="buyButtonText"
          @click="buyShares"
          :disabled="!termsAgree || pickerValue < 100"
        />
        <div class="w-buy-shares__agree">
          <a-checkbox
            v-model="termsAgree"
            id="with_email"
            label="<p>I agree to the <span class='link'>Terms & Conditions</a></p>"
            @label-click="openTermsModal"
            single
          />
        </div>
      </div>
    </div>
  </div>
  <f-refer-friends
    class="w-aside__refer"
    :button="false"
    :show="isOpenModalRefer"
    @update="isOpenModalRefer = $event"
  />
  <f-terms-modal v-model="isOpenTermsModal" title="Purchase agreement" :download="false" />
  <!-- <w-onboarding :steps="renderedSteps" /> -->
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useNuxtApp, useRouter } from '#app'
import WChartBuyShares from '~/src/widgets/w-chart-buy-shares/w-chart-buy-shares.vue'
import ASwitch from '~/src/shared/ui/atoms/a-switch/a-switch.vue'
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import MAccordion from '~/src/shared/ui/molecules/m-accordion/m-accordion.vue'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import ACheckbox from '~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue'
import FReferFriends from '~/src/features/f-refer-friends/f-refer-friends.vue'
import MPopper from '~/src/shared/ui/molecules/m-popper/m-popper.vue'
import FTermsModal from '~/src/features/f-terms-modal/f-terms-modal.vue'
import WOnboarding from '~/src/widgets/w-onboarding/w-onboarding.vue'
import { useRoute } from '#imports'

const router = useRouter()

const switches = reactive({
  referral: false,
  bonus: false,
  dividends: false,
})

const isOpenModalRefer = ref(false)
const { $app } = useNuxtApp()

const fundTotalUsd = computed(() => {
  return $app.store.user.fundTotalUsd
})

const isOpenTermsModal = ref(false)

function openTermsModal() {
  isOpenTermsModal.value = true
}

const wallets = ref(null)
const accordionRef = ref(null)

const pickerValue = ref(100)

const referralPopper = {
  title: 'Apply referral',
  text: 'You can use your referral wallet balance towards the payment for your BitcoinETF purchase.',
}

const bonusPopper = {
  title: 'Apply bonus',
  text: 'You can use your bonus wallet balance towards the payment for your BitcoinETF purchase.',
}

const dividendsPopper = {
  title: 'Apply dividends',
  text: 'You can use your dividends wallet balance towards the payment for your BitcoinETF purchase.',
}

const onPickerValueInput = (event) => {
  const replacedStringValue = event.target.value.replace(/,/g, '')
  pickerValue.value = Number(replacedStringValue)
}

const setValuePicker = (plus: boolean = false) => {
  if (plus) {
    pickerValue.value = +pickerValue.value + 100
  } else {
    pickerValue.value = +pickerValue.value - 100

    if (+pickerValue.value < 0) {
      pickerValue.value = 0
    }
  }
}

const getCirculation = computed(() => {
  if (!fundTotalUsd.value) {
    return `${$app.filters.rounded(pickerValue.value / 8005963, 4) * 100}% of all shares issued.`
  }
  return `${$app.filters.rounded(
    (pickerValue.value / fundTotalAum.value) * 100,
    4,
  )}% of all shares issued.`
})

const fundTotalAum = computed(() => {
  return $app.store.user.fundTotalUsd
})

watch(
  () => pickerValue.value,
  (newValue) => {
    if (+newValue > 10000000) {
      pickerValue.value = 10000000
    }
  },
)
const getWallets = async () => {
  await $app.api.eth.billingEth
    .getWallets()
    .then((response: any) => {
      wallets.value = response.data
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const refCode = ref('')
const termsAgree = ref(false)
const discountPercent = $app.store.user.statistic?.trc_bonus?.percent ? $app.store.user.statistic?.trc_bonus?.percent : 5;

const buyButtonText = computed(() => {
  if (!termsAgree.value) return 'Agree to the Terms'
  let sum = pickerValue.value
  if (switches.bonus) {
    sum -= wallets.value?.bonus?.usd_amount
  }

  if (switches.dividends) {
    sum -= wallets.value?.dividends?.usd_amount
  }

  if (switches.referral) {
    sum -= wallets.value?.referral?.usd_amount
  }


  // return pickerValue.value < 100 ? 'Minimum 100 Shares' : `$${$app.filters.rounded(sum - (sum/100)*discountPercent)} BUY`
  return pickerValue.value < 100 ? 'Minimum 100 Shares' : `$${$app.filters.rounded(sum)} BUY`
})

const referralAmount = computed(() => {
  return `$${$app.filters.rounded(wallets.value?.referral?.usd_amount, 2) || 0}`
})
const bonusAmount = computed(() => {
  return `$${$app.filters.rounded(wallets.value?.bonus?.usd_amount, 2) || 0}`
})
const dividendsAmount = computed(() => {
  return `$${$app.filters.rounded(wallets.value?.dividends?.usd_amount, 2) || 0}`
})

const buyShares = () => {
  let sum = pickerValue.value
  if (switches.bonus) {
    sum -= wallets.value?.bonus?.usd_amount
  }

  if (switches.dividends) {
    sum -= wallets.value?.dividends?.usd_amount
  }

  if (switches.referral) {
    sum -= wallets.value?.referral?.usd_amount
  }

  $app.api.eth.billingEth
    .buyShares({
      amount: sum,
      dividends: switches.dividends,
      referral: switches.referral,
      bonus: switches.bonus,
      // refCode: refCode.value
    })
    .then(({ data }) => {
      if (data) {
        router.push({
          name: 'personal-buy-shares-payment',
          query: { replenishment: data.uuid }
        })
        $app.store.user.buyShares = data
      }
    })
    .catch((e) => {
      if (e?.errors?.error?.code === 'ETF:040001' && $app.store.user.buyShares) {
        router.push({
          name: 'personal-buy-shares-payment',
        })
      }
      console.error(e)
    })
}

function validate(event) {
  if (event.keyCode < 48 || event.keyCode > 57) event.returnValue = false
}

const refCodeMessage = ref('')
const refCodeError = ref(false)
const refApply = ref(!!$app.store.user?.info?.referrals?.used_code)

const checkRefCode = async () => {
  if ($app.store.user.info.referrals.used_code === null) {
    await $app.api.eth.referral
      .checkReferralCode(refCode.value)
      .then(() => {
        refCodeError.value = false
        refCodeMessage.value = 'Referral code applied'
        refApply.value = true
        $app.store.user.info.referrals.used_code = refCode.value
      })
      .catch((e) => {
        refCodeError.value = true
        if (e?.errors?.error?.message) {
          refCodeMessage.value = e.errors.error.message
        } else {
          refCodeMessage.value = 'Something went wrong'
        }
      })
  } else {
    await $app.api.eth.referral
      .checkValidationCode(refCode.value)
  }
}

watch(refCode, (value) => {
  refCodeMessage.value = ''
  if (value) {
    accordionRef.value.open()
  }
})


// Onboarding
const { width } = useWindowSize()


const journeySteps = computed(() => {
  return [
    {
      isRender: true,
      attachTo: { element: '#buy-shares-picker' },
      content: {
        title: 'Buy Shares',
        description:
          'Choose the number of shares you want. See both your estimated daily Dividends and the total expected return!',
      },
      options: {
        overlay: {
          padding: 10,
          borderRadius: 16,
        },
        popper: {
          placement: width.value < 1024 ? 'top' : 'bottom',
        },
      },
      on: {
        beforeStep: async function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.add('onboarding-index')

          // const elem1 = document.querySelector('.w-buy-shares__buy')
          // elem1?.classList.add('onboarding-padding')
        },
        afterStep: function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.remove('onboarding-index')

          // const elem1 = document.querySelector('.w-buy-shares__buy')
          // elem1?.classList.remove('onboarding-padding')
        },
      },
    },
  ]
})

const steps = computed(() => {
  return [
    {
      isRender: true,
      attachTo: { element: '#buy-shares-picker' },
      content: {
        title: 'Buy Shares',
        description:
          'Choose the number of shares you want. See both your estimated daily Dividends and the total expected return!',
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

          // const elem1 = document.querySelector('.w-buy-shares__buy')
          // elem1?.classList.add('onboarding-padding')
        },
        afterStep: function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.remove('onboarding-index')

          // const elem1 = document.querySelector('.w-buy-shares__buy')
          // elem1?.classList.remove('onboarding-padding')
        },
      },
    },
    {
      isRender: true,
      attachTo: { element: '#buy-shares-daily' },
      content: {
        title: 'Daily Returns',
        description: 'Estimate your daily Dividends.',
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
      isRender: true,
      attachTo: { element: '#buy-shares-total' },
      content: {
        title: 'Investment Return',
        description: 'By the end of the investment period, this is what you stand to gain',
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
  ]
})

const renderedSteps = computed(() => {
  const journey = localStorage.getItem('journey')

  if (!journey) {
    return journeySteps.value.filter((step) => step.isRender !== false)
  }

  return steps.value.filter((step) => step.isRender !== false)
})

watch(
  () => switches.bonus,
  (value) => {
    if (value) {
      pickerValue.value += wallets.value?.bonus?.usd_amount
    } else {
      pickerValue.value -= wallets.value?.bonus?.usd_amount
    }
  },
)

watch(
  () => switches.dividends,
  (value) => {
    if (value) {
      pickerValue.value += wallets.value?.dividends?.usd_amount
    } else {
      pickerValue.value -= wallets.value?.dividends?.usd_amount
    }
  },
)

watch(
  () => switches.referral,
  (value) => {
    if (value) {
      pickerValue.value += wallets.value?.referral?.usd_amount
    } else {
      pickerValue.value -= wallets.value?.referral?.usd_amount
    }
  },
)

const getGlobalStats = async () => {
  await $app.api.eth.statisticEth
    .getGlobalStats()
    .then((resp) => {
      $app.store.user.statistic = resp?.data
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

onMounted(async () => {
  refCode.value = $app.store.user?.info?.referrals?.used_code || ''
  await getWallets()
  await getGlobalStats()
  if ($app.store.user.routeFrom === 'personal-dividends') {
    if (wallets.value?.bonus?.usd_amount) {
      switches.bonus = true
    }

    if (wallets.value?.dividends?.usd_amount) {
      switches.dividends = true
    }

    if (wallets.value?.referral?.usd_amount) {
      switches.referral = true
    }
  }
})

</script>

<style src="./w-buy-shares.scss" lang="scss" />
