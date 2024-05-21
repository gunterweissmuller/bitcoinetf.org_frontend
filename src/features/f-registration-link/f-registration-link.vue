<template>
    <h3 class="f-registration-right__title">
        Verify your Email
    </h3>
    <h5 class="f-registration-right__subtitle">Please open the link we just sent to your email in order to continue.</h5>

    <a-button size="no-padding" :disabled="timerStarted" class="f-registration-right__button f-registration-right__button-resend-link" :text="timerStarted ? `Resend Link ${timeLeft} sec.` : 'Resend Link'"
        :loading="pincodeTrigger && !isCodeCorrect" variant="tertiary" @click="resendCodeClick" />
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

