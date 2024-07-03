<template>
  <div class="w-purchases page-max-width--big">
    <div :class="['w-purchases__wrap', { 'w-purchases__wrap--full-width': !isPage }]">
      <div class="w-purchases__head">
        <div class="w-purchases__head-title">Latest Purchases</div>
        <!-- FIX :to name on features/fund_remake -->
        <nuxt-link
          v-if="!isPage && purchases?.length"
          :to="{ name: 'personal-analytics-shareholders-latest-purchases' }"
          class="w-purchases__head-info"
          >View all
        </nuxt-link>
      </div>
      <div v-if="purchases?.length" id="purchasesList" class="w-purchases__content">
        <transition-group name="fade" tag="div">
          <m-deal
            v-for="(purchase, idx) in renderedPurchases"
            :class="[
              'w-purchases__content-item',
            ]"
            :key="purchase?.uuid"
            :with-id="idx === 0 ? 'purchase' : ''"
            type="purchase"
            :deal="purchase"
            @click="getPurchase(purchase.uuid)"
          />
        </transition-group>
      </div>
      <e-empty-data v-else title="You don’t have any purchases yet." />
      <div v-if="props.isPage && loading && renderedPurchases?.length" class="w-purchases__loading">
        <m-loading-new />
      </div>
    </div>
    <f-purchases-modal v-model="isOpenModal" :purchase="selectedPurchase" />
  </div>
</template>

<script setup lang="ts">
import MDeal from '~/src/shared/ui/molecules/m-deal/m-deal.vue';
import FPurchasesModal from '~/src/features/f-purchases-modal/f-purchases-modal.vue';
import EEmptyData from '~/src/entities/e-empty-data/e-empty-data.vue';
import MLoadingNew from '~/src/shared/ui/molecules/m-loading-new/m-loading-new.vue';
import { useNuxtApp } from '#app';
import { computed } from 'vue';
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

const purchases = ref([])
const currentPage = ref(1)
const hasNextPage = ref(true)
const isOpenModal = ref(false)
const selectedPurchase = ref(null)

const actualValue = computed(() => {
  const value = localStorage.getItem('display-currency') || 'btc'
  if (value === 'btc') {
    return 'BTC'
  } else {
    return 'SATOSHI'
  }
})

const loadMorePurchases = async () => {
  currentPage.value += 1
  await getPurchases()
}

const getPurchases = async () => {
  loading.value = true;

  await $app.api.info.event
    .getPurchases({
      per_page: props.isPage ? 10 : props.perPage,
      page: currentPage.value,
    })
    .then((dealsResponse) => {
      hasNextPage.value = !!dealsResponse.data.next_page_url;
      purchases.value = [...purchases.value, ...dealsResponse.data.data];
      loading.value = false;
      if (props.isPage) {
        setTimeout(changeObservable, 100);
      };
    })
}

const getPurchase = async (uuid: string) => {
  loading.value = true;
  await $app.api.info.event
    .getPurchase({
      uuid,
    })
    .then((purchaseResponse) => {
      selectedPurchase.value = purchaseResponse.data;
      openPurchase();
      loading.value = false;
    })
}

const openPurchase = () => {

  isOpenModal.value = true
}

const renderedPurchases = computed(() => {
  return props.isPage ? purchases.value : purchases.value?.slice(0, 4)
})

onMounted(() => {
  getPurchases();
})

const IntersctObs = new UseIntersectionObserver(() => loadMorePurchases());
const intersectionError = ref<boolean>(false);

const changeObservable = () => {
  IntersctObs.disconnect();
  try {
    IntersctObs.observe('#purchasesList div .m-deal:last-child');
  } catch(e) {
    intersectionError.value = true;
    console.log(e);
  }
}

onUnmounted(() => {
  IntersctObs.disconnect();
})
</script>

<style src="./w-purchases.scss" lang="scss" />

<style lang="scss">
.w-purchases {
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
