<template>
  <div class="f-login-new">
    <div class="f-login-new__bg" :class="{ 'f-login-new__bg-dark': $app.store.user.theme === 'dark' }">
      <nuxt-img src="/img/signup/login_bg_new.png"></nuxt-img>
    </div>

    <div class="f-login-new-content f-login-new-content-left">
      <div class="f-login-new-content__logo">
        <nuxt-link to="/" class="w-header-dark__logo">
          <a-icon class="w-aside__logo-icon" :name="Icon.ColorfulBtcDarkLogo" width="140" height="24" />
        </nuxt-link>
      </div>
      <div class="f-login-new-content__title">Passive Income for Smart Investors</div>
      <div class="f-login-new-content__text">Bitcoin ETF that pays dividends: choose to earn USDT or BTC</div>
      <div class="f-login-new-content__bg">
        <nuxt-img src="/img/signup/rocket.png"></nuxt-img>
      </div>
    </div>

    <div class="f-login-new-content f-login-new-content-right">
      <div class="f-login-new-content-right-wrapper">
        <div class="f-registration w-full">
          <template v-if="$app.store.login?.currentStep === Steps.Choice">
            <f-login-choice/>
          </template>
          <template v-else-if="$app.store.login?.currentStep === Steps.Login">  
            <f-login-login/>
          </template>
          <template v-else-if="$app.store.login?.currentStep === Steps.OneTimeLink">
            <f-login-link/>
          </template>
          <template v-else-if="$app.store.login?.currentStep === Steps.Check">
            <f-login-check/>
          </template>
          <template v-else-if="$app.store.login?.currentStep === Steps.Error">
            <f-login-error/>
          </template>
          <template v-else-if="$app.store.login?.currentStep === Steps.Loading">
            <div class="f-login__wrapper">Loading...</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useNuxtApp } from '#app'
  import { Icon } from '~/src/shared/constants/icons'
  import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
  import { Steps } from './steps'
  import fLoginChoice from '../f-login-choice/f-login-choice.vue'
  import fLoginError from '../f-login-error/f-login-error.vue'
  import fLoginLogin from '../f-login-login/f-login-login.vue'
  import fLoginLink from '../f-login-link/f-login-link.vue'
  import fLoginCheck from '../f-login-check/f-login-check.vue'
  import { useWeb3ModalAccount } from '@web3modal/ethers/vue'
  import { useLogin } from './useLogin'
  import { useWalletConnect } from '~/src/app/composables/useWalletConnect'

  const { $app } = useNuxtApp()
  const { continueLogin, checkAuthType } = useLogin($app);
  const {initWalletConnect} = useWalletConnect($app);

  // reset 
  onUnmounted(() => {
    $app.store.login.currentStep = Steps.Choice;
    $app.store.login.timerStarted = false;
    $app.store.login.timeLeft = 0;
    $app.store.login.timer = null;
    $app.store.login.email = '';
    $app.store.login.password = '';
  });

  // walletConnect
  const { address } = useWeb3ModalAccount()

  const handleWalletConnect = async () => {
    await initWalletConnect();

    $app.api.eth.auth.walletConnectGetAuthType({
          wallet_connect_data: JSON.stringify({
              signature: $app.store.registration.walletConnectData.signature,
              address: $app.store.registration.walletConnectData.walletAddress,
              message: $app.store.registration.walletConnectData?.signatureMessage,
          }),
      }).then((r: any) => {
          const tempLogin = () => {
              $app.api.eth.auth.
              wallletConnectLogin({
                  wallet_connect_data: JSON.stringify({
                      signature: $app.store.registration.walletConnectData.signature,
                      address: $app.store.registration.walletConnectData.walletAddress,
                      message: $app.store.registration.walletConnectData?.signatureMessage,
                  }),
              })
              .then((jwtResponse: any) => {
                  continueLogin(jwtResponse);
              })
          }

          checkAuthType(r, tempLogin)
      })
  }

  watch(
    () => address.value,
    () => {

      if(address.value) {
        handleWalletConnect();
      }
    }
  )

</script>

<style lang="scss" src="./f-login.scss" />
