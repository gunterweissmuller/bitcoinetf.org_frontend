<template>
  <div class="a-snackbar" :class="`a-snackbar--${type}`">
    <div class="a-snackbar__text font-body">{{ text }}</div>
    <button type="button" class="a-snackbar__btn" @click="emit('close')">
      <a-icon :name="Icon.MonoActionClose" :width="16" :height="16"/>
    </button>
  </div>
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import {Icon} from '~/src/shared/constants/icons'

withDefaults(
  defineProps<{
    text?: string
    type: string
  }>(),
  {
    text: '',
    type: 'default',
  },
)

const emit = defineEmits(['close'])
</script>

<style lang="scss" src="./a-snackbar.scss"/>
