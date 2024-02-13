<template>
  <div class="e-page-info-earnings">
    <div class="e-page-info-earnings__title">Welcome to Your Bitcoin ETF Investment Overview!</div>

    <div class="e-page-info-earnings__subtitle">Total Shares Owned:</div>
    <div class="e-page-info-earnings__text">Find out the number of Bitcoin ETF shares you currently possess.</div>

    <div class="e-page-info-earnings__subtitle">Projected Total Value:</div>
    <div class="e-page-info-earnings__text">A foresight into the potential value of your shares in the future.</div>

    <div class="e-page-info-earnings__subtitle">Ownership Percentage:</div>
    <div class="e-page-info-earnings__text">Discover what percent of all issued ETF shares belong to you.</div>

    <div class="e-page-info-earnings__subtitle">Current Value Chart:</div>
    <div class="e-page-info-earnings__text">
      Visualize the growth of your dividends over time, reflecting the potential appreciation of Bitcoin.
    </div>

    <div class="e-page-info-earnings__subtitle">Projected APY:</div>
    <div class="e-page-info-earnings__text">Our educated forecast on the returns we aim to generate for you.</div>

    <div class="e-page-info-earnings__subtitle">Guaranteed APY:</div>
    <div class="e-page-info-earnings__text">
      The return we promise to provide, no matter how the market performs or how we do. This is based on our contractual
      commitment when you joined our platform.
    </div>

    <div class="e-page-info-earnings__subtitle">Actual APY:</div>
    <div class="e-page-info-earnings__text">The real-time rate of return you're earning on your investment.</div>

    <div class="e-page-info-earnings__subtitle">Your Dividends Section:</div>
    <div class="e-page-info-earnings__text">
      Compare the actual, guaranteed (minimal), and projected APY over specific periods. This helps you understand how
      your returns have performed against our predictions and promises.
    </div>

    <div class="e-page-info-earnings__subtitle">Helpful Widgets:</div>
    <div class="e-page-info-earnings__text">
      At the bottom, you'll encounter various informational widgets. If anything isn't clear, look for the "i" button
      next to the widget. Click or tap on it to get a detailed explanation.
    </div>

    <div class="e-page-info-earnings__text">
      Always remember: with Bitcoin as the primary dividend, your APY has the potential to grow significantly over time.
      Enjoy monitoring your investment and feel free to revisit this guide whenever needed! 👍
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.e-page-info-earnings {
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
