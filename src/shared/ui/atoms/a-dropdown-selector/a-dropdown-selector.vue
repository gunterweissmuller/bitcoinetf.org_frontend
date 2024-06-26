<template>
  <div
    class="dropdown__selector"
    :class="{ 'dropdown__selector--transparent': type != 'default' }"
    v-on-click-outside="closeDropMenu"
  >
    <div class="dropdown__selector-active-item" @click="isActiveDropdown = !isActiveDropdown">
      <button class="dropdown__active-button">
        <div class="dropdown__selector-details" :class="{ 'dropdown__selector-details--big': size == 'big' }">
          <a-icon v-if="modelValue?.icon" :name="modelValue.icon" />
          {{ modelValue[optionValue] }}
        </div>

        <a-icon
          @click.stop="isActiveDropdown = !isActiveDropdown"
          class="dropdown__selector-arrow"
          :class="{ rotate: isActiveDropdown }"
          width="18"
          height="18"
          :name="Icon.MonoChevronBottom"
        />
      </button>
    </div>
    <ul class="dropdown__selector-items" :class="[`dropdown__selector-items--${type}`, { active: isActiveDropdown }]">
      <li
        class="dropdown__selector-item"
        :class="{ active: activeItem?.id == item.id }"
        v-for="item in options"
        :key="item.id"
        @click="onSelect(item)"
      >
        <div class="dropdown__selector-item-details">
          <a-icon v-if="item?.icon" :name="item.icon" /> {{ item.value }}
        </div>
        <a-icon
          class="dropdown__selector-item-checkmark"
          :class="{ active: activeItem?.id == item.id }"
          :name="Icon.MonoActionCheckMark"
          width="18"
          height="18"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'

import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import type { Props } from './a-dropdown-selector.type'

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  optionKey: 'id',
  optionValue: 'id',
  icon: '',
  size: 'default',
  type: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [item: any]
}>()

const $el = ref<HTMLDivElement | null>(null)
const isActiveDropdown = ref<boolean>(false)

const activeItem = computed(() => {
  return props.options.find((item) => item.id == props.modelValue.id)
})

const onSelect = (item: any) => {
  isActiveDropdown.value = false
  emit('update:modelValue', item)
}
const closeDropMenu = () => {
  isActiveDropdown.value = false
}
</script>

<style src="./a-dropdown-selector.scss"></style>
