<template>
  <button v-if="$app.store.user?.[hashMap?.[activeComponent]]?.usd_amount" class="e-send-to-buy-shares" type="button" @click="() => {$app.store.user.setIsInvestModalShow({show: true});}" > <!--@click="$router.push({ name: 'personal-buy-shares' })"-->
    <div class="e-send-to-buy-shares-info">
      <div class="e-send-to-buy-shares-info-title">Boost Your {{ boostText }}! 🚀</div>
      <div class="e-send-to-buy-shares-info-text">{{ btnPopperText }}</div>
    </div>
    <a-icon width="18" height="18" class="e-send-to-buy-shares-chevron" :name="Icon.MonoChevronRight" />
  </button>
</template>

<script setup lang="ts">
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { useNuxtApp } from '#app'

const { $app } = useNuxtApp()

const apyValue = ref(14)

const props = defineProps<{
  activeComponent: string
}>()

const hashMap = {
    'personal-dividends': 'walletDividends',
    'personal-referrals': 'walletReferral',
   'personal-bonus': 'walletBonus'
}

const boostText = computed(() => {
  switch (props.activeComponent) {
    case 'personal-dividends':
      return 'Dividends'
    case 'personal-referrals':
      return 'Referrals'
    case 'personal-bonus':
      return 'Bonus'
    default:
      return ''
  }
})

const btnPopperText = computed(() => {
  const divSum = $app.store.user?.[hashMap?.[props.activeComponent]]?.usd_amount || 0

  const divSumIn3Years = divSum + divSum * (apyValue.value / 100) * 3
  return `Reinvest ${boostText.value} into ${$app.filters.rounded(
    divSum,
    2,
  )} Bitcoin ETF shares. Aim for a combined return of over $${$app.filters.rounded(
    divSumIn3Years,
    2,
  )} in just 1095 days!`
})
</script>

<style src="./e-send-to-buy-shares.scss" lang="scss" />
