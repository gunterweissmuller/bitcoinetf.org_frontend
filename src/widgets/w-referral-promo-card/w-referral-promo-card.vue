<template>
  <div
    class="w-referral-promo-card__wrapper"
    :class="{
      'w-referral-promo-card__wrapper--brand': data.name == 'brand',
      'w-referral-promo-card__wrapper--tether': data.name == 'tether',
      'w-referral-promo-card__wrapper--bitcoin': data.name == 'bitcoin',
    }"
  >
    <div class="w-referral-promo-card__logo">
      <img src="/img/icons/colorful/btc-dark-logo.svg" />
    </div>
    <div class="w-referral-promo-card__body">
      <div class="w-referral-promo-card__title">{{ data.title }}</div>
      <div class="w-referral-promo-card__description">{{ data.description }}</div>
    </div>
    <div class="w-referral-promo-card__image">
      <img :src="`/img/referrals/w-referral-promo-card-${data.name}-icon.svg`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TPromoCardDetails } from '~/src/shared/types/global'

interface Props {
  data: TPromoCardDetails
}
defineProps<Props>()
</script>

<style lang="scss" src="./w-referral-promo-card.scss"></style>
