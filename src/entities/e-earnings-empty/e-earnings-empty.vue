<template>
  <div class="e-earnings-empty">
    <img class="e-earnings-empty__pic" src="/img/empty-earnings.png" alt="empty" />
    <div class="e-earnings-empty__title">Don’t buy Bitcoin, earn it!</div>
    <div class="e-earnings-empty__text">Get started now and enjoy daily dividends!</div>
    <a-button
      :icon="Icon.MonoPlus"
      class="e-earnings-empty__btn"
      text="Buy Bitcoin ETF Shares"
      @click="$router.push({ name: 'personal-buy-shares' })"
    />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '~/src/shared/constants/icons'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
</script>

<style src="./e-earnings-empty.scss" lang="scss" />
