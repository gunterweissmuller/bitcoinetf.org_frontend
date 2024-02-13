<template>
  <div class="w-theme page-max-width--small">
    <div class="w-theme__wrap">
      <div class="w-theme__title">Theme</div>
      <div class="w-theme__group">
        <div :class="['w-theme__group-radio', { 'w-theme__group-radio--active': selectedCurrency === 'light' }]">
          <a-radio v-model="selectedCurrency" name="currency" id="light" value="light" label="Light theme" />
        </div>
        <div :class="['w-theme__group-radio', { 'w-theme__group-radio--active': selectedCurrency === 'dark' }]">
          <a-radio v-model="selectedCurrency" name="currency" id="dark" value="dark" label="Dark theme" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ARadio from '~/src/shared/ui/atoms/a-radio/a-radio.vue'

const selectedCurrency = ref('')
const { $app } = useNuxtApp()

watch(selectedCurrency, (value) => {
  localStorage.setItem('theme', value)
  document.body.dataset.theme = value
  $app.store.user.theme = value
})

onMounted(() => {
  selectedCurrency.value = localStorage.getItem('theme') || 'dark'
})
</script>

<style src="./w-theme.scss" lang="scss" />
