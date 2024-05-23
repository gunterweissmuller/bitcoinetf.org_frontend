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
    import { useNuxtApp} from '#app'
    const { $app } = useNuxtApp()

</script>

<!-- <style lang="scss" src="./f-registration.scss" /> -->

