<template>
  <section class="s-site-fund-ceo" :data-name="data.name">
    <div class="s-site-fund-ceo__container">
      <div class="l-site-dark">
        <h2 v-html="data.title" class="s-site-fund-ceo__title title-site-h2"/>
        <div class="s-site-fund-ceo__content">
          <div class="s-site-fund-ceo__img">
            <img :src="data.img"/>
          </div>
          <!-- <div class="s-site-fund-ceo__message">
            <div class="s-site-fund-ceo__message-text">{{ data.message }}</div>
            <div class="s-site-fund-ceo__message-arrow">
              <img src="/img/site-dark/s-site-fund-ceo/arrow.svg" alt=""/>
            </div>
          </div> -->
          <div class="s-site-fund-ceo__info">
            <div v-html="data.info.text" class="s-site-fund-ceo__info-text"/>
            <nuxt-link to="/personal/registration">
              <a-button :text="data.info.btn.text"/>
            </nuxt-link>
          </div>
        </div>
        <div class="s-site-fund-ceo__points">
          <div class="s-site-fund-ceo__point" v-for="(point, id) in data.points">
            <div class="s-site-fund-ceo__point-number">{{ id + 1 }}</div>
            <div class="s-site-fund-ceo__point-info">
              <div class="s-site-fund-ceo__point-title">{{ point.title }}</div>
              <div class="s-site-fund-ceo__point-text">{{ point.text }}</div>
            </div>
          </div>
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

<style src="./s-site-fund-ceo.scss" lang="scss"/>
