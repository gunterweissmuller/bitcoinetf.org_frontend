<template>
  <div class="m-site-tabs">
    <div
      class="m-site-tabs__item"
      :class="{ active: activeTab === id }"
      v-for="(tab, id) in tabs"
      :key="id"
      @click="getActive(id, tab)"
    >
      {{ tab }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['get-active'])

defineProps({
  tabs: {
    type: String,
    default: '',
  },
});

const activeTab = ref(0);

const getActive = (id, value) => {
  activeTab.value = id;
  emit('get-active', value);
};
</script>

<style src="./m-site-tabs.scss" lang="scss" />
