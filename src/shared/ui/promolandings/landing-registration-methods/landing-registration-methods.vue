<template>
  <div v-if="!isUserAuth">
    <div class="landing-calculation__signup-title landing-calculation--text-normal">Select Preferred Method of Authentication.</div>
    <div class="landing-calculation__signup-subtitle landing-calculation--text-normal">If you already have an account, you can <nuxt-link class="landing-calculation__signup-subtitle-link" to="/personal/login">log in here</nuxt-link>.</div>
    <div class="landing-calculation__signup-buttons">
      <div @click="() => signupToggle(SignupMethods.Email)" class="landing-calculation__signup-buttons-item" :class="[{'landing-calculation__signup-buttons-item-active': $app.store.tetherspecial.signupMethod === SignupMethods.Email}]">
        <nuxt-img src="/img/icons/colorful/mail-shiny.svg" class="landing-calculation__signup-buttons-item-img" ></nuxt-img>
      </div>

      <div @click="() => handleMetamaskConnect()" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': $app.store.tetherspecial.signupMethod === SignupMethods.Metamask}]">
        <nuxt-img src="/img/icons/colorful/metamask.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
      </div>

      <div @click="() => handleGoogleConnect()" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': $app.store.tetherspecial.signupMethod === SignupMethods.Google}]">
        <nuxt-img src="/img/icons/colorful/google.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
      </div>

      <div @click="testTG" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': $app.store.tetherspecial.signupMethod === SignupMethods.Telegram}]">
        <nuxt-img src="/img/icons/colorful/telegram3.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
      </div>

      <div @click="handleAppleConnect" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': $app.store.tetherspecial.signupMethod === SignupMethods.Apple}]">
        <nuxt-img src="/img/icons/colorful/apple.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
      </div>

      <div @click="handleFacebookConnect" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': $app.store.tetherspecial.signupMethod === SignupMethods.Facebook}]">
        <nuxt-img src="/img/icons/colorful/facebook-circle.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
      </div>

      <div @click="handleWalletConnect" class="landing-calculation__signup-buttons-item"  :class="[{'landing-calculation__signup-buttons-item-active': $app.store.tetherspecial.signupMethod === SignupMethods.WalletConnect}]">
        <nuxt-img src="/img/icons/colorful/walletConnect.svg" class="landing-calculation__signup-buttons-item-img"></nuxt-img>
      </div>

    </div>
    <div class="landing-calculation__signup-line"></div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import {useNuxtApp} from "#app";
  import { useRegistration } from '../landing-registration/useRegistration';
  import { SignupMethods } from '~/src/shared/constants/signupMethods';

  const { $app } = useNuxtApp()
  const { signupToggle, handleMetamaskConnect, handleGoogleConnect, testTG, handleAppleConnect, handleFacebookConnect, handleWalletConnect } = useRegistration($app);

  const isUserAuth = computed(()=>{
    return $app.store.auth?.refreshToken ? true : false;
  });
</script>

<!-- todo split -->
<!-- <style lang="scss" src="./landing-calculation.scss" /> -->
