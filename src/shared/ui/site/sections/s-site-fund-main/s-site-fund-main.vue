<template>
  <section class="s-site-fund-main">
    <h1 v-html="data.title" class="s-site-fund-main__title title-site-h2"/>
    <div class="s-site-fund-main__img">
      <img :src="data.img" alt="">
    </div>
    <div class="l-site-dark">
      <div class="s-site-fund-main__wrapper">
        <!-- <div class="s-site-fund-main__left">
          <div class="s-site-fund-main__message">
            <div class="s-site-fund-main__message-text">{{ data.message }}</div>
            <div class="s-site-fund-main__message-arrow">
              <img src="/img/site-dark/s-site-fund-main/arrow.svg" alt="">
            </div>
          </div>
        </div> -->
        <div class="s-site-fund-main__right">
          <div class="s-site-fund-main__text">{{ data.text }}</div>
          <nuxt-link to="/personal/registration">
            <a-button :text="data.btn.text"/>
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

<style src="./s-site-fund-main.scss" lang="scss"/>
