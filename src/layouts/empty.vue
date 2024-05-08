<template>
  <div class="l-main 123" :class="{ assets: route.name === 'personal-assets-symbol' }">
    <main class="l-main__content">
      <div class="l-container">
        <slot />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
