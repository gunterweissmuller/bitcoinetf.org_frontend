<template>
  <div  class="landing-calculation__signup">

    <landingRegistrationMethods/>

    <div class="landing-calculation__signup-main"></div>
    <template v-if="$app.store.tetherspecial.signupStep === SignupSteps.Signup">
      <landingRegistrationSignup/>
    </template>

    <template v-if="$app.store.tetherspecial.signupStep === SignupSteps.Google">
      <landingRegistrationSignupGoogle/>
    </template>

    <template v-if="$app.store.tetherspecial.signupStep === SignupSteps.Loading">
      <div class="landing-calculation__loading-wrapper">
        <m-loading-new v-show="true" />
      </div>
    </template>

    <template v-if="$app.store.tetherspecial.signupStep === SignupSteps.Error">
      <div class="landing-calculation__wrapper">
        <p class="landing-calculation__error" v-if="$app.store.tetherspecial.backendError.value && $app.store.tetherspecial.backendError.field === 'default'">{{ $app.store.tetherspecial.backendError.value }}</p>
        <a-button @click="() => router.go(0)" text="Try Again" variant="tertiary"></a-button>
      </div>
    </template>

    <div class="w-buy-shares-payment-short-tether"></div>
    <template v-if="$app.store.tetherspecial.purchaseStep === PurchaseSteps.Purchase">
      <landingRegistrationPurchase :isFiatLanding="props.isFiatLanding"/>
    </template>

  </div>

  <f-terms-modal v-model="$app.store.tetherspecial.isOpenTermsModal" />
</template>

