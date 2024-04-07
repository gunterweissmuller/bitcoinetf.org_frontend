<template>
  <div class="a-dropdown">
    <div
      class="a-dropdown__value"
      :class="{ empty: !props.options.length }"
      @click="dropdownState = !dropdownState"
    >
      <a-icon width="14" height="14" :name="Icon.MonoChevronBottom" />
      <span v-if="props.options.length" class="a-dropdown__value-name">
        {{ currentOption.name }}
      </span>
      <span v-else class="a-dropdown__value-name">
        {{ props.empty || 'Empty' }}
      </span>
    </div>
    <ul v-show="props.options.length && dropdownState" class="a-dropdown__list" ref="dropdown">
      <li
        class="a-dropdown__item"
        :class="{ current: option.value === currentOption.value }"
        v-for="option in props.options"
        :key="option.value"
        @click="changeOption(option.value)"
      >
        <span class="a-dropdown__item-name">
          {{ option.name }}
        </span>
        <a-icon class="a-dropdown__item-check" width="18" height="18" :name="Icon.MonoActionCheckMark" />
      </li>
    </ul>
  </div>
</template>

<script lang='ts' setup>
import { OnClickOutside } from '@vueuse/core';
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue';
import { Icon } from '~/src/shared/constants/icons';

interface Option {
  name: string,
  value: any
}

const props = defineProps({
  options: {
    type: Array as PropType<Option[]>,
    required: false,
    default: []
  },
  current: {
    type: [Number, Boolean] as PropType<number | false>,
    required: false,
    default: false
  },
  empty: {
    type: [String, Boolean] as PropType<string | false>,
    required: false,
    default: false
  }
});

const emit = defineEmits(['update:current', 'get-current-option']);


const currentOption = computed<Option>(() => {
  return props.options.find((option) => option.value === props.current) ?? (props.options.length ? props.options[props.option.length - 1] : {});
});

const dropdownState = ref<boolean>(false);

const dropdown = ref(null);
onClickOutside(dropdown, () => dropdownState.value = false);

const changeOption = (value : number) => {
  emit('update:current', value);
  emit('get-current-option', currentOption.value);
  dropdownState.value = false;
}
</script>

<style lang='scss' src="./a-dropdown.scss"></style>
