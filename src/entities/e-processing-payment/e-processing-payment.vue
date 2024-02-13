<template>
  <div class="e-processing-payment">
    <div class="e-processing-payment__icon">
      <div class="e-processing-payment__icon-wrapper">
        <a-icon :name="Icon.MonoInfo" width="22" height="22"></a-icon>
      </div>
    </div>
    <div class="e-processing-payment__info">
      <h4 class="e-processing-payment__info-title">Processing your payment</h4>
      <span class="e-processing-payment__info-description"
        >We will notify you as soon as the payment has been processed.</span
      >
    </div>
  </div>
</template>

<style src="./e-processing-payment.scss" lang="scss" />

<script setup lang="ts">
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
</script>
