<template>
      <m-modal v-if="!props.isBtc" modalSmall @close="close" v-model="isOpenModal">
        <article class="e-success-wrapper flex flex-col font-bold max-w-[343px] ">
            <div class="e-success--certificate">
                <NuxtImg class="e-success--certificate-img" src="/img/purchase/certificate-usdt.svg" />
                <div class="e-success--certificate-text">
                    <div class="e-success--certificate-text-name e-success--text-normal">John Adams</div>
                    <div class="e-success--certificate-text-amount e-success--text-normal">1,000</div>
                    <div class="e-success--certificate-text-amount-name e-success--text-normal">Bitcoin ETF Share</div>
                    <div class="e-success--certificate-text-text e-success--text-normal">Dividends Paid in USDT</div>
                    <div class="e-success--certificate-text-text e-success--text-normal">Maturity in: 1094 Days</div>
                </div>
            </div>

            <!-- <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5f3f777356db196b3d0ace96b36a9055745ac2e82605516d2c47b7d12e9625bd?apiKey=b494d51c483c4600bea3fdfaaa5f77d0&" alt="Descriptive alternative text" class="w-full aspect-[1.52]" /> -->
            <div class="e-success--timer-title e-success--text-primary e-success--text-normal">First Dividends Payout In</div>
            <div class="flex gap-2 justify-center px-16 mt-2 text-center">
            <div class="flex flex-col flex-1">
                <div class="flex gap-0.5 justify-between">
                <button class="e-success--timer-number e-success--text-blue e-success--text-normal justify-center aspect-[0.6]">2</button>
                <button class="e-success--timer-number e-success--text-blue e-success--text-normal justify-center aspect-[0.6]">3</button>
                </div>
                <p class="e-success--timer-number-name e-success--text-gray e-success--text-normal">Hours</p>
            </div>
            <div class="flex flex-col flex-1">
                <div class="flex gap-0.5 justify-between">
                <button class="e-success--timer-number e-success--text-blue e-success--text-normal justify-center aspect-[0.6]">5</button>
                <button class="e-success--timer-number e-success--text-blue e-success--text-normal justify-center aspect-[0.6]">9</button>
                </div>
                <p class="e-success--timer-number-name e-success--text-gray e-success--text-normal">Minutes</p>
            </div>
            <div class="flex flex-col flex-1">
                <div class="flex gap-0.5 justify-between">
                <button class="e-success--timer-number e-success--text-blue e-success--text-normal justify-center aspect-[0.6]">5</button>
                <button class="e-success--timer-number e-success--text-blue e-success--text-normal justify-center aspect-[0.6]">9</button>
                </div>
                <p class="e-success--timer-number-name e-success--text-gray e-success--text-normal">Seconds</p>
            </div>
            </div>
            <div class="e-success-title e-success--text-primary-big e-success--text-normal">Congratulations on your investment!</div>
            <p class="e-success-subtitle e-success--text-secondary e-success--text-normal">
            Your shares have been automatically issued as crypto tokens. From day one, your investment will start generating profits, paid out in Tether every day!
            </p>
            <button class="e-success-button e-success--text-inverse e-success--text-normal" tabindex="0">
            Open My Dashboard
            </button>
        </article>    
      </m-modal>

      <!-- BITCOIN -->
      <m-modal v-else-if="props.isBtc" modalSmall @close="close" v-model="isOpenModal">
        <article class="e-success-wrapper flex flex-col font-bold max-w-[343px] ">
            <div class="e-success--certificate">
                <NuxtImg class="e-success--certificate-img" src="/img/purchase/certificate-btc.svg" />
                <div class="e-success--certificate-text">
                    <div class="e-success--certificate-text-name e-success--text-normal">John Adams</div>
                    <div class="e-success--certificate-text-amount e-success--text-normal">1,000</div>
                    <div class="e-success--certificate-text-amount-name e-success--text-normal">Bitcoin ETF Share</div>
                    <div class="e-success--certificate-text-text e-success--text-normal">Dividends Paid in Bitcoin</div>
                    <div class="e-success--certificate-text-text e-success--text-normal">Maturity in: 1094 Days</div>
                </div>
            </div>

            <!-- <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5f3f777356db196b3d0ace96b36a9055745ac2e82605516d2c47b7d12e9625bd?apiKey=b494d51c483c4600bea3fdfaaa5f77d0&" alt="Descriptive alternative text" class="w-full aspect-[1.52]" /> -->
            <div class="e-success--timer-title e-success--text-primary e-success--text-normal">First Dividends Payout In</div>
            <div class="flex gap-2 justify-center px-16 mt-2 text-center">
            <div class="flex flex-col flex-1">
                <div class="flex gap-0.5 justify-between">
                <button class="e-success--timer-number e-success--text-blue e-success--text-normal justify-center aspect-[0.6]">2</button>
                <button class="e-success--timer-number e-success--text-blue e-success--text-normal justify-center aspect-[0.6]">3</button>
                </div>
                <p class="e-success--timer-number-name e-success--text-gray e-success--text-normal">Hours</p>
            </div>
            <div class="flex flex-col flex-1">
                <div class="flex gap-0.5 justify-between">
                <button class="e-success--timer-number e-success--text-blue e-success--text-normal justify-center aspect-[0.6]">5</button>
                <button class="e-success--timer-number e-success--text-blue e-success--text-normal justify-center aspect-[0.6]">9</button>
                </div>
                <p class="e-success--timer-number-name e-success--text-gray e-success--text-normal">Minutes</p>
            </div>
            <div class="flex flex-col flex-1">
                <div class="flex gap-0.5 justify-between">
                <button class="e-success--timer-number e-success--text-blue e-success--text-normal justify-center aspect-[0.6]">5</button>
                <button class="e-success--timer-number e-success--text-blue e-success--text-normal justify-center aspect-[0.6]">9</button>
                </div>
                <p class="e-success--timer-number-name e-success--text-gray e-success--text-normal">Seconds</p>
            </div>
            </div>
            <div class="e-success-title e-success--text-primary-big e-success--text-normal">Congratulations on your investment!</div>
            <p class="e-success-subtitle e-success--text-secondary e-success--text-normal">
            Your shares have been automatically issued as crypto tokens. From day one, your investment will start generating profits, paid out in Bitcoin every day!
            </p>
            <button class="e-success-button e-success--text-inverse e-success--text-normal" tabindex="0">
            Open My Dashboard
            </button>
        </article>    
      </m-modal>
  </template>
  
  <script setup lang="ts">
  import { useNuxtApp, useRouter, useRoute } from '#app'
  import { computed, ref } from 'vue'
  import { BrowserProvider, parseUnits } from "ethers";
  import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue'
  import { Log } from 'ethers';
  
  const props = withDefaults(
    defineProps<{
        modelValue: boolean,
        isBtc: boolean,
    }>(),
    {
        modelValue: false,
        isBtc: false,
    },
  )
  
  const { $app } = useNuxtApp()
  const router = useRouter()
  const route = useRoute()

  const emit = defineEmits(['update:modelValue', 'close', 'accept'])

  const isOpenModal = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    },
  })

  const close = () => {
    emit('close')
    isOpenModal.value = false;

    console.log(isOpenModal.value)
  }
  
  </script>
  
  <style lang="scss" src="./e-success-modal.scss" />
  
  