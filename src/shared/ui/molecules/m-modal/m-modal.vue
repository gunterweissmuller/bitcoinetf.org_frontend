<template>
  <Teleport to="body">
    <div v-if="isShowFullScreen" :class="['m-modal-mask', { 'm-modal-fullscreen': fullScreen, 'm-modal-kyc': kyc, 'm-modal-small': modalSmall}]">
      <div :class="['m-modal-wrapper', { 'm-modal-wrapper-basic': bgBasic }]">
        <div ref="modalRef" :class="['m-modal-container', { 'm-modal-container-big': modalBig }, { 'm-modal-container-basic': bgBasic } , $attrs.class]">
          <slot />
        </div>
      </div>
    </div>
    <template v-if="isMobile && isPageFinished && !modalSmall">
      <client-only>
        <m-modal-mobile
          v-show="isMobile && !fullScreen"
          :transition-duration="1"
          :class="$attrs.class"
          :max-width="maxWidth"
          :max-height="maxHeight"
          @closing="onClose"
          ref="myBottomSheet"
        >
          <slot />
        </m-modal-mobile>
      </client-only>
    </template>
  </Teleport>
</template>

<script setup lang="ts">
  import useMediaDevice from '~/composables/useMediaDevice'
  import { ref, watch } from 'vue'
  import { onClickOutside } from '@vueuse/core'
  import { useNuxtApp } from '#app'
  import MModalMobile from '~/src/shared/ui/molecules/m-modal-mobile/m-modal-mobile.vue'

  const props = withDefaults(
    defineProps<{
      modelValue: boolean
      fullScreen?: boolean
      maxWidth?: number | undefined
      maxHeight?: number | undefined
      kyc?: boolean
      bgBasic?: boolean
      modalSmall?: boolean
      modalBig?: boolean
    }>(),
    {
      modelValue: false,
      fullScreen: false,
      maxWidth: undefined,
      maxHeight: undefined,
      kyc: false,
      bgBasic: false,
      modalSmall: false,
      modalBig: false,
    },
  )

  const emit = defineEmits(['update:modelValue', 'close'])

  const { isMobile } = useMediaDevice()

  const myBottomSheet = ref()

  const modalRef = ref(null)

  const isPageFinished = ref(false)

  const closeModal = () => {
    isOpenModal.value = false
    emit('close')
  }

  const isOpenModal = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emit('update:modelValue', value)
    },
  })

  const isShowFullScreen = computed(() => {
    if (!props.fullScreen) {
      if(props.modalSmall) {
        return isOpenModal.value
      } else {
        return !isMobile.value && isOpenModal.value
      }
    } else {
      return isOpenModal.value
    }
  })

  onClickOutside(modalRef, closeModal)

  const onClose = () => {
    isOpenModal.value = false
    emit('close')
  }

  watch(
    () => props.modelValue,
    (value) => {
      if (value) {
        document.body.classList.add('no-scroll')
      } else {
        document.body.classList.remove('no-scroll')
      }
      if (isMobile.value && !props.fullScreen) {
        value ? myBottomSheet.value?.open() : myBottomSheet.value?.close()
      }
    },
  )

  useNuxtApp().hook('page:finish', (): void => {
    isPageFinished.value = true
  })

  watch(isOpenModal, (boolean) => {
    const chatTemplate = document.querySelector('#chatbot-chat')

    if (!boolean) {
      const modal = document.querySelector('.bottom-sheet__main')
      if (modal) {
        modal.scrollTo(0, 0)
      }
    }

    if (chatTemplate) {
      if (boolean) {
        chatTemplate.classList.add('hidden')
      } else {
        chatTemplate.classList.remove('hidden')
      }
    }
  })


</script>

<style src="./m-modal.scss" lang="scss" />
