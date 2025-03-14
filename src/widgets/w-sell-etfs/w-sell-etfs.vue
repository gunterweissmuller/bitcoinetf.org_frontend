<template>
    <div class="w-sell-etfs">
        <template v-if="currentStep === Steps.Sell">
            <div class="w-sell-etfs__header">
                Sell ETFs
                <a-icon
                    class="w-sell-etfs__header-info"
                    width='22'
                    height='22'
                    :name='Icon.MonoInfo'
                    @click='() => {}'
                />
            </div>
            <div class="w-sell-etfs-body">
                <div class="w-sell-etfs__amount-shares">{{ $app.filters.rounded($app.store.user.sellShares?.amount) }} Shares</div>
                <div class="w-sell-etfs__amount-usd">For ${{ $app.filters.rounded($app.store.user.sellShares?.for) }}</div>
                <a-input
                    class=""
                    label="Tether USDT (Polygon) Destination Address"
                    v-model="addressValue"
                    text-icon-text="Copied!"
                    :icon="Icon.MonoPaste"
                    position-icon="right"
                    @icon-click-handler="onPaste"
                    iconWithAction
                />
                <a-button class="w-sell-etfs__continue" :disabled="!validMatic" variant="primary" @click="() => {currentStep = Steps.Confirm}" text="Continue"></a-button>
            </div>
        </template>

        <template v-else-if="currentStep === Steps.Confirm">
            <div class="w-sell-etfs__header">
                <a-icon
                    class="w-sell-etfs__header-back"
                    width='22'
                    height='22'
                    :name='Icon.MonoChevronLeft'
                    @click='() => {currentStep = Steps.Sell}'
                />
                Confirm your sell order
            </div>
            <div class="w-sell-etfs-body">

                <div class="w-sell-etfs__table">
                    <div class="w-sell-etfs__table-item">
                        <div class="w-sell-etfs__table-title">Amount of Shares You’re Selling</div>
                        <div class="w-sell-etfs__table-text">{{ $app.filters.rounded($app.store.user.sellShares?.amount) }}</div>
                    </div>
                    <div class="w-sell-etfs__table-item">
                        <div class="w-sell-etfs__table-title">For</div>
                        <div class="w-sell-etfs__table-text">${{ $app.filters.rounded($app.store.user.sellShares?.for) }}</div>
                    </div>
                    <div class="w-sell-etfs__table-item">
                        <div class="w-sell-etfs__table-title">Destination Address</div>
                        <div class="w-sell-etfs__table-text">{{addressValue}}</div>
                    </div>
                    <div class="w-sell-etfs__table-item">
                        <div class="w-sell-etfs__table-title">Early Termination Fee</div>
                        <div class="w-sell-etfs__table-text">${{ $app.filters.rounded($app.store.user.sellShares?.early_termination_fee, 2) }}</div>
                    </div>
                    <div class="w-sell-etfs__table-item">
                        <div class="w-sell-etfs__table-title">Transaction Fee</div>
                        <div class="w-sell-etfs__table-text">${{ $app.filters.rounded($app.store.user.sellShares?.transaction_fee, 2) }}</div>
                    </div>
                </div>

                <a-button class="w-sell-etfs__continue" variant="primary" @click="handleSell" text="Sell"></a-button>
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

    const validMatic = ref(false);
    watch(()=> addressValue.value, (value) => {
        validMatic.value = window?.WAValidator?.validate(addressValue.value, 'matic');
    })

    const isSoldModalShow = ref(false);

    const closeSoldModal = () => {
        isSoldModalShow.value = false;
    }

    const onPaste = () => {
        navigator.clipboard
        .readText()
        .then(
            (clipText) => {
                addressValue.value = clipText;
            },
        );
    }

    const handleSell = () => {
        $app.api.eth.billingEth
        .confirmSellShares({
            "destination": addressValue.value, 
            "accept_early_termination_fee": true
        })
        .then((response: any) => {
            isSoldModalShow.value = true;
        })
        .catch(() => {
            // Todo: notify something went wrond
        })
    }

</script>

<style src="./w-sell-etfs.scss" lang="scss" />

<style lang="scss"></style>
