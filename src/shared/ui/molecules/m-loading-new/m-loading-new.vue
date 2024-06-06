<template>
  <div class="a-loading-new">
    <div class="a-loading-new__circle a-loading-new__circle-blue a-loading-new__circle-1"></div>
    <div class="a-loading-new__circle a-loading-new__circle-grey a-loading-new__circle-2"></div>
    <div class="a-loading-new__circle a-loading-new__circle-blue a-loading-new__circle-3"></div>
    <div class="a-loading-new__circle a-loading-new__circle-grey a-loading-new__circle-4"></div>
  </div>
</template>

<script lang="ts" setup>
import { useNuxtApp } from '#app'
import { computed, onBeforeUnmount, ref } from 'vue'
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import AProgressbar from '~/src/shared/ui/atoms/a-progressbar/a-progressbar.vue'
import { useRoute } from 'vue-router'

const emit = defineEmits(['loading'])
const route = useRoute()

const { $app } = useNuxtApp()

const props = defineProps({
  throttle: {
    type: Number,
    default: 200,
  },
  duration: {
    type: Number,
    default: 2e3,
  },
})

const indicator = useLoadingIndicator({
  duration: props.duration,
  throttle: props.throttle,
})

const getLogo = computed(() => {
  return $app.store.user.theme === 'dark' ? Icon.ColorfulBtcDarkLogo : Icon.ColorfulBitcoinFull
})

const nuxtApp = useNuxtApp()

nuxtApp.hook('page:start', indicator.start)
nuxtApp.hook('page:finish', indicator.finish)
onBeforeUnmount(() => indicator.clear)

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
    let timeout1
    let timeout2

    if (route.name?.includes('personal-more')) {
      timeout1 = 200
    } else if (route.name?.includes('wallet')) {
      timeout1 = 800
    } else {
      timeout1 = 600
    }

    if (route.name?.includes('personal-more')) {
      timeout2 = 300
    } else if (route.name?.includes('wallet')) {
      timeout2 = 1000
    } else {
      timeout2 = 800
    }
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

<style src="./m-loading-new.scss" lang="scss" />
