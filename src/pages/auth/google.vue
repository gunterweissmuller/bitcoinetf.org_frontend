<template>
    test
  </template>
  
  <script setup lang="ts">
  import { computed, ref, onMounted } from 'vue';
  import axios from "axios";

  onMounted(()=>{
    console.log(location.search);

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    axios.get("http://api.stage.techetf.org/v1/auth/provider/google-auth/init"+location.search, {headers}).then((data: any) => {
        console.log(data);
    })

  })


  definePageMeta({
    layout: 'auth',
  })
  </script>
  