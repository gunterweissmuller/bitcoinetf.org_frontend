<template>
  <section class="s-site-banner">
    <div class="l-site">
      <m-banner
        :background="data?.background"
        :title="data?.title"
        :description="data?.description"
        :img="files?.[0]?.real_path"
        :button_text="data?.button_text"
        :button_link="data?.button_link"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import MBanner from '~/src/shared/ui/site/molecules/m-banner/m-banner.vue'

defineProps<{
  data: any
  files: any
}>()
</script>

<style src="./s-site-banner.scss" lang="scss" />
