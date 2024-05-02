<template>
  <div class="e-header-links">
    <div class="e-header-links__title">
      <span class="e-header-links__title-title">{{ title }}</span>
      <a-icon
        width="22"
        height="22"
        v-if="routeNames?.[route?.name]?.info"
        class="e-header-links__title-icon"
        :name="Icon.MonoInfo"
        @click="emit('open-modal')"
      />
    </div>
    <div v-if="routesList.length" class="e-header-links__list">
      <div v-for="(link, idx) in routesList" :key="idx" :id="`${link.name}-tab`">
        <nuxt-link class="e-header-links__item" :to="{ name: link.name }" active-class="e-header-links__item--active">
          {{ link.text }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '~/src/shared/constants/icons'

interface ILinkItem {
  text: string
  name: string
  breadcrumbs: boolean
}

import { useRoute } from 'vue-router'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'

const route = useRoute()

const emit = defineEmits(['open-modal'])

const props = defineProps<{
  title: string
  routesList: ILinkItem[]
  routeNames: any[]
}>()

</script>

<style src="./e-header-links.scss" lang="scss" />
