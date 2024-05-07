<template>
  <div class="w-ticker-assets" v-if="props.asset">

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
      {{ props.asset.name }}
    </h2>

    <p class="w-ticker-assets__description">
      {{ props.asset.description }}
    </p>

    <!-- FIX HREF -->
    <a
      v-if="activeExplorerLink"
      :href="`https://${config.public.EXPLORER_API}/account/${config.public.RESERVE_WALLET_ADDRESS}`"
      target="_blank"
      class="w-ticker-assets__link"
    >
      <img src="/img/icons/mono/action/link.svg" alt="">
      View on blockchain
      <span></span>
    </a>
  </div>
</template>

<script lang='ts' setup>
import { IAsset } from '~/src/shared/types/global';

const props = defineProps<{
  asset: IAsset
  activeExplorerLink?: boolean,
}>();

const config = useRuntimeConfig();
</script>

<style lang='scss' src="./w-ticker-assets.scss"></style>
