<template>

  <div class="f-registration-new">

    <div class="f-registration-new__bg" :class="{'f-registration-new__bg-dark':$app.store.user.theme === 'dark'}">
      <nuxt-img src="/img/signup/login_bg_new.png"></nuxt-img>
    </div>

    <div class="f-registration-new-content f-registration-new-content-left">
      <div class="f-registration-new-content__logo">
        <nuxt-link to="/" class="w-header-dark__logo">
          <a-icon class="w-aside__logo-icon" :name="Icon.ColorfulBtcDarkLogo" width="140" height="24"/>
        </nuxt-link>
      </div>
      <div class="f-registration-new-content__title">
        Passive Income for Smart Investors
      </div>
      <div class="f-registration-new-content__text">
        Bitcoin ETF that pays dividends: 
        choose to earn USDT or BTC
      </div>
      <div class="f-registration-new-content__bg">
        <nuxt-img src="/img/signup/rocket.png"></nuxt-img>
      </div>
    </div>

    <div class="f-registration-new-content f-registration-new-content-right">
      <div class="f-registration-new-content-right-wrapper">
        <div class="f-registration-right w-full">
          <template v-if="$app.store.registration.currentStep === Steps.Choice">
              <f-registration-choice/>
          </template>
          <template v-else-if="$app.store.registration.currentStep === Steps.Email">
            <f-registration-email/>
          </template>
          <template v-else-if="$app.store.registration.currentStep === Steps.Link">
              <f-registration-link/>
          </template>
          <template v-else-if="$app.store.registration.currentStep === Steps.Error">
            <f-registration-error/>
          </template>
          <template v-else-if="$app.store.registration.currentStep === Steps.Success">
            <f-registration-success/>
          </template>
          <template v-else-if="$app.store.registration.currentStep === Steps.Loading">
              <m-loading-new v-show="true" />
          </template>
      </div>
      </div>
    </div>
  </div>
  
  <f-terms-modal v-model="$app.store.registration.isOpenTermsModal" />
</template>

