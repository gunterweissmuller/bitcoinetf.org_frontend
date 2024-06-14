<template>
  <section class="s-site-earnings" :data-name="data.name">
    <div class="l-site-dark">
      <h2 v-html="data.title" class="s-site-earnings__title title-site-h1" />
      <div class="s-site-earnings__wrapper">
        <div class="s-site-earnings__imgs">
          <div class="s-site-earnings__img">
            <img :src="data.img_1" />
          </div>
          <div class="s-site-earnings__img">
            <img :src="data.img_2" />
          </div>
        </div>
        <div class="s-site-earnings__info">
          <div v-html="data.info.text" class="s-site-earnings__info-text" />
          <nuxt-link :to="`/personal/registration`">
            <a-button :text="data.info.btn.text" variant="primary2" />
          </nuxt-link>
        </div>
      </div>
      <div class="s-site-earnings__points">
        <div class="s-site-earnings__point" v-for="(point, id) in data.items" :key="id">
          <div class="s-site-earnings__point-number">{{ id + 1 }}</div>
          <div class="s-site-earnings__point-title">{{ point.title }}</div>
          <div class="s-site-earnings__point-text">{{ point.text }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import { useWindowSize } from '@vueuse/core'

defineProps<{
  data: any
  files?: any
}>()
</script>

<style src="./s-site-earnings.scss" lang="scss" />
