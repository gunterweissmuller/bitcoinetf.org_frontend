<template>
  <m-modal @close="close" full-screen v-model="isOpenModal">
    <div class="e-referral-share-modal">
      <div class="e-referral-share-modal__content">
        <div class="e-referral-share-modal__title">Refer Friends, Get 5% Forever! 💸</div>
        <div class="e-referral-share-modal__text">
          Tell friends about BitcoinETF. You get 5% of what they buy, always. They get better rates too!🚀💸
        </div>
      </div>
      <div class="e-referral-share-modal__controls">
        <div class="e-referral-share-modal__subtitle">Share your link</div>
        <div class="e-referral-share-modal__links">
          <client-only>
            <a-social-sharing
              v-for="(link, idx) in LIST_LINKS"
              :key="idx"
              class="e-referral-share-modal__link"
              :network="link.social"
              :url="referralLink"
              :title="locationOrigin"
              description="Don’t buy #Bitcoin. Earn it."
              hashtags="bitcoin"
            >
              <a-icon width="24" height="24" class="e-referral-share-modal__link-icon" :name="link.icon" />
            </a-social-sharing>
          </client-only>
        </div>
        <div @click="accept" style="cursor: copy">
          <a-input
            class="e-referral-share-modal__button e-referral-share-modal__button-accept"
            label="Your referral code"
            :model-value="$app.store.user.info?.referrals?.code || ''"
            :disabled="true"
            :text-icon="copiedLink"
            text-icon-text="Copied!"
            :icon="Icon.MonoCopy"
            position-icon="right"
          />
        </div>
        <a-button
          class="e-referral-share-modal__button e-referral-share-modal__button-cancel"
          text="Go back"
          variant="tertiary"
          @click="close"
        />
      </div>
    </div>
  </m-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '~/src/shared/constants/icons'
import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { useClipboard } from '@vueuse/core'
import { useNuxtApp } from '#app'
import ASocialSharing from '~/src/shared/ui/atoms/a-social-sharing/a-social-sharing.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
  }>(),
  {
    modelValue: false,
  },
)

const copiedLink = ref(false)

const { $app } = useNuxtApp()

const emit = defineEmits(['update:modelValue', 'close', 'accept'])

const LIST_LINKS = [
  {
    icon: Icon.MonoTelegram,
    href: '/',
    social: 'telegram',
  },
  {
    icon: Icon.MonoX,
    href: '/',
    social: 'twitter',
  },
  {
    icon: Icon.MonoFacebook,
    href: '/',
    social: 'facebook',
  },
  {
    icon: Icon.MonoMail,
    href: '/',
    social: 'email',
  },
  {
    icon: Icon.MonoMessage,
    href: '/',
    social: 'messenger',
  },
]

const isOpenModal = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const referralLink = ref('')
const locationOrigin = ref('')

const { copy } = useClipboard({ referralLink })
const accept = () => {
  copy(referralLink.value)
  copiedLink.value = true

  emit('accept')

  setTimeout(() => {
    copiedLink.value = false
  }, 1000)
}
const close = () => {
  emit('close')
  isOpenModal.value = false
}

onMounted(() => {
  const code = $app.store.user.info?.referrals?.code

  if (code) {
    referralLink.value = window.location.origin.replace('app.', '') + '/personal/registration' + `?referral=${code}`
  } else {
    referralLink.value = window.location.origin.replace('app.', '') + '/personal/registration'
  }

  locationOrigin.value = window.location.origin.replace('app.', '')
})
</script>

<style src="./e-referral-share-modal.scss" lang="scss" />
