<template>
  <button
    class="a-tooltip-info"
    @mouseenter="hover(true)"
    @mouseleave="hover(false)"
    @focus="toggle(true)"
    @blur="toggle(false)"
    @click="toggleVisible()"
  >
    <div class="a-tooltip-info__button">
      <slot name="button"/>
    </div>
    <div
      class="a-tooltip-info__tooltip"
      :class="tooltipClasses"
      :style="{ display: open ? 'flex' : 'none' }"
    >
      <div class="a-tooltip-info__tooltip-caption">
        <a-icon
          width='14'
          height='14'
          class='a-tooltip-info__tooltip-icon'
          :name='Icon.MonoInfo'
        />
        {{ props.caption }}
      </div>
      <div class="a-tooltip-info__tooltip-text">
        <slot name="text" />
      </div>
    </div>
  </button>
</template>

<script lang='ts' setup>
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue';
import { Icon } from '~/src/shared/constants/icons';

const props = defineProps({
  caption: {
    type: String,
    required: true
  },
  position: {
    type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
    required: false,
    default: 'bottom'
  }
});

const tooltipClasses = computed<Record<string, boolean>>(() => ({
  'a-tooltip-info__tooltip--top': props.position === 'top',
  'a-tooltip-info__tooltip--right': props.position === 'right',
  'a-tooltip-info__tooltip--bottom': props.position === 'bottom',
  'a-tooltip-info__tooltip--left': props.position === 'left',
}));

const open = ref<boolean>(false);
const focus = ref<boolean>(false);

const toggle = (direction : boolean) => {
  focus.value = direction;
  open.value = direction;
}

const hover = (direction: boolean) => {
  if (focus.value) return;
  open.value = direction;
}

const toggleVisible = () => {
  toggle(!open.value)
}
</script>

<style lang='scss' src="./a-tooltip-info.scss"></style>
