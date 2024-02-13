<template>
  <nuxt-link
    v-if="clickable"
    :id="`asset-${asset.symbol.toLowerCase()}`"
    :to="{ name: 'personal-asset-id', params: { id: asset?.uuid } }"
    class="m-asset"
  >
    <div :class="['m-asset__type', `bg--${asset.symbol.toLowerCase()}`]"></div>
    <div class="m-asset__name">
      <div class="m-asset__name-title">{{ asset.name }}</div>
      <div class="m-asset__name-subtitle">Ticker: {{ asset.symbol }}</div>
    </div>
    <div class="m-asset__info">
      <div class="m-asset__info-earning" v-html="earnignsText"></div>
      <template v-if="apyNeeded">
        <div v-if="asset.symbol !== 'VAULT' && asset.symbol !== 'BRF'" class="m-asset__info-apy">
          {{ $app.filters.rounded((asset?.apy), 2) }}%
        </div>
      </template>
      <template v-else>
        <div v-if="asset.symbol !== 'VAULT' && asset.symbol !== 'BRF'" class="m-asset__info-apy">
          {{ $app.filters.rounded((asset?.full_balance / fullBalance * 100), 2) }}%
        </div>
        <div v-if="asset.symbol === 'BRF'" class="m-asset__info-apy">
          {{ $app.filters.rounded((asset?.incoming_amount_btc * $app.store.user.btcValue / fullBalance * 100), 2) }}%
        </div>
      </template>
    </div>
  </nuxt-link>
  <div v-else class="m-asset">
    <div :class="['m-asset__type', `bg--${asset.symbol.toLowerCase()}`]"></div>
    <div class="m-asset__name">
      <div class="m-asset__name-title">{{ asset.name }}</div>
      <div class="m-asset__name-subtitle">Ticker: {{ asset.symbol }}</div>
    </div>
    <div class="m-asset__info">
      <div class="m-asset__info-earning">${{ $app.filters.rounded(asset?.full_balance, 2) }}</div>
      <div class="m-asset__info-apy">{{ $app.filters.rounded((asset?.full_balance / fullBalance * 100), 2) }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IAsset } from '~/src/shared/types/global'
import { useNuxtApp } from '#app'

const { $app } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    asset: IAsset
    btcValue?: number
    clickable?: boolean
    fullBalance?: number
    apyNeeded?:boolean
  }>(),
  {
    btcValue: 0,
    clickable: true,
    fullBalance: 0,
    apyNeeded: false
  },
)

const earnignsText = computed(() => {
  if (props.apyNeeded) {
    return '$' + $app.filters.rounded(props.asset?.winning_amount_btc * $app.store.user.btcValue, 2)
  } else {
    if (props.asset.symbol === 'BRF') {
      return '$' + $app.filters.rounded(props.asset?.incoming_amount_btc * $app.store.user.btcValue, 2)
    } else {
      return '$' + $app.filters.rounded(props.asset?.full_balance, 2)
    }
  }

})
</script>

<style src="./m-asset.scss" lang="scss" />
