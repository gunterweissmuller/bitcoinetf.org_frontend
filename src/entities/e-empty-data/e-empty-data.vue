<template>
  <div :class="['e-empty-data__empty', { 'e-empty-data__empty--small': small }]">
    <img class="e-empty-data__empty-pic" :src=" $app.store.user.theme === 'dark' ? '/img/cloud-dark.png' : '/img/cloud.png'" alt="empty" />
    <div class="e-empty-data__empty-title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    small?: boolean
  }>(),
  {
    title: 'You don’t have any events yet.',
    small: false,
  },
)
</script>

<style src="./e-empty-data.scss" lang="scss" />
