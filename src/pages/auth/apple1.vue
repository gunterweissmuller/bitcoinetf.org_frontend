<template>
Loading...
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
    
})


definePageMeta({
    layout: 'auth',
})
</script>
