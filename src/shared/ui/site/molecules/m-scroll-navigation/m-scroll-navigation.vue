<template>
  <div
    v-if="Object.entries(data).length !== 0 && data?.id !== 0"
    class="m-scroll-navigation"
    :class="{ hidden: hiddenMobile }"
  >
    <div class="m-scroll-navigation__indicator">
      <div class="m-scroll-navigation__circle">
        <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <circle fill="transparent" cx="50" cy="50" r="24" stroke="#FFFFFF33"></circle>
        </svg>
      </div>
      <div class="m-scroll-navigation__circle">
        <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <circle
            fill="transparent"
            stroke-linecap="round"
            cx="50"
            cy="50"
            r="24"
            :stroke-dasharray="2 * 3.14 * 24"
            :stroke-dashoffset="`${2 * 3.14 * 24 * ((100 - (data.id / length) * 100) / 100)}px`"
            stroke="#FFFFFF"
          ></circle>
        </svg>
      </div>
      <div v-if="data.id < length" class="m-scroll-navigation__indicator-text">{{ data.id }}</div>
      <div v-else class="m-scroll-navigation__indicator-text">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M21.9445 8.39385C22.2401 8.69649 22.2401 9.18718 21.9445 9.48982L12.0648 19.6065C11.7692 19.9092 11.29 19.9092 10.9944 19.6065L6.05455 14.5482C5.75899 14.2455 5.75899 13.7549 6.05455 13.4522C6.3501 13.1496 6.8293 13.1496 7.12486 13.4522L11.5296 17.9626L20.8742 8.39385C21.1698 8.0912 21.649 8.0912 21.9445 8.39385Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M22.2784 8.0678C22.751 8.55175 22.751 9.33192 22.2784 9.81587L12.3986 19.9326C11.92 20.4227 11.1392 20.4227 10.6606 19.9326L5.72068 14.8742C5.24806 14.3903 5.24806 13.6101 5.72068 13.1262C6.19933 12.636 6.98007 12.636 7.45873 13.1262L11.5296 17.2946L20.5404 8.0678C21.019 7.57766 21.7998 7.57766 22.2784 8.0678ZM11.5296 17.9626L7.12486 13.4522C6.8293 13.1496 6.3501 13.1496 6.05455 13.4522C5.75899 13.7549 5.75899 14.2455 6.05455 14.5482L10.9944 19.6065C11.29 19.9092 11.7692 19.9092 12.0648 19.6065L21.9445 9.48982C22.2401 9.18718 22.2401 8.69649 21.9445 8.39385C21.649 8.0912 21.1698 8.0912 20.8742 8.39385L11.5296 17.9626Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
    <div class="m-scroll-navigation__name">{{ data.name }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: {
    type: Object,
    default: {},
  },

  length: {
    type: Number,
    default: 0,
  },
  hiddenMobile: {
    type: Boolean,
    default: false,
  },
})
</script>

<style src="./m-scroll-navigation.scss" lang="scss" />
