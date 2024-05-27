<template>
    <p class="f-registration-right__error" v-if="$app.store.registration.backendError.value && $app.store.registration.backendError.field === 'default'">{{ $app.store.registration.backendError.value }}</p>
    <a-button @click="() => router.go(0)" text="Try Again" variant="tertiary"></a-button>
</template>

<script setup lang="ts">
    import { useNuxtApp, useRouter } from '#app'
    import aButton from '~/src/shared/ui/atoms/a-button/a-button.vue';

    const { $app } = useNuxtApp()
    const router = useRouter()

</script>

<!-- <style lang="scss" src="./f-registration.scss" /> -->

