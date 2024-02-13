<template>
  <w-header-auth/>
  <main>
    <slot/>
  </main>
</template>

<script setup lang="ts">
import WHeaderAuth from "~/src/widgets/layouts/w-header-auth/w-header-auth.vue";
</script>

<style lang="scss"></style>
