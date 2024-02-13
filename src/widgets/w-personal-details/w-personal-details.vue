<template>
  <div class="w-personal-details page-max-width--small">
    <div class="w-personal-details__wrap">
      <div v-if="isLaptop || isDesktop" class="w-personal-details__info">
        <div class="w-personal-details__avatar">
          <a-avatar size="64px" photo-src="/img/avatar.png" class="w-personal-details__avatar-pic" :robot-data="$app.store.user?.info?.account?.uuid"/>
          <div class="w-personal-details__avatar-title">@{{ $app.store.user?.info?.account?.username }}</div>
          <div v-if="$app.store.user?.info?.profile?.full_name" class="w-personal-details__avatar-subtitle">
            {{ $app.store.user?.info?.profile?.full_name }}
          </div>
        </div>
        <f-refer-friends />
      </div>
      <div class="w-personal-details__inputs">
        <a-input
          v-for="(value, key) in personalDetails"
          class="w-personal-details__input w-personal-details__input-name"
          :label="convertToLabel(key)"
          disabled
          :model-value="modifyValue(value) || ''"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import useMediaDevice from '~/composables/useMediaDevice'
import AAvatar from '~/src/shared/ui/atoms/a-avatar/a-avatar.vue'
import { useNuxtApp } from '#app'
import FReferFriends from '~/src/features/f-refer-friends/f-refer-friends.vue'

const { isLaptop, isDesktop } = useMediaDevice()

const { $app } = useNuxtApp()

const modifyValue = (value) => {
  const modifiedValue = new Date(value)
  if (!isNaN(modifiedValue.valueOf()) && value) {
    return $app.filters.dayjs(value).format('D MMMM YY')
  } else {
    return value
  }
}

const personalDetails = computed(() => {
  return $app.store.user.info?.profile || {}
})

const convertToLabel = (key: string) => {
  if (!key) return ''
  return $app.filters.capitalize(key.replaceAll('_', ' '))
}

onBeforeMount(async () => {
  await $app.api.eth.auth.getUser().then((resp) => {
    $app.store.user.info = resp?.data
  })
  await $app.api.info.blockchainProxy.getUserBlockchainWallet().then((resp) => {
    $app.store.user.blockchainUserWallet = resp?.data.uid
  })
})
</script>

<style src="./w-personal-details.scss" lang="scss"></style>