<script setup lang="ts">
  import { useNuxtApp, useRouter, useRoute } from '#app'
  import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
  import { Icon } from '~/src/shared/constants/icons'
  import FTermsModal from '~/src/features/f-terms-modal/f-terms-modal.vue'
  import { Steps } from './steps'
  import fRegistrationChoice from '../f-registration-choice/f-registration-choice.vue'
  import fRegistrationEmail from '../f-registration-email/f-registration-email.vue'
  import fRegistrationLink from '../f-registration-link/f-registration-link.vue'
  import fRegistrationSuccess from '../f-registration-success/f-registration-success.vue'
  import fRegistrationError from '../f-registration-error/f-registration-error.vue'
  import { useRegistration } from './useRegistration'
  import { SignupMethods } from '~/src/shared/constants/signupMethods'
  import { setCookie } from '~/src/shared/helpers/cookie.helpers';
  import { useWeb3ModalAccount } from '@web3modal/ethers/vue'
  import { useWalletConnect } from '~/src/app/composables/useWalletConnect'
  import mLoadingNew from '~/src/shared/ui/molecules/m-loading-new/m-loading-new.vue'

  const { $app } = useNuxtApp()
  const router = useRouter()
  const route = useRoute()
  const {initWalletConnect} = useWalletConnect($app);
  const { continueLogin,  catchRegistration, } = useRegistration($app);
  const metamaskError = ref("");

  onMounted(() => {
    const referralCode = route.query?.referral
    const day = 86_400
    if (referralCode) {
        setCookie('referral_code', referralCode as string, {"max-age": day})
    }
        
    // if verify link
    if (route.query.code && route.query.email) {
        router.replace({'query': ''});
        $app.store.registration.currentStep = Steps.Loading;
        $app.store.registration.backendError = {value: '', field: 'default'};
        const body : any = { email: $app.filters.trimSpaceIntoString(route.query.email), code: $app.filters.trimSpaceIntoString(route.query.code) };
        const {accountMethod} = $app.store.auth;

        const catchRegistrationLink = (e) => {
            $app.store.registration.currentStep = Steps.Error;
            catchRegistration(e);
        }

        switch (accountMethod) {
            case 'metamask':
                body.fast = true;
                $app.api.eth.auth.confirmMetamask(body)
                .then((jwtResponse: any) => {
                    // TODO falling user/me
                    continueLogin(jwtResponse);
                })
                .catch((e) => {
                    catchRegistrationLink(e);
                });
                break;
            case 'telegram':
                body.telegram_data = JSON.stringify($app.store.authTelegram?.response);
                $app.api.eth.auth.confirmTelegram(body)
                .then((jwtResponse: any) => {
                    // TODO falling user/me
                    continueLogin(jwtResponse);
                })
                .catch((e) => {
                    catchRegistrationLink(e);
                });
                break;
            case 'apple':
                body.apple_token = $app.store.authTemp?.response;
                $app.api.eth.auth.confirmApple(body)
                .then((jwtResponse: any) => {
                    // TODO falling user/me
                    continueLogin(jwtResponse);
                })
                .catch((e) => {
                    catchRegistrationLink(e);
                });
                break;
            case 'facebook':
                body.facebook_id = $app.store.authTemp.response?.userID;
                $app.api.eth.auth.confirmFacebook(body)
                .then((jwtResponse: any) => {
                    // TODO falling user/me
                    continueLogin(jwtResponse);
                })
                .catch((e) => {
                    catchRegistrationLink(e);
                });
                break;
            case 'walletConnect':
                body.fast = true;
                body.wallet_connect_data = JSON.stringify($app.store.authTemp.response);
                $app.api.eth.auth.walletConnectConfirm(body)
                .then((jwtResponse: any) => {
                    // TODO falling user/me
                    continueLogin(jwtResponse);
                })
                .catch((e) => {
                    catchRegistrationLink(e);
                });
                break;
            default:
                $app.api.eth.auth.confirmFast(body)
                .then((jwtResponse: any) => {
                    // TODO falling user/me
                    continueLogin(jwtResponse);
                })
                .catch((e) => {
                    catchRegistrationLink(e);
                });
                break;
        }
    }

    // metamask
    $app.store.user.isMetamaskSupported = typeof (window as any).ethereum !== "undefined";
    if($app.store.user.isMetamaskSupported) {
        (window as any).ethereum.on("chainChanged", (chainId: string) => {
            if (chainId !== "0x1") {
                metamaskError.value = "This network is not supported. Please change the network to Ethereum."
            } else if (chainId === "0x1") {
                metamaskError.value = "";
            }
        });
    } else {
        console.log("Metamask is not installed");
    }
  });

  // google
  onMounted(() => {
      if($app.store.authGoogle.response?.email) {
          $app.store.registration.currentStep = Steps.Email
          $app.store.registration.currentSignup = SignupMethods.Google;
          $app.store.registration.firstName = $app.store.authGoogle.response.first_name;
          $app.store.registration.lastName = $app.store.authGoogle.response.last_name;
          $app.store.registration.email = $app.store.authGoogle.response.email;
      }
  });

  //refferal
  onMounted(() => {
      if (route.query.referral) {
          $app.store.auth.setRefCode({ref_code: route.query.referral});
      }
  })

  // reset 
  onUnmounted(() => {
    $app.store.registration.currentStep = Steps.Choice;
    $app.store.registration.isOpenTermsModal = false;
    $app.store.registration.currentSignup = SignupMethods.Email;
    $app.store.registration.backendError = {value: '', field: 'default'};
    $app.store.registration.metamaskData = {};
    $app.store.registration.firstName = '';
    $app.store.registration.lastName = '';
    $app.store.registration.email ='';
    $app.store.registration.phone = '';
  });

  // walletConnect
  const { address } = useWeb3ModalAccount()

  const handleWalletConnect = async () => {
    await initWalletConnect();

    $app.store.registration.currentSignup = SignupMethods.WalletConnect;
    $app.store.registration.currentStep = Steps.Email;

    $app.api.eth.auth.walletConnectGetAuthType({
        wallet_connect_data: JSON.stringify({
            signature: $app.store.registration.walletConnectData.signature,
            address: $app.store.registration.walletConnectData.walletAddress,
            message: $app.store.registration.walletConnectData?.signatureMessage,
        }),
    }).then((r: any) => {
        if(r.data.auth_type === 'registration') {
            $app.store.registration.currentSignup = SignupMethods.WalletConnect;
            $app.store.registration.currentStep = Steps.Email;
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
                continueLogin(jwtResponse);
            })
        }
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

<style lang="scss" src="./f-registration.scss" />