<script setup lang="ts">
  import {useNuxtApp, useRouter, useRoute} from "#app";
  import { useWeb3ModalAccount } from '@web3modal/ethers/vue'
  import { useWalletConnect } from '~/src/app/composables/useWalletConnect';
  import { useRegistration } from './useRegistration';
  import { SignupMethods } from '~/src/shared/constants/signupMethods';
  import { SignupSteps } from './SignupSteps';
  import { PurchaseSteps } from "./PurchaseSteps";
  import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
  import mLoadingNew from '../../molecules/m-loading-new/m-loading-new.vue';
  import FTermsModal from '~/src/features/f-terms-modal/f-terms-modal.vue'
  import landingRegistrationMethods from '../landing-registration-methods/landing-registration-methods.vue';
  import landingRegistrationSignup from "../landing-registration-signup/landing-registration-signup.vue";
  import landingRegistrationSignupGoogle from "../landing-registration-signup-google/landing-registration-signup-google.vue";
  import landingRegistrationPurchase from "../landing-registration-purchase/landing-registration-purchase.vue";

  const { $app } = useNuxtApp()
  const router = useRouter()
  const route = useRoute()
  const { initWalletConnect } = useWalletConnect($app);
  const { scrollToSignup, scrollToSignupFields, handleCatch, scrollToPurchase, handleOpenPurchase, handleContinue } = useRegistration($app);

  const props = withDefaults(
    defineProps<{
      isFiatLanding: boolean
    }>(),
    {
      isFiatLanding: false,
    },
  )

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
        if(r.data.auth_type === 'registration') {
          $app.store.tetherspecial.signupStep = SignupSteps.Signup;
          $app.store.tetherspecial.signupMethod = SignupMethods.WalletConnect;
          scrollToSignupFields();
        } else {
          $app.api.eth.auth.
            wallletConnectLogin({
                wallet_connect_data: JSON.stringify({
                    signature: $app.store.registration.walletConnectData.signature,
                    address: $app.store.registration.walletConnectData.walletAddress,
                    message: $app.store.registration.walletConnectData?.signatureMessage,
                }),
            })
            .then((jwtResponse: any) => {
              handleContinue(jwtResponse);
            });
        }
    })
  }

  watch(
    () => address.value,
    () => {

      if(address.value) {
        scrollToSignup()
        handleWalletConnect();
      }
    }
  )

  //
  onMounted(()=>{
    // if verify link
    if (route.query.code && route.query.email) {
      const email = String(route.query.email);
      const codeEmail = String(route.query.code);

      router.replace({'query': ''});

      $app.store.tetherspecial.signupStep = SignupSteps.Loading;

      if($app.store.auth.accountMethod === 'metamask') {

        $app.api.eth.auth.
          confirmMetamask({
          email: $app.filters.trimSpaceIntoString(email),
          code: $app.filters.trimSpaceIntoString(codeEmail),
          fast: true,
        })
          .then((jwtResponse: any) => {
            handleContinue(jwtResponse);
          })
          .catch((e) => {
            handleCatch(e);
          })

      } else if ($app.store.auth.accountMethod === 'telegram') {
        $app.api.eth.auth.
        confirmTelegram({
          telegram_data: JSON.stringify($app.store.authTelegram?.response),
          email: $app.filters.trimSpaceIntoString(email),
          code: $app.filters.trimSpaceIntoString(codeEmail),
        })
        .then((jwtResponse: any) => {
          handleContinue(jwtResponse);
        })
        .catch((e) => {
          handleCatch(e);
        })

      } else if ($app.store.auth.accountMethod === 'apple') {
        $app.api.eth.auth.
        confirmApple({
          apple_token: $app.store.authTemp?.response,
          email: $app.filters.trimSpaceIntoString(email),
          code: $app.filters.trimSpaceIntoString(codeEmail),
        })
        .then((jwtResponse: any) => {
          handleContinue(jwtResponse);
        })
        .catch((e) => {
          handleCatch(e);
        })

      } else if ($app.store.auth.accountMethod === 'facebook') {
        $app.api.eth.auth.
          confirmFacebook({
            facebook_id: $app.store.authTemp.response?.userID,
            email: $app.filters.trimSpaceIntoString(email),
            code: $app.filters.trimSpaceIntoString(codeEmail),
          })
          .then((jwtResponse: any) => {
            handleContinue(jwtResponse);
          })
          .catch((e) => {
            handleCatch(e);
          })

      } else if ($app.store.auth.accountMethod === 'walletConnect') {
        $app.api.eth.auth.
          walletConnectConfirm({
            wallet_connect_data: JSON.stringify($app.store.authTemp.response),
            email: $app.filters.trimSpaceIntoString(email),
            code: $app.filters.trimSpaceIntoString(codeEmail),
          })
          .then((jwtResponse: any) => {
            handleContinue(jwtResponse);
          })
          .catch((e) => {
            handleCatch(e);
          })

      } else {
        $app.api.eth.auth
        .confirmFast({
          email: $app.filters.trimSpaceIntoString(email),
          code: $app.filters.trimSpaceIntoString(codeEmail),
        })
        .then((jwtResponse: any) => {
          handleContinue(jwtResponse);
        })
        .catch((e) => {
          $app.store.tetherspecial.signupStep = SignupSteps.Error;
          scrollToPurchase();
          handleCatch(e);
        })

      }
    }

    localStorage.setItem('theme', 'dark');
    $app.store.user.setTheme({theme: 'dark'});
  })

  onMounted(() => {
    if($app.store.authGoogle.response?.email) {
      $app.store.tetherspecial.signupStep = SignupSteps.Google;
      $app.store.tetherspecial.signupMethod = SignupMethods.Google;
      $app.store.tetherspecial.firstName = $app.store.authGoogle.response.first_name;
      $app.store.tetherspecial.lastName = $app.store.authGoogle.response.last_name;
      $app.store.tetherspecial.email = $app.store.authGoogle.response.email;
      scrollToSignup()
    } else if($app.store.authGoogle.response?.access_token) {
      $app.store.auth.setTokens($app.store.authGoogle.response)
      $app.api.eth.auth.getUser().then((resp) => {
        $app.store.user.setUserInfo(resp?.data)
        handleOpenPurchase();
      });
    }
  });

  watch(
    () => $app.store.tetherspecial.signupMethod,
    () => {
      $app.store.tetherspecial.backendError = {value: '', field: 'default'};
    }
  )

  onUnmounted(() => {
    $app.store.tetherspecial.signupStep = SignupSteps.Default;
    $app.store.tetherspecial.purchaseStep = PurchaseSteps.Default;
    $app.store.tetherspecial.signupMethod = SignupMethods.None;
    $app.store.tetherspecial.firstName = '';
    $app.store.tetherspecial.lastName = '';
    $app.store.tetherspecial.email = '';
    $app.store.tetherspecial.dataDisabled = false;
    $app.store.tetherspecial.isMainInputDisabled = false;
    $app.store.tetherspecial.isEmailDisabled = false;
    $app.store.tetherspecial.backendError = {value: '', field: 'default'};
    $app.store.tetherspecial.countryCode = '';
    $app.store.tetherspecial.phone = '';
    $app.store.tetherspecial.isOpenTermsModal = false;
    $app.store.tetherspecial.confirmResponse = null;
    $app.store.tetherspecial.isOpenSuccessModal = false;
  })

</script>

