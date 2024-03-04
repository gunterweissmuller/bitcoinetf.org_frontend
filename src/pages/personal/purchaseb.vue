<template>
    <a-button
        :icon="Icon.MonoPlus"
        size="small"
        class="w-aside__button-buy mt-2"
        text="Buy Bitcoin ETF Shares2"
        @click="() => {
            
            $app.store.user.setInvestModalReinvest({reinvest: false});
            $app.store.user.setIsInvestModalShow({show: true});
            console.log('test',  $app.store.user.isInvestModalShow)
        }"
    />

    <a-button
        :icon="Icon.MonoPlus"
        size="small"
        class="w-aside__button-buy mt-2"
        text="Buy Bitcoin ETF Shares reinvest"
        @click="() => {
            $app.store.user.setInvestModalReinvest({reinvest: true});
            $app.store.user.setIsInvestModalShow({show: true});
        }"
    />
</template>
  
  <script setup lang="ts">
  import { Icon } from '~/src/shared/constants/icons'
  import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
//   import { useNuxtApp, useRouter, useRoute } from '#app'

//   const { $app } = useNuxtApp()
  
  </script>