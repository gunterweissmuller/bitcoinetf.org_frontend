<template>
  <div class="a-dropdown" ref="dropdown">
    <div
      class="a-dropdown__value"
      :class="{ empty: !props.options.length }"
      @click="dropdownState = !dropdownState;"
    >
      <a-icon width="14" height="14" :name="Icon.MonoChevronBottom" />
      <span v-if="props.options.length" class="a-dropdown__value-name">
        {{ currentOption.name }}
      </span>
      <span v-else class="a-dropdown__value-name">
        {{ props.empty }}
      </span>
    </div>
    <ul v-show="props.options.length && dropdownState" class="a-dropdown__list">
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
import { ADropdownOption } from '~/src/shared/types/global';

const props = defineProps({
  // Список вариантов выбора
  options: {
    type: Array as PropType<ADropdownOption[]>,
    required: false,
    default: []
  },
  // передается value нужного нам option
  // получить выбранный option можно через v-model
  // если у options такого value нет, то current
  // обновляется на последний элемент options
  current: {
    type: null as PropType<any>,
    required: true,
    default: null
  },
  // если options пустой, то какую строку показать
  empty: {
    type: String,
    required: false,
    default: 'Empty'
  }
});

// update:current - обновляет значение, которое передается в пропс через v-model
// get-current-option - возвращает выбранный Option
const emit = defineEmits(['update:current', 'get-current-option']);


const dropdownState = ref<boolean>(false);

const dropdown = ref(null);
onClickOutside(dropdown, () => dropdownState.value = false);


const current = ref<any>(props.current ?? props.options[props.options.length - 1].value);

const currentOption = computed<Option>(() => {
  const option = props.options.find((option) => option.value === current.value);

  if (option) {
    return option;
  }

  emit('update:current', props.options[props.options.length - 1].value);
  return props.options[props.options.length - 1];
});

const changeOption = (value : number) => {
  current.value = value;
  emit('update:current', current.value);
  emit('get-current-option', currentOption.value);
  dropdownState.value = false;
}

watch(() => props.current, () => {
  current.value = props.current;
  changeOption(current.value);
});
</script>

<style lang='scss' src="./a-dropdown.scss"></style>
