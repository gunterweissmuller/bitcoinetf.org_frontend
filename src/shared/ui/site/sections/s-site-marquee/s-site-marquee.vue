<template>
  <div class="s-site-marquee" :class="{ 's-site-marquee-bg': isBackground }">
    <div class="s-site-marquee__wrapper">
      <div class="s-site-marquee__row" :style="`width: ${marqueeWidth}`" v-for="index in 12">
        <div class="s-site-marquee__item" v-for="marquee in marqueeList" :key="marquee.link">
          <a :href="marquee.link" target="_blank">
            <nuxt-img :src="marquee.img" loading="lazy" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  data: MarqueeItem[] | any
  isBackground?: boolean
}

interface MarqueeItem {
  link: string
  img: string
}

const props = withDefaults(defineProps<Props>(), {
  data: [],
  isBackground: true,
})

const marqueeList = ref<MarqueeItem[]>([])

onMounted(() => {
  marqueeList.value = [...props.data.low_cards]
})
const marqueeListLength = computed(() => (marqueeList.value.length < 6 ? 4 : marqueeList.value.length))
const marqueeWidth = computed(() => `${marqueeList.value.length * 25}vw`)
</script>

<style src="./s-site-marquee.scss" lang="scss" />
