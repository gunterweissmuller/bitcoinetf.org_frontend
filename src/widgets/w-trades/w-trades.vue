<template>
  <div v-if="renderedTrades.length" class="w-trades">
    <div class="w-trades__head">
      <div class="w-trades__head-title">Latest trades</div>
      <nuxt-link v-if="!isPage && renderedTrades.length && !hideView" :to="fullPageNuxtLink" class="w-trades__head-info"
        >View All
      </nuxt-link>
    </div>
    <div v-if="renderedTrades.length && !isExpand" class="w-trades__content" :style="{height: `${renderedTrades?.length * 94}px`}">
      <transition-group name="fade" tag="div">
        <m-deal v-for="(trade, idx) in renderedTrades" :key="trade?.uuid" :deal="trade" />
      </transition-group>
    </div>

    <div v-if="renderedTrades.length && isExpand" class="w-trades__content" :style="{height: `${expandMore * 94}px`}">
      <transition-group name="fade" tag="div">
        <template v-for="(trade, idx) in renderedTrades" :key="trade?.uuid" :deal="trade">
          <m-deal v-if="idx < expandMore" :deal="trade" />
        </template>
      </transition-group>
    </div>

    <e-empty-data title="You don’t have any trades yet." v-if="!renderedTrades?.length" />

    <div
      v-if="isExpand && expandMore < renderedTrades.length"
      class="w-trades__more w-trades__more-text"
      @click="expandMore += 2"
    >
      Expand
    </div>

    <div v-if="isPage && hasNextPage && renderedTrades.length" class="w-trades__more">
      <div @click="loadMoreTrades" class="w-trades__more-text">Load more</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MDeal from '~/src/shared/ui/molecules/m-deal/m-deal.vue'
import { useNuxtApp } from '#app'
import { Centrifuge } from 'centrifuge'
import { onUnmounted } from 'vue'
import EEmptyData from '~/src/entities/e-empty-data/e-empty-data.vue'
import { useRoute } from '#imports'

const route = useRoute()
const { $app } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    isPage?: boolean
    isExpand?: boolean
    perPage?: number
    hideView?: boolean
  }>(),
  {
    isPage: false,
    perPage: 4,
  },
)

const trades = ref([])
const currentPage = ref(1)
const hasNextPage = ref(true)

const expandMore = ref(2)

const centrifuge = ref(null)

const fullPageNuxtLink = computed(() => {
  // FIX name on features/fund_remake
  const nuxtLinkObject = { name: 'personal-analytics-performance-latest-trades', query: {} }
  if (route.name === 'personal-asset-id') {
    nuxtLinkObject.query.asset_uuid = route.params.id
  }

  return nuxtLinkObject
})

const loadMoreTrades = async () => {
  currentPage.value += 1

  if (route.name === 'personal-asset-id') {
    await getTrades(route.params.id)
  } else if (route.query.asset_uuid) {
    await getTrades(route.query.asset_uuid)
  } else {
    await getTrades()
  }
}

const getTrades = async (assetId?: string) => {
  const tradesFilters = {}

  if (assetId) {
    tradesFilters.asset_uuid = assetId
  }

  const requestParams = {
    per_page: props.perPage,
    page: currentPage.value,
    filters: tradesFilters,
  }

  await $app.api.info.event.getDeals(requestParams).then((dealsResponse) => {
    hasNextPage.value = !!dealsResponse.data.next_page_url
    trades.value = [...trades.value, ...dealsResponse.data.data]
  })
}

const renderedTrades = computed(() => {
  return props.isPage ? trades.value : trades.value.slice(0, 4)
})
const config = useRuntimeConfig()
const centrifugeURL = config.public.WS_URL
const centrifugeToken = config.public.WS_TOKEN

onMounted(async () => {
  if (route.name === 'personal-asset-id') {
    await getTrades(route.params.id)
  } else if (route.query.asset_uuid) {
    await getTrades(route.query.asset_uuid)
  } else {
    await getTrades()
  }

  centrifuge.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })

  centrifuge.value.connect()

  const sub = centrifuge.value.newSubscription('event_deal')
  sub
    .on('publication', function (ctx) {
      $app.store.user.latestTrade = ctx.data.message?.result_amount
     if (route.name !== 'personal-asset-id' && !route.query.asset_uuid) {
        trades.value = [ctx.data.message, ...trades.value]
      }
    })
    .subscribe()
})

onUnmounted(() => {
  centrifuge.value?.disconnect()
})
</script>

<style src="./w-trades.scss" lang="scss" />

<style lang="scss">
.w-trades {
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.8s,
    bottom 0.8s,
    transform 0.8s;
}

.fade-enter-from {
  transform: translateX(-200px);
}

.fade-enter-to {
  transform: translateX(0px);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-to {
  width: 100%;
  position: absolute;
  bottom: 0;
  transform: translateY(100px);
}
</style>
