<template>
  <div :class="['w-shareholders', { 'page-max-width--small': isPage }]">
    <div class="w-shareholders__head">
      <div class="w-shareholders__head-title">Top 100 Shareholders</div>
      <nuxt-link
        v-if="!isPage && shareholders?.length"
        :to="{ name: 'personal-fund-shareholders-top-shareholders' }"
        class="w-shareholders__head-info"
        >View all
      </nuxt-link>
    </div>
    <div v-if="shareholders?.length" class="w-shareholders__content">
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
    <div v-if="isPage && hasNextPage && shareholders?.length" class="w-shareholders__more">
      <div @click="loadMoreshareholders" class="w-shareholders__more-text">Load more</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MDeal from '~/src/shared/ui/molecules/m-deal/m-deal.vue'
import { useNuxtApp } from '#app'
import EEmptyData from '~/src/entities/e-empty-data/e-empty-data.vue'

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

const shareholders = ref([])
const currentPage = ref(1)
const hasNextPage = ref(true)

const loadMoreshareholders = async () => {
  currentPage.value += 1
  await getshareholders()
}

const getshareholders = async () => {
  await $app.api.eth.statisticEth
    .getShareholders({
      per_page: props.perPage,
      page: currentPage.value,
      // order_column: orderColumn.value,
      // order_by: orderBy.value,
    })
    .then((dealsResponse) => {
      hasNextPage.value = !!dealsResponse.data.next_page_url
      shareholders.value = [...shareholders.value, ...dealsResponse.data.data]
    })
}

onMounted(async () => {
  await getshareholders()
})
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
