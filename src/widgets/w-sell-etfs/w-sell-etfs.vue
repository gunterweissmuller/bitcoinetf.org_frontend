<template>
    <div class="w-etfs">
        <template v-if="currentStep === Steps.Sell">
            <div class="w-etfs__header">
                Sell ETFs
                <a-icon
                    class="w-etfs__header-info"
                    width='22'
                    height='22'
                    :name='Icon.MonoInfo'
                    @click='() => {}'
                />
            </div>
            <div class="w-etfs-body">
                <div class="w-etfs__amount-shares">25,584 Shares</div>
                <div class="w-etfs__amount-usd">For $25,584</div>
                <a-input
                    class=""
                    label="Tether USDT (Polygon) Destination Address"
                    :model-value="addressValue"
                    text-icon-text="Copied!"
                    :icon="Icon.MonoPaste"
                    position-icon="right"
                />
                <a-button class="w-etfs__continue" variant="primary" @click="() => {currentStep = Steps.Confirm}" text="Continue"></a-button>
            </div>
        </template>

        <template v-else-if="currentStep === Steps.Confirm">
            <div class="w-etfs__header">
                <a-icon
                    class="w-etfs__header-back"
                    width='22'
                    height='22'
                    :name='Icon.MonoChevronLeft'
                    @click='() => {currentStep = Steps.Sell}'
                />
                Confirm your sell order
            </div>
            <div class="w-etfs-body">

                <div class="w-etfs__table">
                    <div class="w-etfs__table-item">
                        <div class="w-etfs__table-title">Amount of Shares You’re Selling</div>
                        <div class="w-etfs__table-text">25,584</div>
                    </div>
                    <div class="w-etfs__table-item">
                        <div class="w-etfs__table-title">For</div>
                        <div class="w-etfs__table-text">$25,584</div>
                    </div>
                    <div class="w-etfs__table-item">
                        <div class="w-etfs__table-title">Destination Address</div>
                        <div class="w-etfs__table-text">3FZbgi23h45y458ruer930t034t4h9kLtktZc5</div>
                    </div>
                    <div class="w-etfs__table-item">
                        <div class="w-etfs__table-title">Early Termination Fee</div>
                        <div class="w-etfs__table-text">$394.48</div>
                    </div>
                    <div class="w-etfs__table-item">
                        <div class="w-etfs__table-title">Transaction Fee</div>
                        <div class="w-etfs__table-text">$3.38</div>
                    </div>
                </div>

                <a-button class="w-etfs__continue" variant="primary" @click="() => {isSoldModalShow = true}" text="Sell"></a-button>
            </div>
        </template>
        
    </div>

    <e-sold-modal :show="isSoldModalShow" :close="closeSoldModal"></e-sold-modal>

</template>
  
<script setup lang="ts">
    import { Ref } from 'vue';
    import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
    import { Icon } from '~/src/shared/constants/icons'
    import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
    import { onUnmounted } from 'vue'
    import aInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
    import eSoldModal from '~/src/entities/e-sold-modal/e-sold-modal.vue';

    const { $app } = useNuxtApp()

    enum Steps {
        Sell = 'Sell',
        Confirm = 'Confirm',
        Sold = 'Sold'
    }

    const currentStep = ref(Steps.Sell);

    onUnmounted(() => {
        currentStep.value = Steps.Sell;
    });

    const addressValue = ref("");

    const isSoldModalShow = ref(false);

    const closeSoldModal = () => {
        isSoldModalShow.value = false;
    }

</script>

<style src="./w-sell-etfs.scss" lang="scss" />

<style lang="scss"></style>
