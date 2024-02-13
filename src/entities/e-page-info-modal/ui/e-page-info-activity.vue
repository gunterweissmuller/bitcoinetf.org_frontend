<template>
  <div class="e-page-info-activity">
    <div class="e-page-info-activity__subtitle">Total ETF Value</div>
    <div class="e-page-info-activity__text">
      This is your original cost + all the interest you've earned, shown in both USD and BTC. Cool, right?
    </div>
    <div class="e-page-info-activity__subtitle">The Chart</div>
    <div class="e-page-info-activity__text">
      Green? That's the actual interest you've earned. Orange? That's the minimum interest we guarantee. And that dotted
      line? It's our projection of how the ETF will perform.
    </div>
    <div class="e-page-info-activity__subtitle">Redeeming & Withdrawing</div>
    <div class="e-page-info-activity__text">
      Once the restriction period ends, choose to either get Bitcoin, US Dollars, or move the ETF shares to your own
      wallet.
    </div>
    <div class="e-page-info-activity__text">
      And hey, don’t forget! Other sections have their own little 'i' guides. Tap on them anytime you're curious.
    </div>
    <div class="e-page-info-activity__text">Happy investing! ✨</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.e-page-info-activity {
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
