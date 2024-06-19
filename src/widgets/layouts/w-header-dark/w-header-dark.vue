<template>
  <header class="w-header-dark" :class="{ 'w-header-dark--fixed': y > 0, 'w-header-dark--opened': isOpenMenu }">
    <div class="w-header-dark__top">
      <div class="w-header-dark__top-item">
        <div class="w-header-dark__top-item--icon">
          <a-icon :name="Icon.MonoActionCheckMark" />
        </div>
        <div class="w-header-dark__top-item--text">Security</div>
      </div>
      <div class="w-header-dark__top-item">
        <div class="w-header-dark__top-item--icon">
          <a-icon :name="Icon.MonoActionCheckMark" />
        </div>
        <div class="w-header-dark__top-item--text">Innovation</div>
      </div>
      <div class="w-header-dark__top-item">
        <div class="w-header-dark__top-item--icon">
          <a-icon :name="Icon.MonoActionCheckMark" />
        </div>
        <div class="w-header-dark__top-item--text">Transparency</div>
      </div>
    </div>
    <div class="w-header-dark__wrap">
      <nuxt-link to="/" target="_blank" class="w-header-dark__logo">
        <a-icon class="w-aside__logo-icon" :name="Icon.ColorfulBtcDarkLogo" width="210" height="32" />
      </nuxt-link>
      <div :class="['w-header-dark__box', { 'w-header-dark__box__active': isOpenMenu }]">
        <a-avatar
          v-if="isUserAuthenticated"
          size="32px"
          class="w-header-dark__controls-avatar w-header-dark__controls-avatar--mobile"
          variant="secondary"
          photo-src="/img/avatar.png"
          :left-label="$app.store.user?.info?.account?.username"
          :robot-data="$app.store.user?.info?.account?.uuid"
          @click="$router.push({ name: 'personal-portfolio' })"
        />
        <div class="w-header-dark__links">
          <nuxt-link
            v-for="(link, idx) in LINKS"
            :key="idx"
            :href="link.link"
            class="w-header-dark__link"
            :class="[{ 'w-header-dark__link-light': route.name === 'index' || route.name === 'tetherspecial' }]"
          >
            {{ link.text }}
          </nuxt-link>
        </div>
        <div class="w-header-dark__controls w-header-dark__controls-mobile">
          <a-button
            v-if="!isUserAuthenticated"
            size="small"
            text="Launch app"
            :variant="route.name === '' ? 'primary-website' : 'primary2'"
            @click="$router.push({ name: 'personal-registration' })"
          />
        </div>
      </div>
      <div class="w-header-dark__controls w-header-dark__controls-desktop">
        <nuxt-link to="/personal/fund" v-if="!isUserAuthenticated"
          ><a-button text="Register" size="small" :variant="route.name === 'index' || route.name === 'tetherspecial' ? 'primary-website' : 'primary2'"
        /></nuxt-link>
        <nuxt-link to="/personal/fund" v-if="!isUserAuthenticated"
          ><a-button text="Launch app" size="small" variant="tertiary"
        /></nuxt-link>
        <a-avatar
          v-if="isUserAuthenticated"
          size="32px"
          class="w-header-dark__controls-avatar"
          variant="secondary"
          photo-src="/img/avatar.png"
          :left-label="$app.store.user?.info?.account?.username"
          :robot-data="$app.store.user?.info?.account?.uuid"
          @click="$router.push({ name: 'personal-portfolio' })"
        />
      </div>
      <div :class="['w-header-dark__burger', { 'w-header-dark__burger__active': isOpenMenu }]" @click="openMenu">
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
import { useWindowScroll } from '@vueuse/core'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const { $app } = useNuxtApp()

const { y } = useWindowScroll(window)

const isUserAuthenticated = computed(() => {
  return $app.store.auth.isUserAuthenticated
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

// const getLogo = computed(() => {
//   return $app.store.user.theme === 'dark' ? Icon.ColorfulBtcDarkLogo : Icon.ColorfulBitcoinFull
// })
watch(
  () => route.path,
  () => {
    setTimeout(() => {
      isOpenMenu.value = false
    }, 1500)
  },
)
</script>

<style src="./w-header-dark.scss" lang="scss"></style>
