<template>
  <div v-if="isOpen" class="shadow" />
  <div class="open-sidebar" @click="isOpen = !isOpen">
    <a-icon :name="arrowLeft" />
  </div>
  <m-site-sidebar
    ref="sidebar"
    :active="active"
    :title="title"
    :menu="menu"
    :isOpen="isOpen"
    @click-link="isOpen = false"
  />

  <s-site-tutorials @get-active="getActive" :data="Object.values(data)" />
</template>

<script setup lang="ts">
import SSiteTutorials from '~/src/shared/ui/site/sections/s-site-tutorials/s-site-tutorials.vue'
import MSiteSidebar from '~/src/shared/ui/site/molecules/m-site-sidebar/m-site-sidebar.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import { useNuxtApp } from '#app'
useSeoMeta({
  title: 'Bitcoin Investment Tutorials | BitcoinETF.org - Guiding Your Crypto Journey',
  description:'Master your Bitcoin investment strategy with BitcoinETF.org tutorials. Learn self-custody, industry insights, and secure your digital assets with expert guidance.'
})
const { $app } = useNuxtApp()

const emit = defineEmits(['get-active'])
const sidebar = ref(null)

onClickOutside(sidebar, () => {
  if (isOpen.value) {
    isOpen.value = false
  }
})

definePageMeta({
  layout: 'site-tutorials',
})

const arrowLeft = Icon.MonoNavigationArrowLeft

const title = 'Tutorials'

const isOpen = ref(false)

const menu = ref<any>({}) // {Account: [...items]}

const data = ref({})

const active = ref('')

const getActive = (value: any) => {
  active.value = value
}

watch(isOpen, (value) => {
  document.querySelector('html').classList.toggle('no-scroll-tutor', value)
})

const { data: sections, pending } = useAsyncData('tutorials', async () => {
  return await $app.api.eth.pages.getPageInfo('tutorials').then((resp) => {
    let currentTitleKey
    resp.sections.forEach((section) => {
      if (section.data.heading_name) {
        currentTitleKey = section.data.title

        // Menu
        if (!menu.value?.[section?.data?.heading_name]) {
          menu.value[section.data.heading_name] = []
        }

        menu.value?.[section?.data?.heading_name].push({
          text: section.data.title,
          ref: $app.filters.kebabCase(section.data.title),
        })

        // Content
        if (!data.value?.[section?.data?.title]) {
          data.value[section.data.title] = {}
          data.value[section.data.title].items = []
        }

        data.value[section.data.title].title = section.data.title
        data.value[section.data.title].description = section.data.description
      } else {
        data.value[currentTitleKey].items.push({
          img: section.files[0]?.real_path,
          title: section.data.title,
          description: section.data.description,
        })
      }
    })

    active.value = Object.values(data.value)[0].title

    return resp.sections
  })
})
</script>

<style lang="scss">
.no-scroll {
  height: 100%;
  min-height: 100vh;
}

.open-sidebar {
  position: fixed;
  top: torem(124);
  left: torem(8);
  z-index: 2;
  display: none;
  color: var(--accent-primary);
  background: var(--surfaces-surface-1);
  padding: torem(8);
  border-radius: 100%;
  font-size: torem(18);
  box-shadow: var(--popper-theme-box-shadow);
  transform: rotate(180deg);

  @media (max-width: 767px) {
    display: block;
  }
}

.shadow {
  position: fixed;
  top: torem(64);
  left: 0;
  z-index: 1;
  display: none;
  width: 100%;
  height: 100%;
  background: var(--system);
  opacity: 0.4;

  @media (max-width: 767px) {
    display: block;
  }
}
</style>
