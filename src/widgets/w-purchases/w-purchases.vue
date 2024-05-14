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
      <div v-if="purchases?.length" class="w-purchases__content">
        <transition-group name="fade" tag="div">
          <m-deal
            v-for="(purchase, idx) in purchases"
            :class="[
              'w-purchases__content-item',
              { 'w-purchases__content-item--active': purchase?.uuid === selectedPurchase?.uuid && isPage },
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
      <div v-if="isPage && hasNextPage && purchases?.length" class="w-purchases__more">
        <div @click="loadMorePurchases" class="w-purchases__more-text">Load more</div>
      </div>
    </div>
<!--    <div v-if="selectedPurchase && isPage" class="w-purchases__modal">-->
<!--      <div class="w-purchases__modal__wrap">-->
<!--        <m-deal class="w-purchases__modal__wrap-purchase" type="purchase" :deal="selectedPurchase" />-->
<!--        <div class="w-purchases__modal__list">-->
<!--          <div class="w-purchases__modal__item">-->
<!--            <div class="w-purchases__modal__item-title">Basis in USD</div>-->
<!--            <div class="w-purchases__modal__item-number">${{ selectedPurchase.amount }}</div>-->
<!--          </div>-->
<!--          <div class="w-purchases__modal__item">-->
<!--            <div class="w-purchases__modal__item-title">Basis in {{ actualValue }}</div>-->
<!--            <div-->
<!--              class="w-purchases__modal__item-number"-->
<!--              v-html="$app.filters.convertValue($app.filters.rounded(selectedPurchase.amount_in_btc, 2))"-->
<!--            ></div>-->
<!--          </div>-->
<!--          <div class="w-purchases__modal__item">-->
<!--            <div class="w-purchases__modal__item-title">Current value</div>-->
<!--            <div class="w-purchases__modal__item-number">-->
<!--              ${{ $app.filters.rounded(selectedPurchase.current_amount_in_usd, 3) }}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="w-purchases__modal__item">-->
<!--            <div class="w-purchases__modal__item-title">Ownership</div>-->
<!--            <div class="w-purchases__modal__item-number">{{ $app.filters.rounded(purchase?.ownership, 2) }}%</div>-->
<!--          </div>-->
<!--          <div class="w-purchases__modal__item">-->
<!--            <div class="w-purchases__modal__item-title">Ends:</div>-->
<!--            <div class="w-purchases__modal__item-number">-->
<!--              {{ $app.filters.dayjs(selectedPurchase.created_at)?.add(3, 'year')?.format('D MMMM YY') }}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="w-purchases__modal__item">-->
<!--            <div class="w-purchases__modal__item-title">Status:</div>-->
<!--            <div class="w-purchases__modal__item-number">{{ selectedPurchase.status }}</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <a-button-->
<!--          :icon="Icon.MonoLink"-->
<!--          class="w-purchases__modal__view w-purchases__modal__btn"-->
<!--          text="View on Blockchain"-->
<!--        />-->
<!--        <a-button-->
<!--          :icon="Icon.MonoLink"-->
<!--          class="w-purchases__modal__issuing w-purchases__modal__btn"-->
<!--          text="Issuing Transaction"-->
<!--          variant="secondary"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->
    <f-purchases-modal v-model="isOpenModal" :purchase="selectedPurchase" />
  </div>
</template>

<script setup lang="ts">
import MDeal from '~/src/shared/ui/molecules/m-deal/m-deal.vue'
import { useNuxtApp } from '#app'
import FPurchasesModal from '~/src/features/f-purchases-modal/f-purchases-modal.vue'
import { Icon } from '~/src/shared/constants/icons'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import useMediaDevice from '~/composables/useMediaDevice'
import EEmptyData from '~/src/entities/e-empty-data/e-empty-data.vue'
import { computed } from 'vue'

const { isDesktop } = useMediaDevice()

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

const purchases = ref($app.store.user.lastPurchases)
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
  await $app.api.info.event
    .getPurchases({
      per_page: props.perPage,
      page: currentPage.value,
    })
    .then((dealsResponse) => {
      hasNextPage.value = !!dealsResponse.data.next_page_url
      purchases.value = [...purchases.value, ...dealsResponse.data.data]
    })
}

const getPurchase = async (uuid: string) => {
  await $app.api.info.event
    .getPurchase({
      uuid,
    })
    .then((purchaseResponse) => {
      selectedPurchase.value = purchaseResponse.data
      openPurchase()
    })
}

const openPurchase = () => {
  if (isDesktop.value && props.isPage) {
    return
  }

  isOpenModal.value = true
}
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
