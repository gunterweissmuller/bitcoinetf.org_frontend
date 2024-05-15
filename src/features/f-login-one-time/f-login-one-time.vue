<template>
    <div class="f-login-one-time">
        Loading...
    </div>
</template>

<script setup lang="ts">
    import { useNuxtApp, useRouter } from '#app'
    import { onMounted } from 'vue';

    const { $app } = useNuxtApp()
    const router = useRouter()

    onMounted(()=>{
        router.push(`/personal/login${location.search}`);
    })
</script>

<style lang="scss" src="./f-login-one-time.scss" />

  