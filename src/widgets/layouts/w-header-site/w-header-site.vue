<template>
  <header class="w-header-site" :class="{ 'w-header-site--fixed': y > 0 }">
    <div class="w-header-site__wrap">
      <nuxt-link to="/" class="w-header-site__logo">
        <img src="/img/logo-white.svg" alt="logo" />
      </nuxt-link>
      <div :class="['w-header-site__box', { 'w-header-site__box__active': isOpenMenu }]">
        <a-avatar
          v-if="isUserAuthenticated"
          size="32px"
          class="w-header-site__controls-avatar w-header-site__controls-avatar--mobile"
          photo-src="/img/avatar.png"
          @click="$router.push({ name: 'personal-portfolio' })"
        />
        <div class="w-header-site__links">
          <a v-for="(link, idx) in LINKS" :key="idx" :href="link.link" class="w-header-site__link">
            {{ link.text }}
          </a>
        </div>
        <div class="w-header-site__controls w-header-site__controls-mobile">
          <a-button
            v-if="!isUserAuthenticated"
            size="small"
            variant="secondary"
            text="Log in"
            @click="$router.push({ name: 'personal-login' })"
          />
          <a-button
            v-if="!isUserAuthenticated"
            size="small"
            text="Sign up"
            @click="$router.push({ name: 'personal-registration' })"
          />
        </div>
      </div>
      <div class="w-header-site__controls w-header-site__controls-desktop">
        <a-button
          v-if="!isUserAuthenticated"
          size="small"
          variant="secondary"
          text="Log in"
          @click="$router.push({ name: 'personal-login' })"
        />
        <a-button
          v-if="!isUserAuthenticated"
          size="small"
          text="Sign up"
          @click="$router.push({ name: 'personal-registration' })"
        />
        <a-avatar
          v-if="isUserAuthenticated"
          size="32px"
          class="w-header-site__controls-avatar"
          photo-src="/img/avatar.png"
          :left-label="$app.store.user?.info?.account?.username"
          @click="$router.push({ name: 'personal-portfolio' })"
        />
      </div>
      <div :class="['w-header-site__burger', { 'w-header-site__burger__active': isOpenMenu }]" @click="openMenu">
        <span class="w-header__burger-line"></span>
        <span class="w-header__burger-line"></span>
        <span class="w-header__burger-line"></span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import { useWindowScroll } from '@vueuse/core'
import AAvatar from '~/src/shared/ui/atoms/a-avatar/a-avatar.vue'
import { useNuxtApp } from '#app'
import useMediaDevice from '~/composables/useMediaDevice'

const { $app } = useNuxtApp()
const { isLaptop, isDesktop, isMobile, isTablet } = useMediaDevice()

const isUserAuthenticated = computed(() => {
  return $app.store.auth.isUserAuthenticated
})

const { y } = useWindowScroll()

const LINKS = [
  {
    text: 'Buy ETF Shares',
    link: '/personal/login',
  },
  {
    text: 'Tutorials',
    link: '/tutorials',
  },
  {
    text: 'Fund',
    link: '/fund',
  },
  {
    text: 'Blog',
    link: '/blog',
  },
]

const isOpenMenu = ref(false)
const openMenu = () => {
  isOpenMenu.value = !isOpenMenu.value
}
</script>

<style src="./w-header-site.scss" lang="scss"></style>
