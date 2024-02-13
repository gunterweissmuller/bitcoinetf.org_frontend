<template>
  <div class="m-site-sidebar" :class="{ open: isOpen }">
    <div class="m-site-sidebar__title">{{ title }}</div>
    <div class="m-site-sidebar__menu">
      <div class="m-site-sidebar__menu-item" v-for="(items, title) in menu" :key="title">
        <div class="m-site-sidebar__menu-caption">{{ title }}</div>
        <a
          :class="{ active: link.text.toLowerCase() === active.toLowerCase() }"
          :href="`#${link.ref}`"
          v-for="(link, idx) in items"
          :key="idx"
          @click.prevent="clickOnLink(link)"
        >
          {{ link.text }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { width } = useWindowSize()

defineProps({
  title: {
    type: String,
    default: '',
  },

  menu: {
    type: [Array, Object],
    default: () => {
      return []
    },
  },

  active: {
    type: String,
    default: '',
  },

  isOpen: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['click-link'])

const clickOnLink = (link) => {
  emit('click-link')
  setTimeout(() => {
    scrollTo(link.ref)
  }, 0)
}

const scrollTo = (link) => {
  const tutorial = document.querySelector(`#${link}`)
  const headerHeight = width > 1099 ? 98 : 64

  window.scrollTo({ behavior: 'smooth', top: tutorial.offsetTop - headerHeight })
}
</script>

<style src="./m-site-sidebar.scss" lang="scss" />
