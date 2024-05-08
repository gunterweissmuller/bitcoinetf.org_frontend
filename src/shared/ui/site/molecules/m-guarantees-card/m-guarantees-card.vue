<template>
  <div class="guarantees-card">
    <p class="guarantees-card__label">{{ label }}</p>
    <p class="guarantees-card__title">{{ title }}</p>
    <p class="guarantees-card__capital">{{ capital }}</p>
    <p class="guarantees-card__cost">{{ cost }}</p>
    <p v-if="currentBalance" class="guarantees-card__current_balance">Current Balance <span><NuxtImg class="s-site-main__title_icon aspect-square w-[14px]" src="/img/icons/colorful/live-data.svg" width="14" height="14" loading="lazy"/> <div>LIVE DATA</div></span></p>
    <p class="guarantees-card__body_text">
      {{ body }}
    </p>
    <button @click="$emit('click')" class="guarantees-card__button">{{ textButton }}</button>
  </div>
</template>

<script setup lang="ts">

  defineProps({
    label: '',
    title: '',
    cost: '',
    body: '',
    capital: '',
    currentBalance: true,
    textButton: '',
  })
  
  defineEmits(['click'])
  
</script>

<style src="./m-guarantees-card.scss" lang="scss" />
