<template>
    <div class='f-registration-right__back' @click='$router.back()'>
        <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
    </div>
    <h3 class="f-registration-right__title">Sign up</h3>
    <h5 class="f-registration-right__subtitle">
        If you already have an account, you can
        <nuxt-link to="/personal/login">log in here.</nuxt-link>
    </h5>

    <div class="flex flex-col items-center pb-12">

        <div v-for="method in methods" @click="method.onClick" class="f-registration-right__button">
            <div class="f-registration-right__button-left">
                <NuxtImg :src="method.img" width="24" height="24" class="f-registration-right__button-img-method" loading="lazy" />
                {{method.name}}
            </div>
            <NuxtImg :src="$app.store.user.theme === 'dark' ? '/img/icons/mono/chevron-grey-right.svg' : '/img/icons/mono/chevron-grey-right.svg'" width="6" height="11" class="f-registration-right__button-img-arrow" loading="lazy" />
        </div>

        <component :is="'script'" src="https://telegram.org/js/telegram-widget.js?22"></component>

    </div>
</template>

<script setup lang="ts">
    import { useNuxtApp, useRouter, useRoute } from '#app'
    import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
    import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
    import APincodeInput from '~/src/shared/ui/atoms/a-pincode-input/a-pincode-input.vue'
    import ACheckbox from '~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue'
    import { computed, ref } from 'vue'
    import MAccordion from '~/src/shared/ui/molecules/m-accordion/m-accordion.vue'
    import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
    import { Icon } from '~/src/shared/constants/icons'
    import FTermsModal from '~/src/features/f-terms-modal/f-terms-modal.vue'
    import VueTurnstile from 'vue-turnstile';
    import { SiweMessage } from 'siwe';
    import 'vue-tel-input/vue-tel-input.css';
    import { BrowserProvider, parseUnits } from "ethers";
    import { googleSdkLoaded, googleLogout  } from "vue3-google-login";
    import axios from "axios";
    import { SignupMethods } from '~/src/shared/constants/signupMethods'
    import { hostname } from '~/src/app/adapters/ethAdapter'
    import { document } from 'postcss'
    import { useConnectReplenishmentChannel } from '~/src/app/composables/useConnectReplenishmentChannel'

    const { $app } = useNuxtApp()
    const router = useRouter()
    const route = useRoute()

</script>

<style lang="scss" src="./f-registration.scss" />

