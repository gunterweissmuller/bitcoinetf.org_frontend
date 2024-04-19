<template>
    <m-modal :modalSmall="true"  @close="handleClose" v-model="props.show">
      <div class="e-sell-etf-modal">
        <div class="e-sell-etf-modal-wrapper">
            <div class="e-sell-etf-modal__title">
                Not enough balance
            </div>

            <div class="e-sell-etf-modal__text">
                Your balance must reach above $250 in order to use Bitcoin On-Chain withdrawals. Use Bitcoin Lightning for daily withdrawals without limit.
            </div>

            <a-button class="e-sell-etf-modal__button" @click="handleContinue" text="Got it!" variant="primary"></a-button>
        </div>
      </div>
    </m-modal>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue';
  import aCheckbox from '~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue';
  import aButton from '~/src/shared/ui/atoms/a-button/a-button.vue';
  import { useRouter } from '#vue-router';

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
      handleClose();
    //   navigateTo({name: 'personal-sell-etfs'})
  }
</script>

<style lang="scss" src="./e-not-enough-balance-modal.scss" />

