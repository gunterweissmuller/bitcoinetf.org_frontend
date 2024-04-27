<template>
  <div class="e-page-info-wallet">
    <div class="e-page-info-wallet__title">Let's dive into what each wallet entails:</div>

    <div class="e-page-info-wallet__text">
      We are delighted to offer our clients a unique and efficient way to receive the interest they've earned.
    </div>

    <div class="e-page-info-wallet__subtitle e-page-info-wallet__subtitle-big">REFERRAL Wallet:</div>

    <div class="e-page-info-wallet__subtitle">Purpose:</div>
    <div class="e-page-info-wallet__text">Your rewards hub for spreading the word!</div>

    <div class="e-page-info-wallet__subtitle">How to Earn:</div>
    <div class="e-page-info-wallet__text">
      Get a commission every time your referred contact deposits into the fund.
    </div>

    <div class="e-page-info-wallet__subtitle">Important:</div>
    <div class="e-page-info-wallet__text">
      Everyone's invited to our referral program! Claim your unique referral code and link now.
    </div>

    <div class="e-page-info-wallet__subtitle">Payout:</div>
    <div class="e-page-info-wallet__text">Dividends are disbursed daily in USDT via the Tron blockchain.</div>

    <div class="e-page-info-wallet__subtitle e-page-info-wallet__subtitle-big">DIVIDENDS Wallet:</div>

    <div class="e-page-info-wallet__subtitle">Purpose:</div>
    <div class="e-page-info-wallet__text">Here's where you'll find your share of the fund's profit.</div>

    <div class="e-page-info-wallet__subtitle">Payment Structure:</div>
    <div class="e-page-info-wallet__text">
      Dividends are paid in Bitcoin daily, even though the interest is calculated in USD and remains fixed term.
    </div>

    <div class="e-page-info-wallet__subtitle">Conversion:</div>
    <div class="e-page-info-wallet__text">
      Your dividends are converted into Bitcoin using the daily market exchange rate.
    </div>

    <div class="e-page-info-wallet__subtitle">Withdrawal:</div>
    <div class="e-page-info-wallet__text">
      On-chain (BTC): Available for withdrawals that exceed the $250 minimum threshold.
    </div>

    <div class="e-page-info-wallet__subtitle">Lightning - Bitcoin's Second Layer Protocol:</div>
    <div class="e-page-info-wallet__text">
      No minimum threshold! Process withdrawals seamlessly and automatically, regardless of the amount.
    </div>

    <div class="e-page-info-wallet__text">
      For any additional queries or clarifications, our support team is always here to help! Happy investing!
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.e-page-info-wallet {
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
