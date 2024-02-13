<template>
  <div class="w-verification">
    <img class="w-verification__image" src="/img/verification.png" alt=""/>
    <h3 class="w-verification__title">Verification text</h3>
    <p class="w-verification__description">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat.
    </p>
    <a-button @click="onButtonClick" class="w-verification__button" text="CTA (If needed)"/>
  </div>
</template>

<script setup lang="ts">
import {useNuxtApp} from '#app'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'

definePageMeta({
  layout: 'site',
})

const {$app} = useNuxtApp()
</script>

<style lang="scss">
.w-verification {
  max-width: torem(410);
  margin: torem(60) auto 0 auto;
  font-family: Dm, sans-serif;
  text-align: center;

  &__image {
    margin-bottom: torem(32);
  }

  &__title {
    font-weight: 700;
    font-size: torem(32);
    line-height: torem(42);
    margin-bottom: torem(16);
  }

  &__description {
    font-weight: 400;
    font-size: torem(16);
    line-height: torem(21);
    margin-bottom: torem(16);
  }

  &__button {
    margin-top: torem(32);
  }
}
</style>
