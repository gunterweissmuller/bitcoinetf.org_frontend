<template>
  <div class="s-site-marquee">
    <div :class="[{ 's-site-marquee-bg': isBackground }]"></div>

    <div class="s-site-marquee__wrapper">
      <div class="s-site-marquee__row" v-for="index in 9">
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
</script>

<style src="./s-site-marquee.scss" lang="scss" />
