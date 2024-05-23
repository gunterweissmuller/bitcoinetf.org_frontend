<template>
    <div class="f-login">
        <div class="f-login__back" @click="$app.store.login.currentStep = Steps.Login">
            <a-icon class="f-login__back-icon" width="24" :name="Icon.MonoChevronLeft" />
        </div>
        <h3 id="test_1" class="f-login__title">Log in with a one-time link</h3>
        <h5 class="f-login__subtitle">
            Enter the verified email address registered with your account, and we’ll send you a link to log in.
        </h5>
        <form class="f-login__form" @submit.prevent="onSubmitOneTimeLink">
            <div id="test_2">
                <a-input
                class="f-login__email"
                label="Email"
                validation-reg-exp-key="email"
                required
                :error-text="emailErrorText"
                @blur="emailFieldBlurHandler"
                @update:is-valid="isEmailValid = $event"
                v-model="$app.store.login.email"
                />
            </div>

            <a-button
                id="test_5"
                class="f-login__button"
                text="Log in"
                :disabled="!isEmailValid"
                type="submit"
            ></a-button>
            <p v-if="backendError" class="f-login__error">{{ $app.filters.capitalize(backendError) }}</p>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { useNuxtApp } from '#app'
    import { useLogin } from '../f-login/useLogin';
    import { Steps } from '../f-login/steps';
    import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
    import { Icon } from '~/src/shared/constants/icons';
    import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
    import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'

    const { $app } = useNuxtApp()
    const { emailErrorText, emailFieldBlurHandler, isEmailValid, backendError, onSubmitOneTimeLink } = useLogin($app);

</script>

<!-- todo split styles -->
<!-- <style lang="scss" src="./f-login-choice.scss" /> -->
