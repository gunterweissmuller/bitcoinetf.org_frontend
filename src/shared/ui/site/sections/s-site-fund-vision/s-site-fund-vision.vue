<template>
  <section class="s-site-fund-vision" :data-name="data.name">
    <div class="s-site-fund-vision__wrapper">
      <h2 v-html="data.title" class="s-site-fund-vision__title title-site-h1"/>
      <div class="s-site-fund-vision__content">
        <div class="s-site-fund-vision__info">
          <div v-html="data.info.text" class="s-site-fund-vision__info-text"/>
        </div>
      </div>
      <div class="s-site-fund-vision__img">
        <img :src="data.img"/>
      </div>
      <div class="s-site-fund-vision__points">
        <div class="s-site-fund-vision__point">
          <div class="s-site-fund-vision__point-number">1</div>
          <div class="s-site-fund-vision__point-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="49" viewBox="0 0 38 49" fill="none"
                 data-v-inspector="src/shared/ui/site/sections/s-site-main/s-site-main.vue:28:19">
              <path
                d="M34.1252 18.9278C33.7374 14.5601 29.9804 13.0694 25.2265 12.6179L25.2706 6.56362L21.5854 6.53709L21.5426 12.4318C20.5738 12.4248 19.5834 12.4367 18.5994 12.4492L18.6433 6.51547L14.9601 6.48846L14.9146 12.541C14.1166 12.5514 13.3329 12.5605 12.5689 12.5554L12.5686 12.5367L7.48586 12.4978L7.45809 16.4337C7.45809 16.4337 10.1798 16.4017 10.1342 16.4515C11.6269 16.4628 12.1064 17.333 12.2422 18.0818L12.1922 24.9788C12.2952 24.9801 12.4295 24.9854 12.5815 25.0074C12.4588 25.0066 12.3274 25.0048 12.1922 25.005L12.1207 34.6671C12.0518 35.1364 11.7702 35.8834 10.7273 35.8776C10.7742 35.9197 8.04848 35.8573 8.04848 35.8573L7.28413 40.253L12.0798 40.2878C12.9723 40.2954 13.8503 40.3169 14.7123 40.3287L14.6692 46.4519L18.3504 46.4794L18.3945 40.4209C19.4051 40.4492 20.3832 40.4644 21.3381 40.4705L21.2925 46.501L24.9777 46.5275L25.0235 40.4152C31.2216 40.105 35.5692 38.5758 36.1502 32.7618C36.6191 28.0802 34.4307 25.9737 30.9199 25.1035C33.0645 24.0311 34.4143 22.1239 34.1252 18.9278ZM28.8738 31.983C28.8424 36.5588 21.0111 35.9812 18.5136 35.9653L18.5738 27.8525C21.072 27.8713 28.909 27.2102 28.8738 31.983ZM27.2435 20.5243C27.2119 24.6875 20.6811 24.1539 18.6008 24.1389L18.6547 16.7809C20.735 16.796 27.2747 16.1821 27.2435 20.5243Z"
                fill="#F1F2F4"
                data-v-inspector="src/shared/ui/site/sections/s-site-main/s-site-main.vue:29:21"></path>
            </svg>
            {{
              $app.filters.rounded($app.store.user.statistic?.dividends_earned_btc, 2)
            }}
          </div>
          <div class="s-site-fund-vision__point-text">Total BTC paid as dividends</div>
        </div>
        <div class="s-site-fund-vision__point">
          <div class="s-site-fund-vision__point-number">2</div>
          <div class="s-site-fund-vision__point-title">${{
              $app.filters.rounded($app.store.user.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2)
            }}
          </div>
          <div class="s-site-fund-vision__point-text">Total USD paid as dividends</div>
        </div>
        <div class="s-site-fund-vision__point">
          <div class="s-site-fund-vision__point-number">3</div>
          <div class="s-site-fund-vision__point-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="49" viewBox="0 0 38 49" fill="none"
                 data-v-inspector="src/shared/ui/site/sections/s-site-main/s-site-main.vue:28:19">
              <path
                d="M34.1252 18.9278C33.7374 14.5601 29.9804 13.0694 25.2265 12.6179L25.2706 6.56362L21.5854 6.53709L21.5426 12.4318C20.5738 12.4248 19.5834 12.4367 18.5994 12.4492L18.6433 6.51547L14.9601 6.48846L14.9146 12.541C14.1166 12.5514 13.3329 12.5605 12.5689 12.5554L12.5686 12.5367L7.48586 12.4978L7.45809 16.4337C7.45809 16.4337 10.1798 16.4017 10.1342 16.4515C11.6269 16.4628 12.1064 17.333 12.2422 18.0818L12.1922 24.9788C12.2952 24.9801 12.4295 24.9854 12.5815 25.0074C12.4588 25.0066 12.3274 25.0048 12.1922 25.005L12.1207 34.6671C12.0518 35.1364 11.7702 35.8834 10.7273 35.8776C10.7742 35.9197 8.04848 35.8573 8.04848 35.8573L7.28413 40.253L12.0798 40.2878C12.9723 40.2954 13.8503 40.3169 14.7123 40.3287L14.6692 46.4519L18.3504 46.4794L18.3945 40.4209C19.4051 40.4492 20.3832 40.4644 21.3381 40.4705L21.2925 46.501L24.9777 46.5275L25.0235 40.4152C31.2216 40.105 35.5692 38.5758 36.1502 32.7618C36.6191 28.0802 34.4307 25.9737 30.9199 25.1035C33.0645 24.0311 34.4143 22.1239 34.1252 18.9278ZM28.8738 31.983C28.8424 36.5588 21.0111 35.9812 18.5136 35.9653L18.5738 27.8525C21.072 27.8713 28.909 27.2102 28.8738 31.983ZM27.2435 20.5243C27.2119 24.6875 20.6811 24.1539 18.6008 24.1389L18.6547 16.7809C20.735 16.796 27.2747 16.1821 27.2435 20.5243Z"
                fill="#F1F2F4"
                data-v-inspector="src/shared/ui/site/sections/s-site-main/s-site-main.vue:29:21"></path>
            </svg>
            {{
              $app.filters.rounded(fundTotalBtc, 2)
            }}
          </div>
          <div class="s-site-fund-vision__point-text">BTC in Reserve Fund</div>
        </div>
        <div class="s-site-fund-vision__point">
          <div class="s-site-fund-vision__point-number">4</div>
          <div class="s-site-fund-vision__point-title">${{
              $app.filters.rounded(fundTotalUsd, 0)
            }}
          </div>
          <div class="s-site-fund-vision__point-text">Assets Under Management</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import { computed } from 'vue'

defineProps<{
  data: any
  files: any
}>()

const { $app } = useNuxtApp()

const fundTotalBtc = computed(() => {
  return $app.store.assets.fundTotalBtc
})

const fundTotalUsd = computed(() => {
  return $app.store.user.fundTotalUsd
})

</script>

<style src="./s-site-fund-vision.scss" lang="scss"/>
