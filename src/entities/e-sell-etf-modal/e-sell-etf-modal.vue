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

                <a-button class="e-sell-etf-modal__button" :disabled="continueDisabled" @click="handleContinue" text="Yes, I am sure" variant="primary"></a-button>
                <a-button class="e-sell-etf-modal__button" @click="handleClose" text="Cancel" variant="secondary"></a-button>
            </template>

            <template v-else-if="currentStep === Steps.Sell">
                <div class="e-sell-etf-modal__title">
                    Sell your ETF Shares
                </div>

                <div class="e-sell-etf-modal__text">
                    You can sell your {{ $app.filters.rounded($app.store.user.sellShares?.amount) }} ETF shares for ${{ $app.filters.rounded($app.store.user.sellShares?.for) }} and retain all your dividends at the end of your investment period.
                </div>

                <div class="e-sell-etf-modal__timer">
                    <div class="e-sell-etf-modal__timer-title">Maturity in</div>
                    <div class="e-sell-etf-modal__timer-wrapper">
                        <div class="e-sell-etf-modal__timer-item ">
                            <div class="e-sell-etf-modal__timer-numbers">
                                <div v-for="char in String(displayDays)" class="e-sell-etf-modal__timer-number">{{ char }}</div>
                            </div>
                            <div class="e-sell-etf-modal__timer-number-text">Days</div>
                        </div>

                        <div class="e-sell-etf-modal__timer-item">
                            <div class="e-sell-etf-modal__timer-numbers">
                                <div v-for="char in String(displayHours)" class="e-sell-etf-modal__timer-number">{{ char }}</div>
                            </div>
                            <div class="e-sell-etf-modal__timer-number-text">Hours</div>
                        </div>

                        <div class="e-sell-etf-modal__timer-item">
                            <div class="e-sell-etf-modal__timer-numbers">
                                <div v-for="char in String(displayMinutes)" class="e-sell-etf-modal__timer-number">{{ char }}</div>
                            </div>
                            <div class="e-sell-etf-modal__timer-number-text">Minutes</div>
                        </div>

                        <div class="e-sell-etf-modal__timer-item">
                            <div class="e-sell-etf-modal__timer-numbers">
                                <div v-for="char in String(displaySeconds)" class="e-sell-etf-modal__timer-number">{{ char }}</div>
                            </div>
                            <div class="e-sell-etf-modal__timer-number-text">Seconds</div>
                        </div>
                    </div>

                </div>

                <a-button class="e-sell-etf-modal__button" @click="() => currentStep = Steps.Sure" text="Got it!" variant="primary"></a-button>
            </template>
        </div>
      </m-modal>
  </template>
  
<script setup lang="ts">
    import { useNuxtApp } from '#app';
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

    const currentStep = ref(Steps.Sell);

    const handleClose = () => {
        payAgreed.value = false;
        currentStep.value = Steps.Sell;
        props.close();
    }

    const handleContinue = () => {
        handleClose();
        navigateTo({name: 'personal-sell-etfs'})
    }

    // timer

    const time = ref({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const displayDays = computed(() => {
        return  "0".repeat((4 - String(time.value.days).length)) + time.value.days;
    });
    const displayHours = computed(() => {
        return String(time.value.hours).length < 2 ? "0" + time.value.hours : time.value.hours;
    })
    const displayMinutes = computed(() => {
        return String(time.value.minutes).length < 2 ? "0" + time.value.minutes : time.value.minutes;
    })
    const displaySeconds = computed(() => {
        return String(time.value.seconds).length < 2 ? "0" + time.value.seconds : time.value.seconds;
    })

    const startTimer = () => {
        const timer = setInterval(() => {
            time.value.seconds += 1;

            if(time.value.seconds >= 60) {
                time.value.seconds = 0;
                time.value.minutes += 1;
            }

            if(time.value.minutes >= 60) {
                time.value.minutes = 0;
                time.value.hours += 1;
            }

            if(time.value.hours >= 24) {
                time.value.hours = 0;
                time.value.days += 1;
            }
        }, 1000)
    }

    const initTimer = () => {
        if($app.store.user.sellShares?.created_at) {
            const tempDate = new Date();
            const tempTime = (tempDate.getTime() - $app.filters.dayjs($app.store.user.sellShares?.created_at).valueOf())/1000; // seconds after buy

            time.value.days = Math.floor(tempTime / (3600*24));
            time.value.hours = Math.floor(tempTime % (3600*24) / 3600);
            time.value.minutes = Math.floor(tempTime % 3600 / 60);
            time.value.seconds = Math.floor(tempTime % 60);

            startTimer();
        }
    }

    watch(
        () => $app.store.user.sellShares?.created_at,
        () => {
            initTimer()
        }
    )

    onMounted(() => {
        initTimer();
    })

</script>

<style lang="scss" src="./e-sell-etf-modal.scss" />
  
  