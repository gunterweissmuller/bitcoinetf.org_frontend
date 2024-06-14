<template>
    <div class="f-login-one-time">
        <m-loading-new v-show="true" />
    </div>
</template>

<script setup lang="ts">
    import { useNuxtApp, useRouter } from '#app'
    import { onMounted } from 'vue';
    import MLoadingNew from '~/src/shared/ui/molecules/m-loading-new/m-loading-new.vue';

    const { $app } = useNuxtApp()
    const router = useRouter()

    onMounted(()=>{
        router.push(`/personal/login${location.search}`);
    })
</script>

<style lang="scss" src="./f-login-one-time.scss" />

  