<template>
  <section class="s-site-act" :data-name="data.name">
    <div class="s-site-act__wrapper">
      <h2 v-html="data.title" class="s-site-act__title title-site-h1"/>
      <div class="s-site-act__content">
        <div class="s-site-act__right">
          <div class="s-site-act__arrow">
            <div class="s-site-act__arrow-text">{{ data.text }}</div>
            <div class="s-site-act__arrow-icon">
              <img src="/img/site-dark/s-site-act/arrow.svg"/>
            </div>
          </div>
          <div class="s-site-act__img">
            <img src="/img/site-dark/s-site-act/1.png"/>
          </div>
          <div class="s-site-act__timer">
            <div v-html="data.timer.text" class="s-site-act__timer-title" />
            <div class="s-site-act__timer-date">
              {{ months[dateStart.getMonth()] }} {{ dateStart.getDate() }}, {{ dateStart.getFullYear() }}
            </div>
            <div class="s-site-act__timer-days">
              <div class="s-site-act__timer-day" v-for="day in dayLeft">{{ day }}</div>
            </div>
            <div class="s-site-act__timer-description">
              <div class="s-site-act__timer-description--text">Days left</div>
              <div class="s-site-act__timer-description--back"></div>
            </div>
          </div>
        </div>
        <div class="s-site-act__info">
          <div v-html="data.info.text" class="s-site-act__info-text"/>
          <nuxt-link :to="`/personal/registration`">

            <a-button variant="secondary" :text="data.info.btn.text"/>
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'

const props = defineProps<{
  data: any
  files: any
}>()

const date = new Date();
const dateStart = new Date(props.data.timer.date);
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayLeft = Math.round((dateStart.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)).toString();
</script>

<style src="./s-site-act.scss" lang="scss"/>
