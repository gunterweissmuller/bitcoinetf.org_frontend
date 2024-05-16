<template>
  <header class="w-header-auth">
    <div class="w-header-auth__wrap">
      <nuxt-link to="/" class="w-header-auth__logo">
        <a-icon class="w-aside__logo-icon" :name="getLogo" width="142" height="24" />
      </nuxt-link>
      <div :class="['w-header-auth__box', { 'w-header-auth__box__active': isOpenMenu }]">
        <a-avatar
          v-if="isUserAuthenticated"
          size="32px"
          class="w-header-auth__controls-avatar w-header-auth__controls-avatar--mobile"
          photo-src="/img/avatar.png"
          @click="$router.push({ name: 'personal-portfolio' })"
        />
        <div class="w-header-auth__links">
          <nuxt-link v-for="(link, idx) in LINKS" :key="idx" :to="link.link" class="w-header-auth__link">
            {{ link.text }}
          </nuxt-link>
        </div>
        <div class="w-header-auth__controls w-header-auth__controls-mobile">
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
      <div class="w-header-auth__controls w-header-auth__controls-desktop">
        <a-button
          v-if="!isUserAuthenticated && !isResetPage"
          size="small"
          variant="secondary"
          text="Log in"
          @click="$router.push({ name: 'personal-login' })"
        />
        <a-button
          v-if="!isUserAuthenticated && !isResetPage"
          size="small"
          text="Sign up"
          @click="$router.push({ name: 'personal-registration' })"
        />
        <div class="w-header-auth__controls--fake" v-if="isResetPage"></div>
        <a-avatar
          v-if="isUserAuthenticated"
          size="32px"
          class="w-header-auth__controls-avatar"
          photo-src="/img/avatar.png"
          :left-label="$app.store.user?.info?.account?.username"
          @click="$router.push({ name: 'personal-portfolio' })"
        />
      </div>
      <div :class="['w-header-auth__burger', { 'w-header-auth__burger__active': isOpenMenu }]" @click="openMenu">
        <span class="w-header__burger-line"></span>
        <span class="w-header__burger-line"></span>
        <span class="w-header__burger-line"></span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import AAvatar from '~/src/shared/ui/atoms/a-avatar/a-avatar.vue'
import { useNuxtApp } from '#app'
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'

const { $app } = useNuxtApp()
const route = useRoute()

const isUserAuthenticated = computed(() => {
  return $app.store.auth.isUserAuthenticated
})

const isResetPage = computed(() => {
  return route.path === '/personal/reset'
})

const LINKS = [
  {
    text: 'Fund',
    link: '/fund',
  },
  {
    text: 'News',
    link: '/blog',
  },
  {
    text: 'Tether Special',
    link: '/tetherspecial',
  },
  {
    text: 'Tutorials',
    link: '/tutorials',
  },
  {
    text: 'Buy ETF Shares',
    link: '/personal/login',
  },
]

const isOpenMenu = ref(false)
const openMenu = () => {
  isOpenMenu.value = !isOpenMenu.value
}

const getLogo = computed(() => {
  return $app.store.user.theme === 'dark' ? Icon.ColorfulBtcDarkLogo : Icon.ColorfulBitcoinFull
})
</script>

<style src="./w-header-auth.scss" lang="scss"></style>
