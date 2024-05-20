<template>
  <div v-if="isVisible" class="a-pagination">
    <button
      v-for="(page, index) in visibleItems"
      :key="page + index"
      class="a-pagination__item a-font_button-s"
      :class="{ 'a-pagination__selected': pageIndex === page, 'disabledPage': page === ellipsisText }"
      :disabled="page === ellipsisText || disabledPagination"
      @click="onPageClickHandler(page as number)"
    >
      {{ page }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  perPage: {
    type: [Number, String],
    default: 1,
  },

  totalItems: {
    type: [Number, String],
    default: 0,
  },

  currentPage: {
    type: [Number, String],
    default: 1,
  },

  ellipsisText: {
    type: String,
    required: false,
    default: '…',
  },

  clickCallback: {
    type: Function,
    required: true,
  },
  disabledPagination: {
    type: Boolean,
    default: false,
  },
})

const currentPageIndex = ref(Number(props.currentPage))

const maxPageElements = 6

const buttonClasses = computed(() => {
  return {
    'a-pagination__button': true,
    'a-font_button': true,
  }
})

const isPrevButtonDisabled = computed(() => {
  return currentPageIndex.value === 1
})

const isNextButtonDisabled = computed(() => {
  return currentPageIndex.value === totalPages.value
})

const totalPages = computed(() => {
  return Math.ceil(Number(props.totalItems) / Number(props.perPage))
})

const allPagesIndexes = computed(() => {
  return Array.from({ length: totalPages.value }, (_v, k) => k + 1)
})

const isVisible = computed(() => {
  return totalPages.value > 1
})

const firstPage = computed(() => {
  return allPagesIndexes.value[0]
})

const lastPage = computed(() => {
  return allPagesIndexes.value[totalPages.value - 1]
})

const leftAdjacentPage = computed(() => {
  return currentPageIndex.value - 1
})

const rightAdjacentPage = computed(() => {
  return currentPageIndex.value + 1
})

const visibleItems = computed(() : (number | string)[] | number => {
  const items = []

  if (totalPages.value <= maxPageElements) {
    return totalPages.value
  }

  if (currentPageIndex.value !== firstPage.value) {
    items.push(firstPage.value)
  }

  if (range(leftAdjacentPage.value, firstPage.value).length) {
    items.push(props.ellipsisText)
  }

  if (currentPageIndex.value > 2) {
    items.push(leftAdjacentPage.value)
  }

  items.push(currentPageIndex.value)

  if (currentPageIndex.value !== lastPage.value) {
    items.push(rightAdjacentPage.value)
  }

  if (range(rightAdjacentPage.value, lastPage.value).length) {
    items.push(props.ellipsisText)
  }

  if (lastPage.value !== rightAdjacentPage.value && lastPage.value !== currentPageIndex.value) {
    items.push(lastPage.value)
  }

  return items
})

const pageIndex = computed(() => {
  return currentPageIndex.value
})

const onPageClickHandler = (page: number) => {
  if (props.disabledPagination) return

  currentPageIndex.value = page

  props.clickCallback(page)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const range = (start: any, end: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r: any = []
  let startV = start
  let endV = end

  if (typeof startV !== 'number' || typeof endV !== 'number') {
    return r
  }
  if (startV > endV) {
    const temp = startV
    startV = endV
    endV = temp
  }
  for (let i = startV + 1; i <= endV - 1; i += 1) {
    r.push(i)
  }
  return r
}
</script>

<style lang="scss">
@import 'a-pagination';
</style>
