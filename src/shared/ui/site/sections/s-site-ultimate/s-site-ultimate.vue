<template>
  <section class="s-site-ultimate" :data-name="data.name">
    <div class="s-site-ultimate__container">
      <div class="s-site-ultimate__img">
        <img :src="data.img"/>
      </div>
      <div class="l-site-dark">
        <h2 v-html="data.title" class="s-site-ultimate__title title-site-h2"/>
        <div class="s-site-ultimate__content">
          <div class="s-site-ultimate__message">
            <!-- <div class="s-site-ultimate__message-text">{{ data.message }}11</div>
            <div class="s-site-ultimate__message-arrow">
              <img src="/img/site-dark/s-site-ultimate/arrow.svg" alt=""/>
            </div> -->
          </div>
          <div class="s-site-ultimate__info">
            <div v-html="data.info.text" class="s-site-ultimate__info-text" />
            <a-button :text="data.info.btn.text" variant="primary2" @click="goToRegistration" />
          </div>
        </div>
        <div class="s-site-ultimate__points">
          <div class="s-site-ultimate__point" v-for="(point, id) in data.points">
            <div class="s-site-ultimate__point-number">{{ id + 1 }}</div>
            <div class="s-site-ultimate__point-info">
              <div class="s-site-ultimate__point-title">{{ point.title }}</div>
              <div class="s-site-ultimate__point-text">{{ point.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'

defineProps<{
  data: any
  files?: any
}>()

const { $app } = useNuxtApp()
const router = useRouter()

function goToRegistration() {
  if ($app.store.auth.isUserAuthenticated) {
    
    router.push({ name: 'personal-more', query: { action: 'modal-credit-card' } })
    return
  }
  router.push('/personal/registration')
}
</script>

<style src="./s-site-ultimate.scss" lang="scss"/>
