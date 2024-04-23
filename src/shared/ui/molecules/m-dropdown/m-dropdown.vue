<template>
    <div class="m-dropdown">
        <div @click="toggleCurrencyDropdown" class="m-dropdown__invest-select">
            <NuxtImg :src="$app.store.user.theme === 'dark' ? '/img/icons/mono/chevron-bottom-dark.svg' : '/img/icons/mono/chevron-bottom.svg'"  :class="['m-dropdown__invest-select-arrow', {'m-dropdown__invest-select-arrow-reverse': !showDropdown}]" alt="Down arrow icon"/>
            <span class="m-dropdown__invest-select-text m-dropdown__invest--text-primary m-dropdown--text-normal">{{ selectedOption.value }}</span>
        </div>
        <div  v-on-click-outside="() => showDropdown = false"  v-if="showDropdown" class="m-dropdown__invest-select-dropdown">
        <ul>
            <li v-for="option in props.options" :key="option" @click="selectOption(option)" :class="['m-dropdown__invest-select-dropdown-item']">{{ option.value }}</li>
        </ul>
        </div>
    </div>
</template>
<script setup lang="ts">
    import {computed, ref, watch} from "vue";
    import { vOnClickOutside } from '@vueuse/components';

    const props = withDefaults(
        defineProps<{
            options?: any,
        }>(),
        {
            options: [{value: "example"}]
        },
    )

    const selectedOption = ref(props.options[0]);
    const showDropdown = ref(false);

    const toggleCurrencyDropdown = () => {
        showDropdown.value = !showDropdown.value;
    };

    const selectOption = (option : any) => {
        selectedOption.value = props.options.find((el) => el.value === option.value) ?? props.options[0].value;
        toggleCurrencyDropdown();
    }
</script>

<style lang="scss" src="./m-dropdown.scss" />
