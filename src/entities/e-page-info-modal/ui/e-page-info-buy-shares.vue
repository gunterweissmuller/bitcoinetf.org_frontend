<template>
  <div class="e-page-info-buy-shares">
    <div class="e-page-info-buy-shares__title">How to Buy ETF Shares</div>

    <div class="e-page-info-buy-shares__text">Before you take the leap, here's everything you need to know:</div>

    <div class="e-page-info-buy-shares__subtitle">Compound Growth Graph:</div>
    <div class="e-page-info-buy-shares__text">
      Witness your investment's potential journey with our compound growth graph. This visual representation will
      showcase how your initial investment may flourish over the designated investment period.
    </div>

    <div class="e-page-info-buy-shares__subtitle">Dividends:</div>
    <div class="e-page-info-buy-shares__text">
      Understand the earnings your investment is anticipated to generate. Total Dividends: See the cumulative dividends
      that will be disbursed over the investment period.
    </div>

    <div class="e-page-info-buy-shares__subtitle">APY (Annual Percentage Yield):</div>
    <div class="e-page-info-buy-shares__text">
      Get to know the annual return rate on your chosen investment product.
    </div>

    <div class="e-page-info-buy-shares__subtitle">Projected Total Value:</div>
    <div class="e-page-info-buy-shares__text">
      This value represents our well-informed prediction of the total amount you might receive at the conclusion of the
      investment period. Please be mindful, this is our best estimate but it's not set in stone or contractually bound.
    </div>

    <div class="e-page-info-buy-shares__subtitle">Guaranteed Total Value:</div>
    <div class="e-page-info-buy-shares__text">
      Sleep easy knowing there's a safety net! This is the assured amount you'll receive at the end of your investment
      tenure, encompassing your initial investment plus all accrued dividends.
    </div>
    <div class="e-page-info-buy-shares__text">
      Our contract with you confirms this guarantee. In the rare event that our fund underperforms, we'll dip into our
      USDT or Bitcoin reserve to make up the owed difference to our shareholders.
    </div>

    <div class="e-page-info-buy-shares__subtitle">Selecting Shares:</div>
    <div class="e-page-info-buy-shares__text">
      Decide on the number of shares you wish to buy! Use the + and - buttons to adjust by 1000-share increments, or tap
      the number directly to input your desired share amount.
    </div>

    <div class="e-page-info-buy-shares__subtitle">Final Steps:</div>
    <div class="e-page-info-buy-shares__text">
      Once settled on the amount, click the 'Buy' button, input your payment details, and voila! Begin relishing your
      dividends, which are paid out daily in Bitcoin. As Bitcoin's value ascends, the fiat APY could surge way beyond
      our guaranteed figures.
    </div>
    <div class="e-page-info-buy-shares__text">
      We've meticulously designed this platform keeping your security, transparency, and profitability in mind. Trust in
      our well-thought-out processes and be a part of our financial journey. Remember, your investment isn't just safe;
      it's poised for potential growth! 🌱🚀
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.e-page-info-buy-shares {
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
