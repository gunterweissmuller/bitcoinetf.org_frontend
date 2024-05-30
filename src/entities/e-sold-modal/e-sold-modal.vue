<template>
      <m-modal bgBasic @close="handleClose" full-screen :modalMobile="true" v-model="props.show">
        <div class="e-sold-modal">

                <nuxt-img class="e-sold-modal__img" :src="$app.store.user.theme === 'dark' ? '/img/wallet/done-dark.svg' : '/img/wallet/done.svg'"></nuxt-img>

                <div class="e-sold-modal__title">
                    Sold!
                </div>

                <div class="e-sold-modal__text">
                    Your Bitcoin ETF Shares have been sold, your money will be delivered to you destination address shortly.
                </div>

                <a-button class="e-sold-modal__button" @click="handleContinue" text="Got it!" variant="primary"></a-button>
        </div>
      </m-modal>
  </template>
  
<script setup lang="ts">
    import { useNuxtApp } from '#app'
    import { computed, ref } from 'vue'
    import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue';
    import aCheckbox from '~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue';
    import aButton from '~/src/shared/ui/atoms/a-button/a-button.vue';
    import { useRouter } from '#vue-router';

    const { $app } = useNuxtApp()

    const props = withDefaults(
        defineProps<{
            show?: boolean
            close?: any
        }>(),
        {
            show: false,
            close: () => {}
        },
    )

    const router = useRouter();

    // agree 
    const payAgreed = ref(false)

    const continueDisabled = computed<boolean>(() => {
        return !payAgreed.value 
    });

    enum Steps {
        Sure = "Sure",
        Sell = "Sell"
    }

    const currentStep = ref(Steps.Sure);

    const handleClose = () => {
        payAgreed.value = false;
        currentStep.value = Steps.Sure;
        props.close();
    }

    const handleContinue = () => {
        $app.api.eth.billingEth
        .getValuate()
        .then((response: any) => {
            $app.store.user.sellShares = Object.assign($app.store.user.sellShares, response.data);
            handleClose();
            navigateTo({name: 'personal-etfs'});
        })
        .catch(() => {
            // Todo: notify something went wrond
        })
    }
</script>

<style lang="scss" src="./e-sold-modal.scss" />
  
  