<template>
    <div class='f-registration-right__back' @click='$router.back()'>
        <a-icon class='f-registration__back-icon' width='24' :name='Icon.MonoChevronLeft' />
    </div>
    <h3 class="f-registration-right__title">Sign up</h3>
    <h5 class="f-registration-right__subtitle">
        If you already have an account, you can
        <nuxt-link to="/personal/login">log in here.</nuxt-link>
    </h5>

    <div class="flex flex-col items-center pb-12">

        <div v-for="method in methods" @click="method.onClick" class="f-registration-right__button">
            <div class="f-registration-right__button-left">
                <NuxtImg :src="method.img" width="24" height="24" class="f-registration-right__button-img-method" loading="lazy" />
                {{method.name}}
            </div>
            <NuxtImg :src="$app.store.user.theme === 'dark' ? '/img/icons/mono/chevron-grey-right.svg' : '/img/icons/mono/chevron-grey-right.svg'" width="6" height="11" class="f-registration-right__button-img-arrow" loading="lazy" />
        </div>

        <component :is="'script'" src="https://telegram.org/js/telegram-widget.js?22"></component>

    </div>
</template>

<script setup lang="ts">
    import { useNuxtApp } from '#app'
    import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
    import { Icon } from '~/src/shared/constants/icons'
    import 'vue-tel-input/vue-tel-input.css';
    import { useRegistration } from '../f-registration/useRegistration'

    const { $app } = useNuxtApp()
    const {methods} = useRegistration($app);

</script>

<!-- <style lang="scss" src="./f-registration.scss" /> -->

