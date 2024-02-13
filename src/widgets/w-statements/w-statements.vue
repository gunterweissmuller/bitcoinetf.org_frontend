<template>
  <div class="w-statements">
    <div v-if="statements?.length" class="w-statements__list">
      <div v-for="(item, idx) in statements" :key="idx" class="w-statements__item" @click="downloadReport(item)">
        <a-icon width="24" class="w-statements__item-icon" :name="Icon.MonoFile" />
        <div class="w-statements__item-text">{{ item.date }}</div>
        <a-icon width="24" class="w-statements__item-chevron" :name="Icon.MonoChevronRight" />
      </div>
    </div>
    <e-empty-data title="You don’t have any statements yet." v-else />
    <div v-if="statements?.length && hasNextPage" class="w-statements__more">
      <div @click="loadMoreStatements" class="w-statements__more-text">Load more</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import EEmptyData from '~/src/entities/e-empty-data/e-empty-data.vue'

const { $app } = useNuxtApp()

const statements = ref([])
const perPage = ref(4)
const currentPage = ref(1)
const hasNextPage = ref(true)

const loadMoreStatements = async () => {
  currentPage.value += 1
  await getReports()
}

const getReports = async () => {
  await $app.api.eth.statisticEth
    .getReports({
      per_page: perPage.value,
      page: currentPage.value,
    })
    .then((dealsResponse) => {
      hasNextPage.value = !!dealsResponse.data.next_page_url
      statements.value = [...statements.value, ...dealsResponse.data.data]
    })
}

const downloadReport = async (item) => {
  await $app.api.eth.statisticEth
    .getReport({
      uuid: item.uuid,
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob.slice(0, blob.size, 'application/pdf'))
      const link = document.createElement('a')

      link.style.display = 'none'
      link.href = url
      link.download = `${item.date}.pdf`
      link.click()

      window.URL.revokeObjectURL(url)
    })
}

onMounted(async () => {
  await getReports()
})
</script>

<style src="./w-statements.scss" lang="scss"></style>
