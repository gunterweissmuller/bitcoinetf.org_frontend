<template>
  <div
    class="dropdown__amount"
    :class="{ 'dropdown__amount--transparent': type != 'default' }"
    v-on-click-outside="closeDropMenu"
  >
    <div class="dropdown__amount-active-item" @click="toggleDropdown">
      <button class="dropdown__active-button">
        <div
          class="dropdown__amount-details"
          :class="{ 'dropdown__amount-details--big': size == 'big' }"
          v-if="modelValue.value != null"
        >
          <a-icon v-if="modelValue?.icon" :name="modelValue.icon" />
          ${{ modelValue[optionValue] }}
        </div>
        <div v-else class="dropdown__amount-input" :style="`width: ${inputLength}px;`">
          $
          <input ref="$input" type="text" :value="localedAmount.get()" @input="updateAmount" />
        </div>
        <a-icon
          @click.stop="isActiveDropdown = !isActiveDropdown"
          class="dropdown__amount-arrow"
          :class="{ rotate: isActiveDropdown }"
          width="18"
          height="18"
          :name="Icon.MonoChevronBottom"
        />
      </button>
    </div>
    <div
      class="dropdown__amount-scroll"
      v-if="isActiveDropdown"
      :class="[scroll ? `dropdown__amount-scroll--enabled` : '', { active: isActiveDropdown }]"
    >
      <ul class="dropdown__amount-items" :class="[`dropdown__amount-items--${type}`, { active: isActiveDropdown }]">
        <li
          class="dropdown__amount-item"
          :class="{ active: activeItem?.id == item.id }"
          v-for="item in options"
          :key="item.id"
          @click="onSelect(item)"
        >
          <div class="dropdown__amount-item-details">
            <a-icon v-if="item?.icon" :name="item.icon" /> {{ item.value !== null ? '$' : '' }}{{ item[optionValue] }}
          </div>
          <a-icon
            class="dropdown__amount-item-checkmark"
            :class="{ active: activeItem?.id == item.id }"
            :name="Icon.MonoActionCheckMark"
            width="18"
            height="18"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'

import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import type { Props } from './a-dropdown-amount.type'
import { numberWithDivisions } from '~/src/shared/helpers/digitSeperation'

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  optionKey: 'id',
  optionValue: 'id',
  icon: '',
  size: 'default',
  type: 'default',
  isInputField: false,
  scroll: false,
})

const emit = defineEmits<{
  'update:modelValue': [item: any]
  'update:amountValue': [amount: number | string]
}>()

function updateAmount(event: Event) {
  const target = event.target as HTMLInputElement
  let value = target.value

  value = value.replaceAll(',', '')
  emit('update:amountValue', value)
}

const inputLength = computed(() => String(props.amount).length * 18)

const isActiveDropdown = ref<boolean>(false)

const activeItem = computed(() => {
  return props.options.find((item) => item.id == props.modelValue.id)
})

const onSelect = (item: any) => {
  isActiveDropdown.value = false
  emit('update:modelValue', item)
  if (item.value == null) {
    nextTick(() => {
      $input.value?.focus()
    })
  }
}
const toggleDropdown = () => {
  if (props.modelValue.value == null) {
    return
  }
  isActiveDropdown.value = !isActiveDropdown.value
}
const closeDropMenu = () => {
  isActiveDropdown.value = false
}
const localedAmount = computed(() => ({
  get: () => {
    return numberWithDivisions(props.amount)
  },
}))

const $input = ref<HTMLInputElement | null>(null)
</script>

<style src="./a-dropdown-amount.scss"></style>
