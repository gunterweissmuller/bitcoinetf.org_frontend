<template>
    <div class="f-login__wrapper">
        <!--todo img-->
        <nuxt-img
            class="f-login__img-cloud"
            :src="$app.store.user.theme === 'dark' ? '/img/cloud-error-dark.svg' : '/img/cloud-error.svg'"
        ></nuxt-img>
        <h3 id="test_1" class="f-login__title">Something went wrong!</h3>
        <h5 class="f-login__subtitle">Something must’ve gone wrong, please try again.</h5>
        <a-button class="f-login__button" text="Go back" @click="$app.store.login.currentStep = Steps.Choice"></a-button>
    </div>
</template>

<script setup lang="ts">
    import { useNuxtApp } from '#app'
    import { useLogin } from '../f-login/useLogin';
    import { Steps } from '../f-login/steps';
    import aButton from '~/src/shared/ui/atoms/a-button/a-button.vue';

</script>

<!-- todo split styles -->
<!-- <style lang="scss" src="./f-login-choice.scss" /> -->
