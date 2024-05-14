<template>
  <div v-if="renderedTrades.length" class="w-trades">
    <div class="w-trades__head">
      <div class="w-trades__head-title">Latest Trades</div>
      <nuxt-link v-if="!isPage && renderedTrades.length && !hideView" :to="fullPageNuxtLink" class="w-trades__head-info"
        >View All
      </nuxt-link>
    </div>

    <div v-if="renderedTrades.length && !isExpand && props.isMain" :class="[{'w-trades__content-main': true}, {'w-trades__content' : !props.isMain}]" :style=" width > 1010 ? {height: `${(renderedTrades?.length / props.gridTemplate) * 94}px`} : {}">
      <transition-group name="fade" tag="div" :class="[{'w-trades__content-main-wrapper' : true}]" :style=" width > 1010 ? {'display': 'grid', 'grid-template-columns': 'repeat( '+ props.gridTemplate +', 1fr)', 'max-height': 94 * (props.perPage/props.gridTemplate) +'px'} : {'display': 'flex', 'flex-direction': 'column'}">
        <m-deal v-for="(trade, idx) in renderedTrades" :key="trade?.uuid" :deal="trade" :pageType="props.isMain ? 'main' : 'default'" :isMain="props.isMain"/>
      </transition-group>
    </div>

    <div v-if="renderedTrades.length && !isExpand && !props.isMain" class="w-trades__content">
      <transition-group name="fade" tag="div">
        <m-deal v-for="(trade, idx) in renderedTrades" :key="trade?.uuid" :deal="trade" :type="props.isAssets ? 'asset' : 'trade'" />
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
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const route = useRoute()
const { $app } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    isPage?: boolean
    isExpand?: boolean
    perPage?: number
    hideView?: boolean
    gridTemplate?: number
    isMain?: boolean
    filters: Record<string, string | false> | null
    isAssets: boolean
  }>(),
  {
    isPage: false,
    perPage: 4,
    gridTemplate: 1,
    isMain: false,
    filters: null,
    isAssets: false,
  },
)

const trades = ref([])
const currentPage = ref(1)
const hasNextPage = ref(true)

const expandMore = ref(2)

const centrifuge = ref(null)

const fullPageNuxtLink = computed(() => {
  const nuxtLinkObject = { name: 'personal-analytics-performance-latest-trades', query: {} }
  // if (route.name === 'personal-asset-id') {
  //   nuxtLinkObject.query.asset_uuid = route.params.id
  // }

  return nuxtLinkObject
})

const loadMoreTrades = () => {
  currentPage.value += 1

  getTrades()
}

const getTrades = async () => {
  const tradesFilters = props.filters ?? {};

  if (tradesFilters.asset_uuid === false) return;

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
  return props.isPage ? trades.value : trades.value.slice(0, props.perPage)
})
const config = useRuntimeConfig()
const centrifugeURL = config.public.WS_URL
const centrifugeToken = config.public.WS_TOKEN

onMounted(async () => {
  await getTrades()

  centrifuge.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })

  centrifuge.value.connect()

  const sub = centrifuge.value.newSubscription('event_deal')
  sub
    .on('publication', function (ctx) {
      $app.store.user.latestTrade = ctx.data.message?.result_amount

      if (route.name !== 'personal-assets-symbol' || ctx.data.message.asset_uuid === props.filters?.asset_uuid) {
        trades.value = [ctx.data.message, ...trades.value]
      }
    })
    .subscribe()
})

onUnmounted(() => {
  centrifuge.value?.disconnect()
})

watch(() => props.filters, () => {
  getTrades();
})
</script>

<style src="./w-trades.scss" lang="scss" />

<style lang="scss">
.w-trades {
  position: relative;
}

.w-trades__content {
  .fade-leave-active,
  .fade-enter-active
  {
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

  .fade-leave-to,
  .fade-enter-from
  {
    opacity: 0;
  }

  .fade-leave-to {
    position: absolute;
    right: 1000px;
    bottom: 0;
    transform: translateY(100px);
  }
}



.w-trades__content-main {

  .fade-enter-active
  {
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

  .fade-enter-from
  {
    opacity: 0;
  }

  .fade-leave-to {
    position: absolute;
    right: 1000px;
    bottom: 0;
    display: none;
  }

}
</style>
