<template>
    <div class="f-verify-email">
        <m-loading-new v-show="true" />
    </div>
</template>

<script setup lang="ts">
    import { useNuxtApp, useRouter } from '#app'
    import { onMounted } from 'vue';
    import mLoadingNew from '~/src/shared/ui/molecules/m-loading-new/m-loading-new.vue';

    const { $app } = useNuxtApp()
    const router = useRouter()

    onMounted(()=>{

        if(localStorage.getItem('verifyLinkRedirect')?.search('/tetherspecial') !== -1) {
          localStorage.removeItem('verifyLinkRedirect');
          router.push(`/tetherspecial${location.search}`);
        } else {
            router.push(`/personal/registration${location.search}`);
        }

    })
</script>

<style lang="scss" src="./f-verify-email.scss" />

  