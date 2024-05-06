<template>
  <div class="guarantees-card">
    <p class="guarantees-card__label">{{ label }}</p>
    <p class="guarantees-card__title">{{ title }}</p>
    <p class="guarantees-card__capital">{{ capital }}</p>
    <p class="guarantees-card__cost">{{ cost }}</p>
<<<<<<< 038698c749ca8b808b59ab7147c1bad002d71dd0
    <p v-if="currentBalance" class="guarantees-card__current_balance">Current Balance <span><NuxtImg class="s-site-main__title_icon aspect-square w-[14px]" src="/img/icons/colorful/live-data.svg" width="14" height="14" loading="lazy"/> <div>LIVE DATA</div></span></p>
=======
    <p v-if="currentBalance" class="guarantees-card__current_balance">
      Current Balance
      <span
        ><NuxtImg
          class="s-site-main__title_icon aspect-square w-[14px]"
          src="/img/icons/colorful/live-data.svg"
          width="14"
          height="14"
          loading="lazy"
        />
        LIVE DATA</span
      >
    </p>
>>>>>>> 60803675102a4270ac8efddbc39e0671fa7a96e1
    <p class="guarantees-card__body_text">
      {{ body }}
    </p>
    <button @click="goToRegistration" class="guarantees-card__button">{{ textButton }}</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { auth } from '~/src/app/store/auth'
import { useRouter } from '#app'

  defineProps({
    label: '',
    title: '',
    cost: '',
    body: '',
    capital: '',
    currentBalance: true,
    textButton: '',
  })

  const $router = useRouter()
  const authStore = auth()
  const isAuth = computed(() => authStore.isUserAuthenticated)

  function goToRegistration() {
    if (isAuth.value) {
      const isProd = ['bitcoinetf.org', 'app.bitcoinetf.org'].includes(window.location.host) ? true : false
      const blockchainLink = isProd
        ? 'https://explorer.nextdev.org/account/PccUG4tvCYT8RaaCozjCzRXyxpryAgowJ4'
        : 'https://explorer.stage.techetf.org/account/PccUG4tvCYT8RaaCozjCzRXyxpryAgowJ4'
        
      window.open(blockchainLink, '_blank').focus()
    } else {
      $router.push('/personal/registration')
    }
  }
</script>

<style src="./m-guarantees-card.scss" lang="scss" />
