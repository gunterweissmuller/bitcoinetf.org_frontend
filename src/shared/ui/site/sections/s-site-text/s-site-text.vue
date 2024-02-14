<template>
  <section v-if="data?.tiptap_redactor" class="s-site-text">
    <div class="l-site">
      <div v-html="data?.tiptap_redactor" class="s-site-text__wrapper" />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  data: {
    type: String,
    default: '',
  },
})
</script>

<style src="./s-site-text.scss" lang="scss" />
