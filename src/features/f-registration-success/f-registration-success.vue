<template>
    <div class="f-registration-right__wrapper">
        <nuxt-img class="f-registration-right__img-done" :src=" $app.store.user.theme === 'dark' ? '/img/wallet/done-dark.svg' : '/img/wallet/done.svg'"></nuxt-img>
        <h3 class="f-registration-right__title">
            Your email has been verified
        </h3>
        <h5 class="f-registration-right__subtitle">Your email was successfully verified, we will automatically redirect you to the next step.</h5>
    </div>
</template>

<script setup lang="ts">
    import { useNuxtApp, useRouter, useRoute } from '#app'
    import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
    import { Icon } from '~/src/shared/constants/icons'
    import 'vue-tel-input/vue-tel-input.css';
    import aInput from '~/src/shared/ui/atoms/a-input/a-input.vue';
    import aCheckbox from '~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue';
    import aButton from '~/src/shared/ui/atoms/a-button/a-button.vue';
    import { useRegistration } from '../f-registration/useRegistration'
    import 'vue-tel-input/vue-tel-input.css';
    import { SignupMethods } from '~/src/shared/constants/signupMethods';
    

    const { $app } = useNuxtApp()
    const router = useRouter()
    const route = useRoute()
    const {timerStarted, pincodeTrigger, isCodeCorrect, resendCodeClick, timeLeft} = useRegistration($app);

</script>

<!-- <style lang="scss" src="./f-registration.scss" /> -->

