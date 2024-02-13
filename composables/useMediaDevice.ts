import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'
import { Breakpoints } from '~/src/shared/constants/breakpoints'

const { width } = useWindowSize()

const isMobile = computed<boolean>(() => (
  width.value < Breakpoints.Tablet
))

const isTablet = computed<boolean>(() => (
  width.value >= Breakpoints.Tablet && width.value < Breakpoints.Laptop
))

const isLaptop = computed<boolean>(() => (
  width.value >= Breakpoints.Laptop && width.value < Breakpoints.Desktop
))


const isDesktop = computed<boolean>(() => {
  return width.value >= Breakpoints.Desktop
})

export default function() {
  return {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
  }
}
