<template>
      <m-modal bgBasic @close="handleClose" :modalMobile="true" v-model="props.show">
        <div class="e-sell-etf-modal">

            <template v-if="currentStep === Steps.Sure">
                <div class="e-sell-etf-modal__title">
                    Are you sure?
                </div>

                <div class="e-sell-etf-modal__text">
                    Are you sure you are willing to sell your Bitcoin ETFs?
                </div>

                <div class="e-sell-etf-modal__agree">
                    <a-checkbox 
                        id="with_sure"
                        v-model="payAgreed"
                        label="<p>I agree to pay an early termination fee.</p>"
                        single />
                </div>

                <a-button class="e-sell-etf-modal__button" :disabled="continueDisabled" @click="() => currentStep = Steps.Sell" text="Yes, I am sure" variant="primary"></a-button>
                <a-button class="e-sell-etf-modal__button" @click="handleClose" text="Cancel" variant="secondary"></a-button>
            </template>

            <template v-else-if="currentStep === Steps.Sell">
                <div class="e-sell-etf-modal__title">
                    Sell your ETF Shares
                </div>

                <div class="e-sell-etf-modal__text">
                    You can sell your 25,584 ETF shares for $25,584 and retain all your dividends at the end of your investment period.
                </div>

                <div class="e-sell-etf-modal__timer">

                    <div class="e-sell-etf-modal__timer-title"></div>
                    <div class="e-sell-etf-modal__timer-wrapper">
                        <div class="e-sell-etf-modal__timer-item ">
                            <div class="e-sell-etf-modal__timer-numbers">
                                <div class="e-sell-etf-modal__timer-number">0</div>
                                <div class="e-sell-etf-modal__timer-number">0</div>
                                <div class="e-sell-etf-modal__timer-number">0</div>
                                <div class="e-sell-etf-modal__timer-number">0</div>
                            </div>
                            <div class="e-sell-etf-modal__timer-number-text">Days</div>
                        </div>

                        <div class="e-sell-etf-modal__timer-item">
                            <div class="e-sell-etf-modal__timer-numbers">
                                <div class="e-sell-etf-modal__timer-number">0</div>
                                <div class="e-sell-etf-modal__timer-number">0</div>
                            </div>
                            <div class="e-sell-etf-modal__timer-number-text">Seconds</div>
                        </div>

                        <div class="e-sell-etf-modal__timer-item">
                            <div class="e-sell-etf-modal__timer-numbers">
                                <div class="e-sell-etf-modal__timer-number">0</div>
                                <div class="e-sell-etf-modal__timer-number">0</div>
                            </div>
                            <div class="e-sell-etf-modal__timer-number-text">Minutes</div>
                        </div>

                        <div class="e-sell-etf-modal__timer-item">
                            <div class="e-sell-etf-modal__timer-numbers">
                                <div class="e-sell-etf-modal__timer-number">0</div>
                                <div class="e-sell-etf-modal__timer-number">0</div>
                            </div>
                            <div class="e-sell-etf-modal__timer-number-text">Seconds</div>
                        </div>
                    </div>

                </div>

                <a-button class="e-sell-etf-modal__button" @click="handleContinue" text="Got it!" variant="primary"></a-button>
            </template>
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
        navigateTo({name: 'personal-sell-etfs'})
    }
</script>

<style lang="scss" src="./e-sell-etf-modal.scss" />
  
  