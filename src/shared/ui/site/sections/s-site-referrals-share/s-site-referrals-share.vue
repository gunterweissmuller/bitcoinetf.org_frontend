<template>
  <section class="s-site-referrals-share" :data-name="data.name">
    <div class="l-site-dark">
      <div class="s-site-referrals-share__wrapper">
        <div class="s-site-referrals-share__left">
          <h1 v-html="data.title" class="s-site-referrals-share__title title-site-h1" />
          <nuxt-link to="/personal/registration">
            <a-button :text="data.btn.text" />
          </nuxt-link>
        </div>
        <div class="s-site-referrals-share__img">
          <img :src="data.img" alt="" />
        </div>
        <div class="s-site-referrals-share__info">
          <div class="s-site-referrals-share__info-title">{{ data.info.title }}</div>
          <div v-html="data.info.text" class="s-site-referrals-share__info-text" />
          <nuxt-link to="/personal/registration">
            <a-button :text="data.btn.text" />
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'

defineProps<{
  data: any
  files: any
}>()
</script>

<style src="./s-site-referrals-share.scss" lang="scss" />
