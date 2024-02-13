<template>
  <div class="e-assets">
    <div v-if="!isExpand" class="e-assets__head">
      <div class="e-assets__head-title">Assets</div>
      <div class="e-assets__head-info--wrapper">
        <div class="e-assets__head-info e-assets__head-info--paid">{{ rightTopTitle }}</div>
        <div class="e-assets__head-info">{{ rightTopSubtitle }}</div>
      </div>
    </div>
    <div v-if="!isExpand" class="e-assets__content" :style="{height: `${filteredAssets?.length * 94}`}">
      <m-asset
        v-for="(asset, idx) in filteredAssets"
        @mouseenter="() => emit('mouse-enter-asset', asset.symbol)"
        @mouseleave="() => emit('mouse-leave-asset', asset.symbol)"
        @focusin="() => emit('focus-in-asset', asset.symbol)"
        @focusout="() => emit('focus-out-asset', asset.symbol)"
        :key="idx"
        :asset="asset"
        :btc-value="btcValue"
        :full-balance="fullBalanceFund"
        :apyNeeded="apyNeeded"
      />
    </div>

    <div v-else class="e-assets__content" :style="{height: `${expandMore * 94}px`}">
      <template v-for="(asset, idx) in filteredAssets" :key="idx">
        <m-asset v-if="idx < expandMore" :asset="asset" :full-balance="fullBalanceFund"/>
      </template>
    </div>
  </div>

  <div
    v-if="isExpand && expandMore < filteredAssets.length"
    class="w-trades__more w-trades__more-text"
    @click="expandMore += 4"
  >
    Expand
  </div>
</template>

<script setup lang="ts">
import MAsset from '~/src/shared/ui/molecules/m-asset/m-asset.vue'
import {IAsset} from '~/src/shared/types/global'
import { useNuxtApp } from '#app'

const props = withDefaults(
  defineProps<{
    assets: IAsset[]
    title?: string
    btcValue?: number
    isExpand?: boolean
    rightTopTitle: string
    rightTopSubtitle: string
    apyNeeded?: boolean
  }>(),
  {
    assets: [],
    title: '',
    btcValue: 0,
    isExpand: false,
    rightTopTitle: 'Value',
    rightTopSubtitle: '% of portfolio',
    apyNeeded: false,
  },
)
const { $app } = useNuxtApp()
const emit = defineEmits(['mouse-enter-asset', 'mouse-leave-asset', 'focus-in-asset', 'focus-out-asset'])

const filteredAssets = computed(() => {
  return props.assets
})

const expandMore = ref(2)


const fullBalanceFund = computed(() => {
  return $app.store.assets.fullBalanceFund
})
</script>

<style src="./e-assets.scss" lang="scss"/>
