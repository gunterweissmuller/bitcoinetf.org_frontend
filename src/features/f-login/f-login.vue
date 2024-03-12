<template>
  <template v-if="currentStep === Steps.Choice">

    <div class="f-login">
      <div class='f-login__back' @click='$router.back()'>
        <a-icon class='f-login__back-icon' width='24' :name='Icon.MonoChevronLeft' />
      </div>
      <h3 id="test_1" class="f-login__title">Log in</h3>
      <h5 class="f-login__subtitle">
        Please enter your email and password to get started. No account?
        <nuxt-link to="/personal/registration">Create an account here.</nuxt-link>
      </h5>

      <div class="flex flex-col items-center pb-12">
        <div @click="choiceToEmail"
          class="flex justify-center items-center px-16 py-5  max-w-full text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg max-w-[410px] w-full max-md:px-5 cursor-pointer">
          <div class="flex gap-2 items-center">
            <NuxtImg src="/img/icons/mono/mail-light.svg" width="18" height="14" class="aspect-square w-[18px]" />
            <div class="grow">Log in with Email</div>
          </div>
        </div>

        <div
          @click="handleMetamaskConnect"
          class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5 cursor-pointer">
          <div class="flex gap-2 items-center">
            <NuxtImg src="/img/icons/colorful/metamask.svg" width="18" height="18" class="aspect-square w-[18px]" />
            <div class="grow">Log in with Metamask</div>
          </div>
        </div>

        <div
          @click="handleGoogleConnect"
          class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5 cursor-pointer">
          <div class="flex gap-2 items-center">
            <NuxtImg src="/img/icons/colorful/google.svg" width="18" height="18" class="aspect-square w-[18px]" />
            <div class="grow">Log in with Google</div>
          </div>
        </div>

        <!--<div
          class="flex justify-center items-center px-16 py-5 mt-4 max-w-full text-base font-bold whitespace-nowrap bg-white rounded-lg shadow-sm text-zinc-800 max-w-[410px] w-full max-md:px-5">
          <div class="flex gap-2 items-center">
            <NuxtImg src="/img/icons/mono/apple.svg" width="18" height="18" class="self-start aspect-square w-[18px]" />
            <div class="grow">Log in with Apple</div>
          </div>
        </div>-->
      </div>
    </div>




  </template>

  <template v-else-if="currentStep === Steps.Login">
    <div class="f-login">
      <div class='f-login__back' @click='currentStep = Steps.Choice'>
        <a-icon class='f-login__back-icon' width='24' :name='Icon.MonoChevronLeft' />
      </div>
      <h3 id="test_1" class="f-login__title">Log in</h3>
      <h5 class="f-login__subtitle">
        Please enter your email and password to get started. No account?
        <nuxt-link to="/personal/registration">Create an account here.</nuxt-link>
      </h5>
      <form class="f-login__form" @submit.prevent="onSubmitEmailForm">
        <div id="test_2">
          <a-input class="f-login__email" label="Email" validation-reg-exp-key="email" required
            :error-text="emailErrorText" @blur="emailFieldBlurHandler" @update:is-valid="isEmailValid = $event"
            v-model="email" />
        </div>

        <a-input id="test_3" class="f-login__password" v-model="password" label="Password" type="password"
          @blur="passwordFieldBlurHandler" @update:is-valid="isPasswordValid = $event" required></a-input>
        <div id="test_4" class="f-login__forgot">
          <span class="f-login__forgot-text" @click="onForgotPasswordClick">Forgot your password?</span>
        </div>
        <a-button id="test_5" class="f-login__button" text="Log in" :disabled="!isEmailValid || !password"
          type="submit"></a-button>
        <p v-if="backendError" class="f-login__error">{{ $app.filters.capitalize(backendError) }}</p>
      </form>
    </div>
  </template>

  <template v-else-if="currentStep === Steps.Loading">
    <div class="f-login">
      Loading...
    </div>
  </template>
</template>

<script setup lang="ts">
import { useNuxtApp, useRouter } from '#app'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import axios from "axios";
import { SignupMethods } from '~/src/shared/constants/signupMethods'
import { HttpStatusCode } from '~/src/shared/constants/httpStatusCodes'
import { SiweMessage } from 'siwe'
import { computed, ref } from 'vue'
import { BrowserProvider, parseUnits } from "ethers";
import { hostname } from '~/src/app/adapters/ethAdapter'

const { $app } = useNuxtApp()
const router = useRouter()

const enum Steps {
  Choice = 'Choice',
  Login = 'Login',
  Loading = 'Loading',
}
const currentLogin = ref(SignupMethods.Email);
const currentStep = ref(Steps.Choice)

// Choice step

const choiceToEmail = () => {
  currentStep.value = Steps.Login
}


// Email Field
const backendError = ref('')
const email = ref(process.dev ? 'emard.roselyn11136@yahoo.com' : '')
const emailErrorText = ref('')
const isEmailValid = ref(false)

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

// Password Field
const password = ref(process.dev ? 'k3kLXI0AEykmcJFc3dV44fSNDA6-jjvtiWDWPuT0n7DjzqmYPIm' : '')
const passwordErrorText = ref('')
const isPasswordValid = ref(false)

function passwordFieldBlurHandler() {
  if (isPasswordValid.value) {
    passwordErrorText.value = ''
    return
  }

  passwordErrorText.value = 'Required'
}

const isSubmitEmailForm = ref(false);

