<template>
Loading...

<div class="AppleIDSignInOnSuccess">
    
</div>

<div class="AppleIDSignInOnFailure">
    
</div>

</template>

<script setup lang="ts">
import { useNuxtApp, useRouter } from '#app'
import { onMounted } from 'vue';
import axios from "axios";
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

    // Listen for authorization success.
document.addEventListener('AppleIDSignInOnSuccess', (event) => {
    // Handle successful response.
    console.log(event.detail.data);
});


// Listen for authorization failures.
document.addEventListener('AppleIDSignInOnFailure', (event) => {
     // Handle error.
     console.log(event.detail.error);
});
    
})


definePageMeta({
    layout: 'auth',
})
</script>
