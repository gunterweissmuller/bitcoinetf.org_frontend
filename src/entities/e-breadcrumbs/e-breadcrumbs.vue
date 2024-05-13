<template>
  <div class="e-breadcrumbs">
    <div class="e-breadcrumbs__list">
      <template v-for="(crumb, idx) in list" :key="idx">
        <div v-if="idx === list.length - 1" class="e-breadcrumbs__item e-breadcrumbs__item--active">
          <span class="e-breadcrumbs__item-text">{{ getRouteLink(crumb).title || crumb }}</span>
        </div>
        <nuxt-link v-else :to="{ name: getRouteLink(crumb).link }" class="e-breadcrumbs__item">
          <span class="e-breadcrumbs__item-text">{{ getRouteLink(crumb).title }}</span>
          <a-icon
            class="e-breadcrumbs__item-icon"
            v-if="idx !== list.length - 1"
            :name="Icon.MonoChevronRight"
            width="18"
            height="18"
          />
        </nuxt-link>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import { useNuxtApp } from '#app'

interface IRoutes {
  title: string
  breadcrumbs: boolean
}

const { $app } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    routes: any
    breadcrumbs: string[] | null
  }>(),
  {
    routes: [],
    breadcrumbs: null,
  },
)

const route = useRoute()

const breadcrumbsList = route.path.split('/').slice(2)

const list = computed(() => {
  return props.breadcrumbs ? props.breadcrumbs : breadcrumbsList
})

const getRouteLink = (crumb) => {
  let route = {
    title: '',
    link: '',
  }

  for (let key in props.routes) {
    if (key.includes(crumb)) {
      route.title = props.routes[key].titleCrumb
      route.link = key
      break
    }
  }

  return route
}
</script>

<style src="./e-breadcrumbs.scss" lang="scss" />
