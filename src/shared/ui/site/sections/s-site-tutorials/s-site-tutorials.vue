<template>
  <section class="s-site-tutorials">
    <div
      class="s-site-tutorials__item"
      v-for="(tutorial, id) in data"
      :key="id"
      :id="tutorial.title.toLowerCase().replaceAll(' ', '-')"
    >
      <div class="s-site-tutorials__title site-title-h3">{{ tutorial.title }}</div>
      <div class="s-site-tutorials__item-description">{{ tutorial.description }}</div>
      <div class="s-site-tutorials__steps">
        <div class="s-site-tutorials__step" v-for="(item, idx) in tutorial.items" :key="idx">
          <div class="s-site-tutorials__step-img">
            <img :src="item.img">
          </div>
          <div class="s-site-tutorials__step-info">
            <div class="s-site-tutorials__step-title">{{ item.title }}</div>
            <div v-html="item.description" class="s-site-tutorials__step-description" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useWindowScroll } from '@vueuse/core';

const { y } = useWindowScroll();
const emit = defineEmits(['get-active'])

const props = defineProps({
  data: {
    type: [String, Array],
    default: '',
  }
});

const getActive = (scrollPosition) => {
  const items = document.querySelectorAll('.s-site-tutorials__item');

  items.forEach((item, index) => {
    if (scrollPosition.value >= item.offsetTop - 100) {
      emit('get-active', props.data[index].title);
    }
  });
};

watch(y, () => {
  getActive(y);
});
</script>

<style src="./s-site-tutorials.scss" lang="scss" />
