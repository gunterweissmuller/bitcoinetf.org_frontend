<template>
    <h3 class="f-registration-right__title">
        Verify your Email
    </h3>
    <h5 class="f-registration-right__subtitle">Please open the link we just sent to your email in order to continue.</h5>

    <a-button size="no-padding" :disabled="$app.store.registration.timerStarted" class="f-registration-right__button f-registration-right__button-resend-link" :text="$app.store.registration.timerStarted ? `Resend Link ${$app.store.registration.timeLeft} sec.` : 'Resend Link'"
        variant="tertiary" @click="resendCodeClick" />
</template>

<script setup lang="ts">
    import { useNuxtApp} from '#app'
    import aButton from '~/src/shared/ui/atoms/a-button/a-button.vue';
    import { useRegistration } from '../f-registration/useRegistration'
    
    const { $app } = useNuxtApp()
    const {resendCodeClick} = useRegistration($app);

    onUnmounted(() => {
        $app.store.registration.timerStarted = false;
        $app.store.registration.timeLeft = 0;
        $app.store.registration.timer = null;
    })
</script>

<!-- <style lang="scss" src="./f-registration.scss" /> -->

