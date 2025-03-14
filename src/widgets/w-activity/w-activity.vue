<template>
  <div class="w-activity">
    <div class="w-activity__head">
      <div class="w-activity__head-title">Latest Activity</div>
      <nuxt-link v-if="!isPage && renderedSpillovers?.length" :to="fullPageNuxtLink" class="w-activity__head-info"
        >View all
      </nuxt-link>
    </div>
    <div v-if="renderedSpillovers?.length" id="spinloversList" class="w-activity__content">
      <transition-group name="fade" tag="div">
        <m-deal v-for="spillover in renderedSpillovers" :key="spillover?.uuid" :deal="spillover" type="spillover" />
      </transition-group>
    </div>
    <e-empty-data v-else title="You don’t have any activities yet." />
    <div v-if="props.isPage && loading && renderedSpillovers?.length" class="w-activity__loading">
      <m-loading-new />
    </div>
  </div>
</template>

<script setup lang="ts">
import MDeal from '~/src/shared/ui/molecules/m-deal/m-deal.vue';
import MLoadingNew from '~/src/shared/ui/molecules/m-loading-new/m-loading-new.vue';
import EEmptyData from '~/src/entities/e-empty-data/e-empty-data.vue';
import { useNuxtApp } from '#app';
import { Centrifuge } from 'centrifuge';
import { onUnmounted } from 'vue';
import { useRoute } from '#imports';
import { UseIntersectionObserver } from '~/composables/useIntersectionObserver';

const { $app } = useNuxtApp()
const route = useRoute()

const props = withDefaults(
  defineProps<{
    isPage?: boolean
    perPage?: number
    filters: Record<string, string | false> | null
  }>(),
  {
    isPage: false,
    perPage: 4,
    filters: null
  },
)

const loading = ref<boolean>(true);

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

const loadMoreSpillovers = () => {
  currentPage.value += 1

  getSpillovers()
}

const getSpillovers = async () => {
  loading.value = true;
  const tradesFilters = props.filters ?? {};

  if (tradesFilters.asset_uuid === false) return;

  const requestParams = {
    per_page: props.isPage ? 10 : props.perPage,
    page: currentPage.value,
    filters: tradesFilters,
  }

  await $app.api.info.event.getSpillovers(requestParams).then((dealsResponse) => {
    hasNextPage.value = !!dealsResponse.data.next_page_url;
    spillovers.value = [...spillovers.value, ...dealsResponse.data.data];
    loading.value = false;
    if (props.isPage) {
      setTimeout(changeObservable, 100);
    }
  })
}

const renderedSpillovers = computed(() => {
  return props.isPage ? spillovers.value : spillovers.value?.slice(0, 4)
})
const centrifugeURL = process.dev ? 'wss://wss.stage.techetf.org/connection/websocket' : 'wss://wss.bitcoinetf.org/connection/websocket'

onMounted(async () => {
  await getSpillovers()

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
      if (route.name !== 'personal-assets-symbol' || ctx.data.message.asset_uuid === props.filters?.asset_uuid) {
        spillovers.value = [ctx.data.message, ...spillovers.value]
      }
    })
    .subscribe()
})



const IntersctObs = new UseIntersectionObserver(() => loadMoreSpillovers());
const intersectionError = ref<boolean>(false);

const changeObservable = () => {
  IntersctObs.disconnect();
  try {
    IntersctObs.observe('#spinloversList div .m-deal:last-child');
  } catch(e) {
    intersectionError.value = true;
    console.log(e);
  }
}

watch(() => props.filters, () => {
  getSpillovers();
})

onUnmounted(() => {
  centrifuge.value?.disconnect();
  IntersctObs.disconnect();
})
</script>

<style src="./w-activity.scss" lang="scss" />
