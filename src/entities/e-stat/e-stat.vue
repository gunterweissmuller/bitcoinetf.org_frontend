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

      <a-dropdown v-if="props.bottom === 'dropdown'"/>
      <button
        class="e-stat__blockchain"
        v-if="props.bottom === 'link'"
      >
        <a-icon width="14" :name="Icon.MonoExternalLink" />
        <a :href="`https://${config.public.EXPLORER_API}/account/${$app.store.user?.blockchainUserWallet}`" target="_blank" class="e-stat__blockchain-title">
          Verify on Blockchain
        </a>
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
          <div :class="['e-stat-list__item-right', {'e-stat-list__item-right--minus': item.type === 'withdrawal'}]">
            <div class="e-stat-list__usd">{{ item.usd }}</div>
            <div v-if="$app.store.user?.info?.account?.order_type !== 'usdt'" class="e-stat-list__btc" v-html="item.btc"></div>
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
import ALive from '~/src/shared/ui/atoms/a-live/a-live.vue';
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue';
import { Icon } from '~/src/shared/constants/icons';
import ADropdown from '~/src/shared/ui/atoms/a-dropdown/a-dropdown.vue';
import { useNuxtApp } from '#app'

const { $app } = useNuxtApp();

const props = withDefaults(
  defineProps<{
    title: string
    date?: string
    titleColor?: 'primary' | 'success'
    titleLink?: string
    difference?: string | undefined
    subtitle?: string | undefined
    info: string
    options?: any
    toggleTitle?: string
    modelValue?: any
    listType?: 'items' | 'files'
    type?: 'default' | 'list'
    list?: any
    popper?: any
    fixedHeader?: boolean
    icon: string
    iconType: 'full' | 'small'
    bottom: 'dropdown' | 'link' | 'none'
  }>(),
  {
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
    bottom: 'none'
  },
);

const config = useRuntimeConfig();
</script>

<style src="./e-stat.scss" lang="scss" />
