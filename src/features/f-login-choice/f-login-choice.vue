<template>
    <div class="f-registration__back" @click="$router.back()">
        <a-icon class="f-registration__back-icon" width="24" :name="Icon.MonoChevronLeft" />
    </div>
    <h3 class="f-registration__title">Log in</h3>
    <h5 class="f-registration__subtitle">
        Chose your log in method. If you already have an account, No account?
        <nuxt-link to="/personal/registration">Create an account here.</nuxt-link>
    </h5>

    <div class="flex flex-col items-center pb-12">
    <div v-for="method in methods" @click="method.onClick" class="f-login-new__button">
        <div class="f-login-new__button-left">
            <NuxtImg
                :src="method.img"
                width="24"
                height="24"
                class="f-login-new__button-img-method"
                loading="lazy"
            />
            {{ method.name }}
        </div>
        <NuxtImg
        :src="
            $app.store.user.theme === 'dark'
            ? '/img/icons/mono/chevron-grey-right.svg'
            : '/img/icons/mono/chevron-grey-right.svg'
        "
        width="6"
        height="11"
        class="f-login-new__button-img-arrow"
        loading="lazy"
        />
    </div>

        <component :is="'script'" src="https://telegram.org/js/telegram-widget.js?22"></component>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { useLogin } from '../f-login/useLogin';

const { $app } = useNuxtApp()
const { methods } = useLogin($app);

</script>

<!-- todo split styles -->
<!-- <style lang="scss" src="./f-login-choice.scss" /> -->
