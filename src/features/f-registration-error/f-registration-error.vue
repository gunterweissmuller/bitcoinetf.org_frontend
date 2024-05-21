<template>
    <p class="f-registration-right__error" v-if="backendError.value && backendError.field === 'default'">{{ backendError.value }}</p>
    <a-button @click="() => router.go(0)" text="Try Again" variant="tertiary"></a-button>
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
    const {backendError} = useRegistration($app);

</script>

<!-- <style lang="scss" src="./f-registration.scss" /> -->

