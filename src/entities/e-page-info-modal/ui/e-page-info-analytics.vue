<template>
  <div class="e-page-info-analytics">
    <div class="e-page-info-analytics__title">Welcome to the "Analytics" Dashboard of Our Bitcoin ETF App!</div>

    <div class="e-page-info-analytics__subtitle">Ticker Bar:</div>
    <div class="e-page-info-analytics__text">
      At the very top, keep an eye on the constantly moving ticker bar that provides real-time market dynamics and
      trends.
    </div>

    <div class="e-page-info-analytics__subtitle e-page-info-analytics__subtitle-big">Performance</div>
    <div class="e-page-info-analytics__subtitle">Underlying Assets & Dividends:</div>
    <div class="e-page-info-analytics__text">
      Discover what assets power the fund, and see the dividends these assets have generated and distributed to
      shareholders.
    </div>

    <div class="e-page-info-analytics__subtitle">Last Trades:</div>
    <div class="e-page-info-analytics__text">
      Stay informed with our recent trades. We introduce a minor delay in this information to maintain our fund's
      strategic advantages, but we aim to give you unmatched transparency.
    </div>

    <div class="e-page-info-analytics__subtitle">Detailed View:</div>
    <div class="e-page-info-analytics__text">
      Click or tap on any asset or trade for an expanded, detailed view of the information, offering a granular look
      into our asset management.
    </div>

    <div class="e-page-info-analytics__subtitle e-page-info-analytics__subtitle-big">Portfolio Section</div>
    <div class="e-page-info-analytics__subtitle">Assets Overview:</div>
    <div class="e-page-info-analytics__text">
      Get a comprehensive look at all assets we manage, the total funds allocated to each asset, and their respective
      trading activity.
    </div>

    <div class="e-page-info-analytics__subtitle e-page-info-analytics__subtitle-big">Fund Section</div>
    <div class="e-page-info-analytics__subtitle">Growth and Capital:</div>
    <div class="e-page-info-analytics__text">
      See how our fund has grown over time, the total capital we manage, and get to know our investor community with
      details like the number of shareholders and the average shareholding.
    </div>

    <div class="e-page-info-analytics__subtitle">Latest Share Issuance:</div>
    <div class="e-page-info-analytics__text">
      Stay updated on our most recent share issuances and verify them on the blockchain for authenticity.
    </div>

    <div class="e-page-info-analytics__subtitle">Top 100 Investors:</div>
    <div class="e-page-info-analytics__text">
      Fancy a bit of healthy competition? View the ranking of our top 100 investors based on the percentage of total
      shares they own.
    </div>

    <div class="e-page-info-analytics__text">
      Explore, stay informed, and make the most of our platform. And, as always, feel free to revisit this guide
      whenever you need clarity. Enjoy your experience! 👍
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.e-page-info-analytics {
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

    &-big {
      font-size: torem(18);
      margin-bottom: var(--spacing-m-1);
    }
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
