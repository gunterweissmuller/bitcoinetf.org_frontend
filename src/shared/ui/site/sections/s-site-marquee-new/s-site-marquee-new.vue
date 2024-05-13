<template>
  <div class="s-site-marquee enable-animation" :class="{ 's-site-marquee-bg': isBackground }">
    <ul class="s-site-marquee__row">
      <li
        class="s-site-marquee__item"
        v-for="(marquee, index) in marqueeList"
        :key="marquee.link"
        :style="customStylesElementIndex(index)"
      >
        <a :href="marquee.link" target="_blank">
          <nuxt-img :src="marquee.img" loading="lazy" />
        </a>
      </li>
    </ul>

    <ul aria-hidden="true" class="s-site-marquee__row">
      <li
        class="s-site-marquee__item"
        v-for="(marquee, index) in marqueeList"
        :key="marquee.link"
        :style="customStylesElementIndex(index)"
      >
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
  customStyles?: string
  customElementIndex?: number
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
const customStylesElementIndex = computed(
  () =>
    (index: number): string =>
      index == props.customElementIndex && props.customStyles ? props.customStyles : '',
)
</script>

<style src="./s-site-marquee-new.scss" lang="scss" />