const onSubmitEmailForm = () => {

  if(isSubmitEmailForm.value) return;
  isSubmitEmailForm.value = true;

  $app.api.eth.auth
    .login({ email: $app.filters.trimSpaceIntoString(email.value), password: $app.filters.trimSpaceIntoString(password.value) })
    .then((jwtResponse: any) => {
      $app.store.auth.setTokens(jwtResponse.data)
    })
    .then(async () => {
      isSubmitEmailForm.value = false;

      await $app.api.eth.auth.getUser().then((resp) => {
        $app.store.user.info = resp?.data
      })

      await $app.store.auth.reInitData()
      await router.push('/personal/analytics/performance')
    })
    .catch((e) => {
      isSubmitEmailForm.value = false;
      if (e?.errors?.error?.message) {
        backendError.value = e.errors.error.message
      } else {
        backendError.value = 'Something went wrong'
      }

      if(e?.errors === HttpStatusCode.CONFLICT) {
        backendError.value = 'email is already in use';
      }
    })
}

// google

const googleUrl = ref("");

const isMetamaskSupported = ref(false);
const address = ref("");
const metamaskError = ref("");
const computedAddress = computed(() => address.value.substring(0, 8) + '...');

onMounted(() => {

  isMetamaskSupported.value = typeof (window as any).ethereum !== "undefined";

  if(isMetamaskSupported.value) {
    (window as any).ethereum.on("chainChanged", (chainId: string) => {
      console.log(chainId);
      if (chainId !== "0x1") {
        metamaskError.value = "This network is not supported. Please change the network to Ethereum."
      } else if (chainId === "0x1") {
        metamaskError.value = "";
      }
    });
  } else {
    console.log("Metamask is not installed");
  }

  axios.get(`https://${hostname}/v1/auth/provider/google-auth/redirect-url`).then((url: any) => {
    googleUrl.value = url.data.url //.replace("https%3A%2F%2Ffront.stage.techetf.org", "http%3A%2F%2Flocalhost:3000");
  });

  if($app.store.authGoogle.response?.access_token) {
    currentStep.value = Steps.Loading;

    $app.store.auth.setTokens($app.store.authGoogle.response)
    $app.store.authGoogle.setResponse({}, SignupMethods.Google);
    $app.api.eth.auth.getUser().then((resp) => {
      $app.store.user.info = resp?.data
    })

    $app.store.auth.reInitData()
    router.push('/personal/analytics/performance')

  }
});

const handleGoogleConnect = () => {
  currentLogin.value = SignupMethods.Google;
  window.location.href = googleUrl.value;
}

const metamaskSignatureMessage = ref('')
const metamaskSignature = ref('')
const metamaskWalletAddress = ref('')

const handleMetamaskConnect = async () => {
  //if metamask is not installed
  if (!isMetamaskSupported.value) {
    // window.location.href = 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
    window.open('https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn');
    return;
  }

  //currentSignup.value = SignupMethods.Metamask;

  //get accounts
  (window as any).ethereum.request({ method: "eth_requestAccounts" }).then((accounts: string[]) => {
    address.value = accounts[0];

    //get chain id
    (window as any).ethereum.request({
      "method": "eth_chainId",
      "params": []
    }).then((chainId: string) => {
      // let chainIdDec = parseInt(chainId, 16);

      //switch to eth chain
      (window as any).ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: "0x1" }] }).then(async () => {

        axios.get(`https://${hostname}/v1/auth/provider/metamask/message`).then(async (res: any) => {
          metamaskSignatureMessage.value = res.data.message;

          const provider = new BrowserProvider((window as any).ethereum);
          const signer = await provider.getSigner();
          metamaskWalletAddress.value = signer.address;

          const message = new SiweMessage({
            domain: window.location.host,
            address: signer.address, // error with accounts[0] ?
            statement: res.data.message,
            uri: window.location.origin,
            version: '1',
            chainId: 1
          });
          //message.prepareMessage()

          const msg = `${window.location.host} wants you to sign in with your Ethereum account:\n${accounts[0]}\n\nI accept the MetaMask Terms of Service: https://community.metamask.io/tos\n\nURI: ${window.location.origin}\nVersion: 1\nChain ID: 1\nNonce: 32891757\nIssued At: 2021-09-30T16:25:24.000Z`;

          //sign message
          (window as any).ethereum.request({
            "method": "personal_sign",
            "params": [
              //   msg,
              res.data.message,
              accounts[0],
            ]
          }).then((msg: string) => {
            console.log("SIGNED MSG", msg);
            metamaskSignature.value = msg;
            $app.api.eth.auth
              .loginMetamask({ signature: msg, message: res.data.message, wallet_address: signer.address})
              .then((jwtResponse: any) => {
                // TODO falling user/me
                $app.store.auth.setTokens(jwtResponse.data)
                //confirmResponse.value = jwtResponse.data
                //currentStep.value = Steps.Bonus
              })
              .then(async () => {
                await $app.api.eth.auth.getUser().then((resp) => {
                  $app.store.user.info = resp?.data
                })

                $app.store.auth.reInitData()
                router.push('/personal/analytics/performance')
              })
              .catch((e) => {
                if (e?.errors?.error?.message) {
                  backendError.value = e.errors.error.message
                } else {
                  backendError.value = 'Something went wrong'
                }
              })
            //currentStep.value = Steps.Email;
          }).catch((err: any) => {
            console.error(err);
          });

        }).catch((err: any) => {
          console.log(err);
        });
      }).catch((err: any) => {
        console.log(err);
      });

    }).catch((err: any) => {
      console.error(err);
    });

  }).catch((err: any) => {
    console.error(err);
  });
}

const onForgotPasswordClick = () => {
  router.push('/personal/reset')
}
</script>

<style lang="scss" src="./f-login.scss"/>
