<template>
  <div class="e-stat">
    <template v-if="type === 'default'">
      <div :class="['e-stat-default__head', { 'e-stat-default__head--fixed': fixedHeader }]">
        <a-icon v-if="props.iconType === 'full'" width="32" :name="props.icon" />

        <div v-else class="e-stat__icon">
          <a-icon width="14" :name="props.icon" />
        </div>

        <a-live />
      </div>

      <div class="e-stat-default__wrap">
        <div class="e-stat-default__title">
          <span :class="['e-stat-default__title-name', `e-stat-default__title-text--${titleColor}`]">
            {{ info }}
          </span>
          <span :class="['e-stat-default__title-text', `e-stat-default__title-text--${titleColor}`]">
            {{ title }}
          </span>
        </div>
      </div>

      <a-dropdown v-if="props.bottom === 'dropdown'" @get-current-option="handleDropdown" />
      <button class="e-stat__blockchain" v-if="props.bottom === 'link'">
        <a-icon width="14" :name="Icon.MonoExternalLink" />
        <a @click="goToRegistration" target="_blank" class="e-stat__blockchain-title"> Verify on Blockchain </a>
      </button>
      <div v-if="props.bottom === 'none'" style="height: 21px"></div>
    </template>
    <template v-else>
      <nuxt-link :to="{ name: titleLink }" v-if="listType === 'files'" class="e-stat-list__title">
        {{ title }}
      </nuxt-link>
      <div v-else class="e-stat-list__title">
        {{ title }}
      </div>
      <div v-if="list?.length" class="e-stat-list__list">
        <div v-if="listType === 'items'" v-for="(item, idx) in list" :key="idx" class="e-stat-list__item">
          <div class="e-stat-list__item-left">
            <div class="e-stat-list__date">{{ item.date }}</div>
            <!--            <div class="e-stat-list__time">{{ item.time }}</div>-->
          </div>
          <div :class="['e-stat-list__item-right', { 'e-stat-list__item-right--minus': item.type === 'withdrawal' }]">
            <div class="e-stat-list__usd">{{ item.usd }}</div>
            <div
              v-if="$app.store.user?.info?.account?.order_type !== 'usdt'"
              class="e-stat-list__btc"
              v-html="item.btc"
            ></div>
          </div>
        </div>
        <div
          v-if="listType === 'files'"
          v-for="(item, idx) in list"
          :key="idx"
          @click="$emit('click-file', item)"
          class="e-stat-list__file"
        >
          <a-icon width="18" height="18" :name="Icon.MonoFile" class="e-stat-list__file-icon" />
          <div class="e-stat-list__file-text">{{ item.date }}</div>
        </div>
      </div>
      <div v-else class="e-stat-list__empty">
        <img src="/img/cloud.png" alt="empty" />
      </div>
      <div v-if="info" class="e-stat-default__info">{{ info }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import ALive from '~/src/shared/ui/atoms/a-live/a-live.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import ADropdown from '~/src/shared/ui/atoms/a-dropdown/a-dropdown.vue'
import { ADropdownOption } from '~/src/shared/types/global'
import { LINKS } from '~/src/shared/constants/global'

import type { Props } from './e-stat.type'

import { auth } from '~/src/app/store/auth'
const authStore = auth()

const props = withDefaults(defineProps<Props>(), {
  titleColor: 'primary',
  titleLink: '/',
  toggleTitle: '',
  date: '',
  options: null,
  type: 'default',
  listType: 'items',
  list: [],
  popper: undefined,
  fixedHeader: false,
  icon: Icon.ColorfulBitcoin,
  iconType: 'full',
  subtitle: '',
  bottom: 'none',
})

const emit = defineEmits<{
  'get-current-option': [option: ADropdownOption]
  'click-file': [file: any]
}>()

const handleDropdown = (currentOption: ADropdownOption) => {
  emit('get-current-option', currentOption)
}
function goToRegistration() {
  if (authStore.isAuth) {
    const isProd = ['bitcoinetf.org', 'app.bitcoinetf.org'].includes(window.location.host) ? true : false

    const blockchainLink = isProd ? LINKS.BLOCKCHAIN_EXPLORER_LINK.PROD : LINKS.BLOCKCHAIN_EXPLORER_LINK.STAGE

    ;(window.open(blockchainLink, '_blank') as Window).focus()
  } else {
    navigateTo({ name: 'personal-registration' })
  }
}
</script>

<style src="./e-stat.scss" lang="scss" />
