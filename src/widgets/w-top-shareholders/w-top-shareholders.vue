<template>
  <div :class="['w-shareholders', { 'page-max-width--small': isPage }]">
    <div class="w-shareholders__head">
      <div class="w-shareholders__head-title">Top 100 Shareholders</div>
      <!-- FIX :to name on features/fund_remake -->
      <nuxt-link
        v-if="!isPage && shareholders?.length"
        :to="{ name: 'personal-analytics-shareholders-top-shareholders' }"
        class="w-shareholders__head-info"
        >View all
      </nuxt-link>
    </div>
    <div v-if="shareholders?.length" id="shareholdersList" class="w-shareholders__content">
      <transition-group name="fade" tag="div">
        <m-deal
          v-for="(trade, idx) in shareholders"
          :key="trade?.uuid"
          type="shareholder"
          :deal="trade"
          :with-id="idx === 0 ? 'shareholder' : ''"
        />
      </transition-group>
    </div>
    <e-empty-data v-else title="You don’t have any shareholders yet." />
    <div v-if="props.isPage && loading && shareholders?.length" class="w-shareholders__loading">
      <m-loading-new />
    </div>
  </div>
</template>

<script setup lang="ts">
import MDeal from '~/src/shared/ui/molecules/m-deal/m-deal.vue';
import EEmptyData from '~/src/entities/e-empty-data/e-empty-data.vue';
import MLoadingNew from '~/src/shared/ui/molecules/m-loading-new/m-loading-new.vue';
import { useNuxtApp } from '#app';
import { UseIntersectionObserver } from '~/composables/useIntersectionObserver';

const { $app } = useNuxtApp()

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

const loading = ref<boolean>(true);

const shareholders = ref([])
const currentPage = ref(1)
const hasNextPage = ref(true)

const loadMoreshareholders = async () => {
  currentPage.value += 1
  await getshareholders()
}

const getshareholders = async () => {
  loading.value = true;
  await $app.api.eth.statisticEth
    .getShareholders({
      per_page: props.isPage ? 10 : props.perPage,
      page: currentPage.value,
      // order_column: orderColumn.value,
      // order_by: orderBy.value,
    })
    .then((dealsResponse) => {
      hasNextPage.value = !!dealsResponse.data.next_page_url;
      shareholders.value = [...shareholders.value, ...dealsResponse.data.data];
      loading.value = false;
      if (props.isPage) {
        setTimeout(changeObservable, 100);
      }
    })
}

const IntersctObs = new UseIntersectionObserver(() => loadMoreshareholders());
const intersectionError = ref<boolean>(false);

const changeObservable = () => {
  IntersctObs.disconnect();
  try {
    IntersctObs.observe('#shareholdersList div .m-deal:last-child');
  } catch(e) {
    intersectionError.value = true;
    console.log(e);
  }
}

onUnmounted(() => {
  IntersctObs.disconnect();
})

onMounted(async () => {
  await getshareholders();
});
</script>

<style src="./w-top-shareholders.scss" lang="scss" />

<style lang="scss">
.w-shareholders {
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
