<template>
  <div class="m-profit-calculator__start">
    <nuxt-link to='/tetherspecial' class="m-profit-calculator__label" v-if="visibleTronLabel">
      <a-icon :name="Icon.ColorfulUsdttron"/>
      <div>PAY WITH <br>TETHER AND GET <br>A <span>{{ $app.store.user.statistic?.trc_bonus?.percent }}% BONUS!</span></div>
    </nuxt-link>
    <div class="m-profit-calculator__start-top">
      <div class="m-profit-calculator__start__title">
        Profit Calculator
      </div>
      <div class="m-profit-calculator__top-items">
        <div class="m-profit-calculator__top-item">
          <div class="m-profit-calculator__top-subtitle">Daily Dividends</div>
          <div class="m-profit-calculator__top-title">${{ $app.filters.rounded(dayliDivs, 1) }}</div>
          <div class="m-profit-calculator__top-text">{{ typeAPY }}</div>
        </div>
        <div class="m-profit-calculator__top-item">
          <div class="m-profit-calculator__top-subtitle">Monthly Dividends</div>
          <div class="m-profit-calculator__top-title">${{ $app.filters.rounded(dayliDivs * 31, 1) }}</div>
          <div class="m-profit-calculator__top-text">{{ typeAPY }}</div>
        </div>
        <div class="m-profit-calculator__top-item">
          <div class="m-profit-calculator__top-subtitle">Instant Bonus</div>
          <div class="m-profit-calculator__top-title">${{ $app.filters.rounded(pickerValue * ($app.store.user.statistic?.trc_bonus?.percent / 100), 2) }}</div>
        </div>
        <div class="m-profit-calculator__top-item">
          <div class="m-profit-calculator__top-subtitle">Total Payout</div>
          <div class="m-profit-calculator__top-title">${{ $app.filters.rounded(pickerValue + guaranteedPayout * 3, 1) }}</div>
          <div class="m-profit-calculator__top-text">{{ typeAPY }}</div>
        </div>
      </div>
    </div>
    <div
      class="m-profit-calculator__guaranty"
      @mousedown="changeApy(true)"
      @mouseup="changeApy(false)"
      @touchstart="changeApy(true)"
      @touchend="changeApy(false)"
      :class="apyClassAdd === true ? 'm-profit-calculator__guaranty--focus' : ''"
    >
      <div class="m-profit-calculator__guaranty-icon">
        <a-icon :name="Icon.MonoInfo" />
      </div>
      <div class="m-profit-calculator__guaranty-text">Guaranteed APY</div>
    </div>
    <div class="m-profit-calculator__shares">
      <div class="m-profit-calculator__buy">
        <div class="m-profit-calculator__picker" :class="[{'m-profit-calculator__picker--fiat': isFiat}]">
          <button
            :disabled="isFiatDisableBuy"
            class="m-profit-calculator__picker-button m-profit-calculator__picker-minus"
            type="button"
          >
            <a-icon width="24" height="24" :name="Icon.MonoMinus" @click="setValuePicker(false)" />
          </button>
          <input
            :value="`$${$app.filters.rounded(pickerValue)}`"
            class="m-profit-calculator__picker-input"
            type="text"
            @keypress="validate"
            :min="1"
            :max="10000000"
            @input="onPickerValueInput"
          />
          <div class="m-profit-calculator__picker-input--shares">{{ $app.filters.rounded(pickerValue) }} Shares</div>
          <button
            class="m-profit-calculator__picker-button m-profit-calculator__picker-plus"
            type="button"
            :disabled="+pickerValue >= 10000000"
          >
            <a-icon width="24" height="24" :name="Icon.MonoPlus" @click="setValuePicker(true)" />
          </button>
        </div>
      </div>
      <div class="m-profit-calculator__shares-texts" v-if="!isFiat">
        <div class="m-profit-calculator__shares-text">Min. {{ isFiat ? '1,000' : '100' }} Shares.</div>
        <div class="m-profit-calculator__shares-text">Price per share: $1.00</div>
      </div>
    </div>
    <div class="m-profit-calculator__start-input">
      <div class="m-profit-calculator__start-input--wrapper">
        <a-input v-model="refCode" label="Referral code" @update:model-value="checkPromocode()" />
        <div class="m-profit-calculator__start-input--percents" v-if="refCodeValid">
          {{ refApplyed }}
        </div>
      </div>
      <div class="m-profit-calculator__start-label">
        {{
          refCodeValid && typeAPY === 'Guaranteed'
            ? `*Special elevated promotional rate of ${apyValueComputed}% applied for the first 6 months of the investment period. Interest rate guarantee goes back to the standard ${
              apyValueComputed - 5
            }% for the rest of the period.`
            : 'Enter your referral code to view your special APY rate.'
        }}
      </div>
      <div class="m-profit-calculator__start-fiat" v-if="isFiat">
        Max $1000, if you wish to purchase more <nuxt-link to="/tetherspecial">use USDT.</nuxt-link>
      </div>
    </div>
    <div class="m-profit-calculator__start-bottom" v-if="!hiddenBottomButton">
      <nuxt-link to="/tetherspecial">
        <a-button text="Buy Bitcoin ETF" />
      </nuxt-link>
      <div class="m-profit-calculator__start-label m-profit-calculator__start-label--bottom">Term: 1095 days.</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Icon} from "~/src/shared/constants/icons";
