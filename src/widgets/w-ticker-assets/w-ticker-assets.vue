<template>
  <div class="w-ticker-assets">

    <div class="w-ticker-assets__caption">
      <div :class="['w-ticker-assets__caption-symbol', `bg--${props.asset.symbol.toLowerCase()}`]"></div>
      <div class="w-ticker-assets__caption-title">
        <span class="w-ticker-assets__caption-text">
          Ticker
        </span>
        <span class="w-ticker-assets__caption-name">
          {{ props.asset.symbol.toUpperCase() }}
        </span>
      </div>
    </div>

    <h2 class="w-ticker-assets__heading">
      {{ asset.name }}
    </h2>

    <p class="w-ticker-assets__description">
      {{ asset.description }}
    </p>

    <!-- FIX HREF -->
    <a href="" class="w-ticker-assets__link">
      <img src="/img/icons/mono/action/link.svg" alt="">
      View on blockchain
      <span></span>
    </a>
  </div>
</template>

<script lang='ts' setup>
interface Asset {
  symbol: string;
  name: string;
  description: string;
}

const props = defineProps<{
  asset: Asset
}>();
</script>

<style lang='scss' src="./w-ticker-assets.scss"></style>
