<template>
  <m-loading-new v-show="true" />
</template>

<script setup lang="ts">
  import { useNuxtApp, useRouter, useRoute } from '#app'
  import { SignupMethods } from '~/src/shared/constants/signupMethods';
  import mLoadingNew from '~/src/shared/ui/molecules/m-loading-new/m-loading-new.vue';

  const { $app } = useNuxtApp()
  const router = useRouter()

  onMounted(()=>{

    function searchParamsToJson(searchParams) {
      if (searchParams.startsWith('?')) {
        searchParams = searchParams.substr(1);
      }

      const pairs = searchParams.split('&');

      const result = {};

      pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if(key === 'id' || key === 'auth_date') {
          result[key] = +decodeURIComponent(value || '');
        } else {
          result[key] = decodeURIComponent(value || '');
        }
      });

      return result;
    }

    const tgData = searchParamsToJson(window.location.search);

    $app.api.eth.auth.telegramGetAuthType({
      telegram_data: JSON.stringify(tgData),
    }).then((r: any) => {
      if(r.data.auth_type === 'registration') {
        $app.store.authTelegram.setResponse({response: tgData, method: SignupMethods.Telegram});
        router.push("/personal/registration");
      } else {
        $app.api.eth.auth.
          loginTelegram({
            telegram_data: JSON.stringify(tgData),
          })
            .then((jwtResponse: any) => {
              $app.store.auth.setTokens(jwtResponse.data)
            })
            .then(async () => {
              await $app.api.eth.auth.getUser().then((resp) => {
                $app.store.user.info = resp?.data
              });

              await router.push('/personal/fund/portfolio')
            });
      }
    })
  });

  definePageMeta({
    layout: 'auth',
  })
</script>
