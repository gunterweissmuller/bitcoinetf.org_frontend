<template>
  <div class="w-activity">
    <div class="w-activity__head">
      <div class="w-activity__head-title">Latest activity</div>
      <nuxt-link v-if="!isPage && renderedSpillovers?.length" :to="fullPageNuxtLink" class="w-activity__head-info"
        >View all
      </nuxt-link>
    </div>
    <div v-if="renderedSpillovers?.length" class="w-activity__content">
      <transition-group name="fade" tag="div">
        <m-deal v-for="spillover in renderedSpillovers" :key="spillover?.uuid" :deal="spillover" type="spillover" />
      </transition-group>
    </div>
    <e-empty-data v-else title="You don’t have any activities yet." />
    <div v-if="isPage && hasNextPage && renderedSpillovers?.length" class="w-activity__more">
      <div @click="loadMoreSpillovers" class="w-trades__more-text">Load more</div>
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

const { $app } = useNuxtApp()
const route = useRoute()

const props = withDefaults(
  defineProps<{
    isPage?: boolean
    perPage?: number
  }>(),
  {
    isPage: false,
    perPage: 4,
  },
)

const spillovers = ref([])
const currentPage = ref(1)
const hasNextPage = ref(true)

const centrifuge = ref(null)

const fullPageNuxtLink = computed(() => {
  const nuxtLinkObject = { name: 'personal-analytics-portfolio-latest-activity', query: {} }
  if (route.name === 'personal-asset-id') {
    nuxtLinkObject.query.asset_uuid = route.params.id
  }

  return nuxtLinkObject
})

const loadMoreSpillovers = async () => {
  currentPage.value += 1

  if (route.name === 'personal-asset-id') {
    await getSpillovers(route.params.id)
  } else if (route.query.asset_uuid) {
    await getSpillovers(route.query.asset_uuid)
  } else {
    await getSpillovers()
  }
}

const getSpillovers = async (assetId?: string) => {
  const tradesFilters = {}

  if (assetId) {
    tradesFilters.asset_uuid = assetId
  }

  const requestParams = {
    per_page: props.perPage,
    page: currentPage.value,
    filters: tradesFilters,
  }

  await $app.api.info.event.getSpillovers(requestParams).then((dealsResponse) => {
    hasNextPage.value = !!dealsResponse.data.next_page_url
    spillovers.value = [...spillovers.value, ...dealsResponse.data.data]
  })
}

const renderedSpillovers = computed(() => {
  return props.isPage ? spillovers.value : spillovers.value?.slice(0, 4)
})
const centrifugeURL = process.dev ? 'wss://wss.stage.techetf.org/connection/websocket' : 'wss://wss.bitcoinetf.org/connection/websocket'

onMounted(async () => {
  if (route.name === 'personal-asset-id') {
    await getSpillovers(route.params.id)
  } else if (route.query.asset_uuid) {
    await getSpillovers(route.query.asset_uuid)
  } else {
    await getSpillovers()
  }

  const config = useRuntimeConfig()
  const centrifugeURL = config.public.WS_URL
  const centrifugeToken = config.public.WS_TOKEN

  centrifuge.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })

  centrifuge.value.connect()

  const sub = centrifuge.value.newSubscription('event_spillover')

  sub
    .on('publication', function (ctx) {
      if (route.name === 'personal-asset-id' && route.params.id === ctx.data.message.asset_uuid) {
        spillovers.value = [ctx.data.message, ...spillovers.value]
      } else if (route.name !== 'personal-asset-id') {
        spillovers.value = [ctx.data.message, ...spillovers.value]
      }
    })
    .subscribe()
})

onUnmounted(() => {
  centrifuge.value?.disconnect()
})
</script>

<style src="./w-activity.scss" lang="scss" />
