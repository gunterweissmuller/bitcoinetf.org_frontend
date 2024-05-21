<template>
    <div class="f-login">
        <div class="f-login__back" @click="$app.store.login.currentStep = Steps.Choice">
            <a-icon class="f-login__back-icon" width="24" :name="Icon.MonoChevronLeft" />
        </div>
        <h3 id="test_1" class="f-login__title">Log in</h3>
        <h5 class="f-login__subtitle">
            Please enter your email and password. No account?
            <nuxt-link to="/personal/registration">Create an account here.</nuxt-link>
        </h5>
        <form class="f-login__form" @submit.prevent="onSubmitEmailForm">
            <div id="test_2">
                <a-input
                class="f-login__email"
                label="Email"
                validation-reg-exp-key="email"
                required
                :error-text="emailErrorText"
                @blur="emailFieldBlurHandler"
                @update:is-valid="isEmailValid = $event"
                v-model="email"
                />
            </div>

            <a-input
                id="test_3"
                class="f-login__password"
                v-model="password"
                label="Password"
                type="password"
                @blur="passwordFieldBlurHandler"
                @update:is-valid="isPasswordValid = $event"
                required
            ></a-input>
            <div id="test_4" class="f-login__forgot">
                <span class="f-login__forgot-text" @click="goToReset">Forgot your password?</span>
            </div>
            <a-button
                id="test_5"
                class="f-login__button"
                text="Log in"
                :disabled="!isEmailValid || !password"
                type="submit"
            ></a-button>
            <a-button
                @click="
                () => {
                    $app.store.login.currentStep = Steps.OneTimeLink
                }
                "
                :icon="Icon.MonoLinkBlue"
                id="one-time-link"
                class="f-login__button-one-time"
                text="Sign in with a one-time link"
                variant="secondary"
            ></a-button>
            <p v-if="backendError" class="f-login__error">{{ $app.filters.capitalize(backendError) }}</p>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { useNuxtApp } from '#app'
    import { useLogin } from '../f-login/useLogin';
    import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
    import { Steps } from '../f-login/steps';
    import { Icon } from '~/src/shared/constants/icons';
    import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
    import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'

    const { $app } = useNuxtApp()
    const { onSubmitEmailForm, emailErrorText, emailFieldBlurHandler, isEmailValid, email, password, passwordFieldBlurHandler, isPasswordValid, backendError, goToReset } = useLogin($app);

</script>

<!-- todo split styles -->
<!-- <style lang="scss" src="./f-login-choice.scss" /> -->
