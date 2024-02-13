<template>
  <div ref="refModal">
    <button v-if="button" @click="openModal" class="f-refer-friends" type="button">
      <div class="f-refer-friends-info">
        <div class="f-refer-friends-info-title">Refer Friends, Get 5% Forever! 💸</div>
        <div class="f-refer-friends-info-text">
          Tell friends about BitcoinETF. You get 5% of what they buy, always. They get better rates too!🚀💸
        </div>
      </div>
      <a-icon width="18" height="18" class="f-refer-friends-chevron" :name="Icon.MonoChevronRight" />
    </button>
    <e-referral-share-modal v-if="modal" :model-value="modalVisible" @update:modelValue="updateModalVisible" />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import EReferralShareModal from '~/src/entities/e-referral-share-modal/e-referral-share-modal.vue'

const isOpenModal = ref(false)

const refModal = ref(null)

const emit = defineEmits(['click', 'update'])

const props = withDefaults(
  defineProps<{
    show?: boolean
    button?: boolean
    modal?: boolean
  }>(),
  {
    button: true,
    modal: true,
    show: null,
  },
)

const openModal = () => {
  isOpenModal.value = true
  emit('click')
}

const updateModalVisible = (isVisible) => {
  isOpenModal.value = isVisible
  emit('update', isVisible)
}

const modalVisible = computed(() => {
  return props.show ?? isOpenModal.value
})
</script>

<style src="./f-refer-friends.scss" lang="scss"></style>
