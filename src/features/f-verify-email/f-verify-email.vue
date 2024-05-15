<template>
    <div class="f-verify-email">
        Loading...
    </div>
</template>

<script setup lang="ts">
    import { useNuxtApp, useRouter } from '#app'
    import { onMounted } from 'vue';

    const { $app } = useNuxtApp()
    const router = useRouter()

    onMounted(()=>{

        if(localStorage.getItem('verifyLinkRedirect')?.search('/tetherspecial') !== -1) {
          localStorage.removeItem('googleRedirect');
          router.push(`/tetherspecial${location.search}`);
        } else {
            router.push(`/personal/registration${location.search}`);
        }

    })
</script>

<style lang="scss" src="./f-verify-email.scss" />

  