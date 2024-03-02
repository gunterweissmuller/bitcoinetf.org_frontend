<template>
  Loading...
</template>

<script setup lang="ts">
  import { useNuxtApp, useRouter, useRoute } from '#app'
  const { $app } = useNuxtApp()

  onMounted(()=>{
    const search = location.search.substring(1);

    $app.api.eth.auth.telegramGetAuthType({
      telegram_data: '{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'
    })
  });

  definePageMeta({
    layout: 'auth',
  })
</script>
