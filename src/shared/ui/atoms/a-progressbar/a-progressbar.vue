<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useNuxtApp } from '#app'

const props = defineProps({
  percents: {
    type: Number,
    default: 0,
  },

  title: {
    type: String,
    default: '',
  },

  additional: {
    type: String,
    default: '',
  },

  info: {
    type: String,
    default: '',
  },

  throttle: {
    type: Number,
    default: 200,
  },
  duration: {
    type: Number,
    default: 2e3,
  },

  isAutoProgress: {
    type: Boolean,
    default: false
  }
})

const componentKey = ref(1)

const emit = defineEmits(['loading', 'progress-finish'])

const indicator = useLoadingIndicator({
  duration: props.duration,
  throttle: props.throttle,
})

watch(() => indicator.progress.value, (time) => {
  if (time === 100 && props.isAutoProgress) {
    setTimeout(() => {
      componentKey.value -= 1
    }, props.duration)
  }
}, {
  deep: true
})


const progressbarPercents = computed(() => {
  if (props.isAutoProgress) {
    return indicator.progress.value < 0 ? 0 : indicator.progress.value > 100 ? 100 : indicator.progress.value
  } else {
    return props.percents < 0 ? 0 : props.percents > 100 ? 100 : props.percents
  }
})

if (props.isAutoProgress) {
  onMounted(() => {
    indicator.start()
  })
  onBeforeUnmount(() => indicator.clear)

}


function useLoadingIndicator(opts) {
  const progress = ref(0)
  const isLoading = ref(false)
  const step = computed(() => 1e4 / opts.duration)
  let _timer = null
  let _throttle = null

  function start() {
    clear()
    progress.value = 0
    isLoading.value = true
    if (opts.throttle) {
      if (process.client) {
        _throttle = setTimeout(_startTimer, opts.throttle)
      }
    } else {
      _startTimer()
    }
    emit('loading', false)
  }

  function finish() {
    progress.value = 100
    _hide()
  }

  function clear() {
    clearInterval(_timer)
    clearTimeout(_throttle)
    _timer = null
    _throttle = null
  }

  function _increase(num) {
    progress.value = Math.min(100, progress.value + num)
  }

  function _hide() {
    let timeout1 = 600
    let timeout2 = 800

    clear()
    if (process.client) {
      setTimeout(() => {
        isLoading.value = false
        setTimeout(() => {
          progress.value = 0
          emit('loading', true)
        }, timeout1)
      }, timeout2)
    }
  }

  function _startTimer() {
    if (process.client) {
      _timer = setInterval(() => {
        _increase(step.value)
      }, 100)
    }
  }

  return {
    progress,
    isLoading,
    start,
    finish,
    clear,
  }
}

</script>

<template>
  <div v-if="componentKey" class="a-progressbar">
    <div v-if="title || info" class="a-progressbar__header">
      <h4 v-if="title" class="a-progressbar__title font-button">{{ title }}</h4>
      <h4 v-if="info" class="a-progressbar__subtitle font-bodySmall" v-html="info" />
    </div>
    <div class="a-progressbar__wrapper">
      <div class="a-progressbar__percents" :style="{ width: `${progressbarPercents}%` }"></div>
    </div>
    <h4 v-if="additional" class="a-progressbar__additional" v-html="additional" />
  </div>
</template>

<style lang="scss">
@import 'a-progressbar.scss';
</style>
