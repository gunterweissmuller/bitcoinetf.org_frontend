<template>
  <section class="s-site-referrals-main">
    <div class="s-site-referrals-main__img">
      <img :src="data.img" alt="" />
    </div>
    <div class="l-site-dark">
      <div class="s-site-referrals-main__wrapper">
        <div class="s-site-referrals-main__left">
          <h1 v-html="data.title" class="s-site-referrals-main__title title-site-h1" />
        </div>
        <div class="s-site-referrals-main__right">
          <div class="s-site-referrals-main__avatars">
            <div class="s-site-referrals-main__avatar" v-for="(avatar, id) in data.avatars" :key="id">
              <img :src="avatar" alt="" />
            </div>
          </div>
          <div class="s-site-referrals-main__text">{{ data.text }}</div>
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

<style src="./s-site-referrals-main.scss" lang="scss" />
