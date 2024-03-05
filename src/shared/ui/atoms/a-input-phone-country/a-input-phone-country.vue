<template>
    <div class="container">
    <div class="form">
        <div class="field">
            <label for="phone">Ваш телефон:</label>
            <input type="text" id="phone" name="phone" autofocus="true" placeholder="9990000000">
        </div>
    </div>
</div>
  </template>
  
  <script lang="ts" setup>
  import { computed, ref, reactive, nextTick, watchEffect, onMounted, onBeforeMount, watch } from 'vue'
  import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile'
  import { validatePhoneNumberLength } from 'libphonenumber-js'
  import { ValidatePhoneNumberLengthResult } from 'libphonenumber-js/types'
  import { useNuxtApp } from '#app'
  import ATooltip from '~/src/shared/ui/atoms/a-tooltip/a-tooltip.vue'
  import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
  import { findCountryByParams } from '~/src/shared/constants/phoneCountryCodes'
  import phoneNumberSettings from '~/src/shared/constants/phoneNumberSettings'
  import { Icon } from '~/src/shared/constants/icons'
  
  const { $app } = useNuxtApp()
  
  const props = withDefaults(
    defineProps<{
      test?: any
    }>(),
    {
      test: ''
    },
  )
  
 
  </script>
  
  <script lang="ts">
  export default {
    inheritAttrs: false,
  }
  </script>
  
  <style lang="scss" src="./a-input-phone-country.scss" />
  