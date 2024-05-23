<template>
    <div class="f-login__wrapper">
        <nuxt-img
            class="f-login__img-done"
            :src="$app.store.user.theme === 'dark' ? '/img/wallet/done-dark.svg' : '/img/wallet/done.svg'"
        ></nuxt-img>
        <h3 id="test_1" class="f-login__title">Check your email for a one-time link</h3>
        <h5 class="f-login__subtitle">
            Check your inbox for a one-time link at {{ $app.store.login.email }}. If you don’t see the email, ensure that your email
            address is verified and check your spam folder.
        </h5>
        <a-button
            class="f-login__button"
            :text="$app.store.login.timerStarted ? `Resend Link ${$app.store.login.timeLeft} sec.` : 'Resend Link'"
            @click="resendCodeClick"
            :disabled="$app.store.login.timerStarted"
            variant="tertiary"
        ></a-button>
    </div>
</template>

<script setup lang="ts">
    import { useNuxtApp } from '#app'
    import { useLogin } from '../f-login/useLogin';
    import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'

    const { $app } = useNuxtApp()
    const { resendCodeClick } = useLogin($app);

</script>

<!-- todo split styles -->
<!-- <style lang="scss" src="./f-login-choice.scss" /> -->
