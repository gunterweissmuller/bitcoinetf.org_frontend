<template>
  <footer class="s-site-footer">
    <div class="s-site-footer__content">
      <div class="s-site-footer__top">
        <div class="s-site-footer__top-wrapper">
          <h2 class="s-site-footer__title title-first title-site-h1">DON’T BUY CRYPTO,
            <h2 class="s-site-footer__title title-site-h1 title-sub">
              <p class="s-site-footer__title_sub_earn">EARN</p>
              <NuxtImg src="/img/icons/colorful/bitcoin.svg" width="60" height="60" class="aspect-square w-[60px]" />
              <p class="s-site-footer__title_sub_bitcoin">BITCOIN</p>
            </h2>
          </h2>

          <div class="s-site-footer__top-send">
            <div class="s-site-footer__text">
              Sign up to our newsletter and receive our new research, portfolio news and content direct to your inbox.
            </div>
            <div class="s-site-footer__form">
              <p v-if="success">Thank you!</p>
              <a-input
                label="E-mail"
                validation-reg-exp-key="email"
                required
                :error-text="emailErrorText"
                @blur="emailFieldBlurHandler"
                @update:is-valid="isEmailValid = $event"
                v-model="subscribeEmail"
                v-if="!success"
              />
              <button class="s-site-footer__form-submit" @click="subscribeToChimp()"                 v-if="!success"
              >
                <img src="/img/site-dark/s-site-footer/send.svg"/>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="s-site-footer__info">
        <div class="s-site-footer__column">
          <div class="s-site-footer__logo">
            <img src="/img/site-dark/s-site-footer/logo.svg" alt="logo"/>
          </div>
          <div class="s-site-footer__info-text">
            The world's premier digital Bitcoin ETF, offering you a blend of security, innovation, and transparency
          </div>
          <div class="s-site-footer__socials">
            <div class="s-site-footer__social" v-for="(icon, id) in SOCIAL_LINKS" :key="id">
              <a :href="icon.link" target="_blank" :style="`font-size:${icon.size}px`">
                <a-icon :name="icon.icon"/>
              </a>
            </div>
          </div>
        </div>
        <div class="s-site-footer__menu">
          <div class="s-site-footer__menu-container" v-for="(menuItem, id) in menu" :key="id">
            <div class="s-site-footer__menu-title">{{ menuItem.title }}</div>
            <div class="s-site-footer__menu-column">
              <nuxt-link
                :to="link.href"
                class="s-site-footer__menu-link"
                v-for="(link, idx) in menuItem.items"
                :key="idx"
              >
                {{ link.text }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <div class="s-site-footer__phrase">BITCOIN ETF</div>
    </div>
    <div class="l-site-dark s-site-footer-container">
      <div class="s-site-footer__bottom">
        <div class="s-site-footer__bottom-item">© 2023-2024 BitcoinETF. All rights reserved.</div>
        <nuxt-link to="/terms" class="s-site-footer__bottom-item">Terms & Conditions</nuxt-link>
        <nuxt-link to="/privacy" class="s-site-footer__bottom-item">Privacy Policy</nuxt-link>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import {Icon} from '~/src/shared/constants/icons'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'

import { useNuxtApp } from '#app'

const { $app } = useNuxtApp()

const menu = [
  {
    title: 'Platform',
    items: [
      {text: 'Buy ETF Shares', href: '/personal/login'},
      // { text: 'Mastercard', href: '/' },
      {text: 'Bitcoin Education', href: '/bitcoin-education'},
      {text: 'Referrals', href: '/referrals'},
    ],
  },
  {
    title: 'About',
    items: [
      {text: 'Fund', href: '/fund'},
      {text: 'Blog', href: '/blog'},
      // { text: 'Chat', href: '/' },
      // { text: 'Bitcoin Whitepaper', href: '/' },
    ],
  },
  {
    title: 'Account',
    items: [
      // { text: 'Corporate', href: '/' },
      {text: 'Personal', href: '/personal/earnings'},
      {text: 'Tutorials', href: '/tutorials'},
    ],
  },
  {
    title: 'Annual Report',
    items: [
      {text: '2023', href: '/#'},
    ],
  },
]

const SOCIAL_LINKS = [
  {icon: Icon.MonoTelegramBlack, link: 'https://t.me/BitcoinETF_org'},
  {icon: Icon.MonoTelegram2Black, link: 'https://t.me/bitcoinetf_chat'},
  {icon: Icon.MonoUnknownBlack, link: 'https://snort.social/npub1wtr2vx2z90dfque30k9j7kk9etqlectmk2nt9q438gemsz8awt8q6z4mfl'},
  {icon: Icon.MonoMedium, link: 'https://medium.com/@BitcoinETF_org', size: 14},
]

const subscribeEmail = ref('')
const emailErrorText = ref('')
const isEmailValid = ref(false)
const success = ref(false)
function emailFieldBlurHandler() {
  if (isEmailValid.value) {
    emailErrorText.value = ''
    return
  }

  if (email.value) {
    emailErrorText.value = 'Invalid email address'
    return
  }

  emailErrorText.value = 'Required'
}
const subscribeToChimp = async () => {
  try {
    await $app.api.eth.news.mailchimpSub({email:subscribeEmail.value}).then(()=>{
      success.value = true
    })
  } catch (e) {
      emailErrorText.value = 'Invalid email address'
  }
}
</script>

<style src="./s-site-footer-new.scss" lang="scss"/>
footer
