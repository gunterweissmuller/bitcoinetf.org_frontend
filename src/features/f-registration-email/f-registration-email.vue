<template>
    <div class='f-registration-right__back' @click='handleEmailBack'>
        <a-icon class='f-registration-right__back-icon' width='24' :name='Icon.MonoChevronLeft' />
    </div>
    <h3 class="f-registration-right__title">Sign up with {{ currentSignup }}</h3>
    <h5 class="f-registration-right__subtitle">
        Enter your details below and press Continue. We will send you a confirmation code shortly.
    </h5>
    <form class="f-registration-right__form" @submit.prevent="onSubmitEmailForm">

        <a-input :errorText="backendError.value && backendError.field === 'first_name' ? backendError.value : ''" v-model="firstName" label="First name" required class="f-registration-right__name" />
        <a-input :errorText="backendError.value && backendError.field === 'last_name' ? backendError.value : ''"  v-model="lastName" label="Last name" required class="f-registration-right__name" />
        <a-input class="f-registration-right__email" label="Email" validation-reg-exp-key="email" :disabled="currentSignup === SignupMethods.Google || isEmailDisabled ? true : false" required
            :error-text="emailErrorText" @blur="emailFieldBlurHandler" @update:is-valid="isEmailValid = $event"
            v-model="email" />

    <div class="f-registration-right__wrap_phone">
        <vue-tel-input  mode='international' v-on:country-changed="countryChanged" v-model="phone" validCharactersOnly autoFormat :inputOptions="{'showDialCode':true, 'placeholder': 'Phone Number', 'required': true}" ></vue-tel-input>
        <p class="f-registration-right__error" v-if="backendError.value && backendError.field === 'phone'">{{ backendError.value }}</p>
    </div>

    <vue-turnstile :theme="$app.store.user.theme === 'dark' ? 'dark' : 'light'" :site-key="siteKey" v-model="token" class="captchaTurn" />
        <div class="f-registration-right__agree">
            <div class="mb-10">
                <a-checkbox v-model="registrationAgreedUS" id="with_email"
                    label="<p >I declare that I am neither a U.S. citizen nor a resident, nor am I subject to U.S. tax or legal jurisdiction.</p>"
                    single />
            </div>
            <a-checkbox v-model="registrationAgreedTerms" id="with_email1"
                label="<p>I agree to the <span class='link'>Terms & Conditions</a></p>" @label-click="openTermsModal"
                single />
        </div>

        <a-button class="f-registration-right__button f-registration-right__button-continue f-registration-right__button-center" :disabled="emailButtonDisabled || termsContinueDisabled" type="submit"
            text="Continue"></a-button>

        <p class="f-registration-right__error" v-if="backendError.value && backendError.field === 'default'">{{ backendError.value }}</p>
    </form>
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
    import VueTurnstile from 'vue-turnstile';
    import { Steps } from '../f-registration/steps';
    

    const { $app } = useNuxtApp()
    const router = useRouter()
    const route = useRoute()
    const {siteKey, phone, handleEmailBack, currentSignup, onSubmitEmailForm, backendError, firstName, lastName, isEmailDisabled, emailErrorText, emailFieldBlurHandler, isEmailValid, email, openTermsModal, countryChanged} = useRegistration($app);

    // Terms step
    const token = ref('')
    const registrationAgreedUS = ref(false)
    const registrationAgreedTerms = ref(false)

    const termsContinueDisabled = computed<boolean>(() => {
        return !registrationAgreedUS.value || !registrationAgreedTerms.value
    });

    const emailButtonDisabled = computed<boolean>(() => {
        return !isEmailValid.value || !firstName.value || !lastName.value || !Boolean(token.value) //!registrationAgreed.value
    })

</script>

<!-- <style lang="scss" src="./f-registration.scss" /> -->

