<template>
  <div class="e-page-info-settings">
    <div class="e-page-info-settings__title">e-page-info-settings</div>
    <div class="e-page-info-settings__text">Here's a quick breakdown:</div>
    <div class="e-page-info-settings__subtitle">Total ETF Value</div>
    <div class="e-page-info-settings__text">
      This is your original cost + all the interest you've earned, shown in both USD and BTC. Cool, right?
    </div>
    <div class="e-page-info-settings__subtitle">The Chart</div>
    <div class="e-page-info-settings__text">
      Green? That's the actual interest you've earned. Orange? That's the minimum interest we guarantee. And that dotted
      line? It's our projection of how the ETF will perform.
    </div>
    <div class="e-page-info-settings__subtitle">Redeeming & Withdrawing</div>
    <div class="e-page-info-settings__text">
      Once the restriction period ends, choose to either get Bitcoin, US Dollars, or move the ETF shares to your own
      wallet.
    </div>
    <div class="e-page-info-settings__text">
      And hey, don’t forget! Other sections have their own little 'i' guides. Tap on them anytime you're curious.
    </div>
    <div class="e-page-info-settings__text">Happy investing! ✨</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.e-page-info-settings {
  display: flex;
  flex-direction: column;

  &__title {
    font-family: Dm, sans-serif;
    font-size: torem(18);
    font-weight: 700;
    line-height: torem(23);
    margin-bottom: var(--spacing-m-2);
  }

  &__subtitle {
    font-family: Dm, sans-serif;
    font-size: torem(16);
    font-weight: 700;
    line-height: torem(21);
    margin-bottom: var(--spacing-xs);
  }

  &__text {
    font-family: Dm, sans-serif;
    font-size: torem(16);
    font-weight: 400;
    line-height: torem(21);
    margin-bottom: var(--spacing-m-1);
  }
}
</style>
