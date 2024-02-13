<template>
  <div class="w-display-currency page-max-width--small">
    <div class="w-display-currency__wrap">
      <div class="w-display-currency__title">Display currency</div>
      <div class="w-display-currency__group">
        <div
          :class="[
            'w-display-currency__group-radio',
            { 'w-display-currency__group-radio--active': selectedCurrency === 'btc' },
          ]"
        >
          <a-radio
            v-model="selectedCurrency"
            name="currency"
            id="btc"
            value="btc"
            :label="`<i class='a-icons icon-mono--btc-uni convert-icon' aria-hidden='true' ></i> Bitcoin`"
          />
        </div>
        <div
          :class="[
            'w-display-currency__group-radio',
            { 'w-display-currency__group-radio--active': selectedCurrency === 'satoshi' },
          ]"
        >
          <a-radio
            v-model="selectedCurrency"
            name="currency"
            id="satoshi"
            value="satoshi"
            :label="`<i class='a-icons icon-mono--satoshi-uni convert-icon' aria-hidden='true' ></i> Satoshi `"
          />
        </div>
      </div>
    </div>
    <div class="w-display-currency__text">
      You can always toggle between Bitcoin and Satoshi as your unit of account.
    </div>
  </div>
</template>

<script setup lang="ts">
import ARadio from '~/src/shared/ui/atoms/a-radio/a-radio.vue'

const selectedCurrency = ref('')

watch(selectedCurrency, (value) => {
  localStorage.setItem('display-currency', value)
})

onMounted(() => {
  const displayCurrency = localStorage.getItem('display-currency')
  if (displayCurrency) {
    selectedCurrency.value = displayCurrency
  }
})
</script>

<style src="./w-display-currency.scss" lang="scss" />
