<template>
  Loading...
  </template>

  <script setup lang="ts">
  import { useNuxtApp, useRouter } from '#app'
  import { onMounted } from 'vue';
  import axios from "axios";
  import { SignupMethods } from '~/src/shared/constants/signupMethods';
  import { hostname } from '~/src/app/adapters/ethAdapter';

  const { $app } = useNuxtApp()
  const router = useRouter()

  onMounted(()=>{
    let searchReplaced = location.search.replace('/', '%2F').replace(':', "%3A");

    const refParam = $app.store.auth?.refCode ? "&ref_code=" + $app.store.auth.refCode : "";

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    axios.get(`https://${hostname}/v1/auth/provider/google-auth/init${searchReplaced}${refParam}`, {headers}).then((data: any) => {
        $app.store.authGoogle.setResponse({response: data.data.data, method: SignupMethods.Google});




        if(localStorage.getItem('googleRedirect')?.search('/tetherspecialnew') !== undefined && ( localStorage.getItem('googleRedirect')?.search('/tetherspecialnew') !== -1 || localStorage.getItem('googleRedirect')?.search('/tetherspecial') !== -1)) {
          localStorage.removeItem('googleRedirect');
          router.push("/tetherspecial");
        } else if(data.data.data.email) {
            router.push("/personal/registration");
        } else {
          router.push("/personal/login");
        }

        // if(localStorage.getItem('googleRedirect') == '/tetherspecialnew' || localStorage.getItem('googleRedirect') == '/tetherspecial' && data.data.data.email) {
        //   router.push("/tetherspecialnew");
        // }else if(data.data.data.email) {
        //   router.push("/personal/registration");
        // } else {
        //   router.push("/personal/login");
        // }
    })
  })


  definePageMeta({
    layout: 'auth',
  })
  </script>