import AButton from "~/src/shared/ui/atoms/a-button/a-button.vue";
import AIcon from "~/src/shared/ui/atoms/a-icon/a-icon.vue";
import AInput from "~/src/shared/ui/atoms/a-input/a-input.vue";
import {computed, ref, watch} from "vue";
import {useNuxtApp} from "#app";
const { $app } = useNuxtApp()
const emit = defineEmits(['calculator-amount','refCode'])

const props = defineProps({
  hiddenBottomButton: {
    type: Boolean,
    default: false,
  },
  visibleTronLabel: {
    type: Boolean,
    default: true,
  },
  isFiat: {
    type: Boolean,
    default: false,
  },
})
let apyValue = ref(33)
const pickerValue = ref(100)
const refCode = ref('')
const refCodeValid = ref(false)

const apyValueComputed = computed(() => {
  return refCodeValid.value === true && typeAPY.value === 'Guaranteed' ? apyValue.value + 5 : apyValue.value
})
const refApplyed = ref('+5% Promotional Rate*')
const dayliDivs = computed(() => {
  return (guaranteedPayout.value / 365).toFixed(2)
})
function validate(event) {
  if (event.keyCode < 48 || event.keyCode > 57) event.returnValue = false
}
const guaranteedPayout = computed(() => {
  return pickerValue.value * (apyValueComputed.value / 100)
})
const onPickerValueInput = (event) => {
  const replacedStringValue = event.target.value.replace(/,/g, '').replaceAll('$', '')
  pickerValue.value = Number(replacedStringValue)
}
const setValuePicker = (plus = false) => {
  if (plus) {
    pickerValue.value = +pickerValue.value + 100
  } else {
    pickerValue.value = +pickerValue.value - 100

    if (+pickerValue.value < 0) {
      pickerValue.value = 0
    }
  }
}

const isFiatDisableBuy = computed(() => {
  if (props.isFiat) {
    return +pickerValue <= 1000
  } else {
    +pickerValue <= 100
  }
})

const checkPromocode = $app.filters.debounce(async () => {
  await $app.api.eth.referral.checkValidationCode(refCode.value).then((response) => {
    refCodeValid.value = response.data?.exists
  })
  emit('refCode', refCode.value)
}, 1000)
const typeAPY = ref('Projected')
const apyClassAdd = ref(false)
const changeApy = (type) => {
  if (type) {
    apyValue.value = 14
    apyClassAdd.value = true
    typeAPY.value = 'Guaranteed'
  } else {
    apyValue.value = 33
    apyClassAdd.value = false
    typeAPY.value = 'Projected'
  }
}

watch(
  () => pickerValue.value,
  (newValue) => {
    if (+newValue > 500000) {
      pickerValue.value = 500000
    }
    emit('calculator-amount', pickerValue.value)

  },
)

onMounted(() => {
  if (props.isFiat) {
    pickerValue.value = 1000
  } else {
    pickerValue.value = 100
  }
})
</script>

<style lang="scss" src="./m-profit-calculator.scss" />
