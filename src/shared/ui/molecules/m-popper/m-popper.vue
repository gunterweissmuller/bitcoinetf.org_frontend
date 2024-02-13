<template>
  <Popper :class="[`popper--${type}`]" v-bind="$attrs" offsetDistance="6" arrow :show="show">
    <slot />
    <template #content>
      <div class="m-popper">
        <slot name="content">
          <div class="m-popper__head">
            <a-icon class="m-popper__head-icon" width="14" height="14" :name="Icon.MonoInfo" />
            <div class="m-popper__head-title">{{ title }}</div>
            <a-icon
              v-if="closeBtn"
              class="m-popper__head-close"
              width="18"
              height="18"
              :name="Icon.MonoActionClose"
              @click.stop="$emit('close')"
            />
          </div>
          <div class="m-popper__content">
            <div v-html="text" class="m-popper__text"></div>
          </div>
        </slot>
      </div>
    </template>
  </Popper>
</template>

<script setup lang="ts">
import Popper from 'vue3-popper'
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'

const props = withDefaults(
  defineProps<{
    title?: string
    text?: string
    fullSize?: boolean
    show?: boolean
    closeBtn?: boolean
    type?: 'default' | 'colorful'
  }>(),
  {
    closeBtn: false,
    show: null,
    fullSize: false,
    title: '',
    text: '',
    type: 'default',
  },
)
</script>

<style src="./m-popper.scss" lang="scss"></style>
