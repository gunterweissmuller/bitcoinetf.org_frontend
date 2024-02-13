<template>
  <component v-for="section in sections" :is="section.name" :data="section?.data" :files="section?.files" />
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'

definePageMeta({
  layout: 'site-texts',
})

const { $app } = useNuxtApp()
const { data: sections, pending } = useAsyncData('privacy', async () => {
  return await $app.api.eth.pages.getPageInfo('privacy').then((resp) => {
    return resp.sections
  })
})
</script>
