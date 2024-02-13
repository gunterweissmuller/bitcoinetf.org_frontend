<template>
  <div
    v-if="enabled"
    class="a-tooltip"
    :class="[tooltipClasses, tooltipPositionClasses]"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
  >
    <div
      ref="tooltipButton"
      class="a-tooltip__button"
      @click="!forceShowMode && tooltipOpenToggle(true)"
      @mouseenter="changeTooltipState(true)"
      @mouseleave="changeTooltipState(false)"
    >
      <slot />
    </div>
    <Transition name="a-tooltip__fade">
      <div v-show="tooltip.opened" ref="tooltipRef" class="a-tooltip__text font-caption-l" v-html="text" />
    </Transition>
  </div>
  <template v-else>
    <slot />
  </template>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useNuxtApp } from '#app'

const { $app } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    text?: string
    toggle?: boolean
    position?: 'left' | 'right' | 'top' | 'bottom'
    pin?: boolean
    forceShowMode?: boolean
    forceShow?: boolean
    enabled?: boolean
  }>(),
  {
    text: '',
    toggle: false,
    position: 'top',
    pin: false,
    forceShowMode: false,
    forceShow: false,
    enabled: true,
  },
)

const emit = defineEmits(['focus', 'blur'])

const defaultPosition = props.position.split(',')
const tooltipPositionsX = ['left', 'right']
const tooltipPositionsY = ['top', 'bottom']

const tooltip = reactive({
  opened: false,
  position: defaultPosition,
})

const tooltipButton = ref(null)
const isHovered = ref<boolean>(false)

if (props.forceShowMode) {
  watch(
    () => props.forceShow,
    (val) => {
      tooltipOpenToggle(val)
    },
  )
} else if (!props.toggle) {
  watch(
    () => isHovered.value,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        tooltipOpenToggle(newValue)
      }
    },
  )
}

let stopIntersectionObserver: any = null
let stopListenClickOutside: any = null

function changeTooltipState(state: boolean) {
  isHovered.value = state
}

function tooltipOpenToggle(open: boolean) {
  tooltip.opened = open
  if (tooltip.opened) {
    emit('focus')
    const { stop } = useIntersectionObserver(
      tooltipRef,
      ([{ isIntersecting }]) => {
        checkTooltipPosition(tooltip.opened, isIntersecting)
      },
      {
        rootMargin: '0px',
        threshold: 1,
      },
    )

    stopIntersectionObserver = stop

    if (props.toggle) {
      stopListenClickOutside = onClickOutside(tooltipButton, () => tooltipOpenToggle(false))
    }
  } else {
    if (stopIntersectionObserver) {
      stopIntersectionObserver()
      stopIntersectionObserver = null
    }
    if (stopListenClickOutside) {
      stopListenClickOutside()
      stopListenClickOutside = null
    }
    emit('blur')
  }
}

const tooltipRef = ref(null)

function checkTooltipPosition(opened: boolean, isVisible = true) {
  if (opened && !isVisible) {
    refreshTooltipPosition()
  }
}

function refreshTooltipPosition() {
  if (!tooltipRef.value) return
  const countsHiddenTooltip = $app.filters.getCountHiddenOutsideWindow(tooltipRef.value)
  const currentTooltipPositions = $app.filters.cloneDeep(tooltip.position)
  for (const keyHiddenPos in countsHiddenTooltip) {
    if (countsHiddenTooltip[keyHiddenPos] > 0) {
      currentTooltipPositions.map((itemCurrentPos: string, index: number, arrCurrentPos: Array<string>) => {
        if (itemCurrentPos !== keyHiddenPos) return false
        const tooltipDirection =
          itemCurrentPos === 'bottom' || itemCurrentPos === 'top' ? tooltipPositionsY : tooltipPositionsX
        const replacePosition: string = tooltipDirection.find((itemPos: string) => itemPos !== itemCurrentPos) || ''
        if (replacePosition !== '') {
          arrCurrentPos[index] = replacePosition
        }
        return true
      })
    }
  }
  tooltip.position = currentTooltipPositions
}

const tooltipPositionClasses = computed((positionClasses: Array<string> = []) => {
  tooltip.position.map((pos) => {
    return positionClasses.push(`a-tooltip--${pos}`)
  })
  return positionClasses
})

const tooltipClasses = computed(() => {
  return {
    'a-tooltip--pin': props.pin,
  }
})
</script>

<style lang="scss" src="./a-tooltip.scss" />
