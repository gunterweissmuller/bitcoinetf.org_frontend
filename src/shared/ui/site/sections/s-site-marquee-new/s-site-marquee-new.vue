<template>
  <div class="s-site-marquee enable-animation" :class="{ 's-site-marquee-bg': isBackground }">
    <ul class="s-site-marquee__row">
      <li class="s-site-marquee__item" v-for="marquee in marqueeList" :key="marquee.link">
        <a :href="marquee.link" target="_blank">
          <nuxt-img :src="marquee.img" loading="lazy" />
        </a>
      </li>
    </ul>

    <ul aria-hidden="true" class="s-site-marquee__row">
      <li class="s-site-marquee__item" v-for="marquee in marqueeList" :key="marquee.link">
        <a :href="marquee.link" target="_blank">
          <nuxt-img :src="marquee.img" loading="lazy" />
        </a>
      </li>
    </ul>
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
// const marqueeListLength = computed(() => (marqueeList.value.length < 6 ? 4 : marqueeList.value.length))
// const marqueeWidth = computed(() => `${marqueeList.value.length * 25}vw`)
</script>

<style src="./s-site-marquee-new.scss" lang="scss" />
