<template>
  <section class="s-site-how-work" :data-name="'How it work'">
    <div class="s-site-how-work__wrapper-title">
      <h2 class="s-site-how-work__title title-site-h1">Passive Income <br />for Smart Investors</h2>
      <p class="s-site-how-work__title_info for-desktop">
        When Bitcoin ETFs are issued, proceeds are dynamically allocated between portfolio <br />
        assets. All generated profits are distributed to ETF shareholders. You can choose to get <br />
        paid in BTC or USDT.
      </p>
      <p class="s-site-how-work__title_info for-mobile">
        Bitcoin ETFs are issued, after which the <br />
        fund's AI dynamically allocates new funds <br />
        among portfolio assets.
      </p>

      <a-animation-passive-income />
      <div class="s-site-how-work__linear-gradient"></div>
    </div>
    <div class="s-site-how-work__desc" style="padding-left: 60px; padding-right: 60px">
      <div style="background: rgba(255, 255, 255, 0.1); height: 1px" />
      <div style="padding-top: 32px; padding-bottom: 32px">
        <p style="font-size: 24px; text-align: center">
          <span style="color: #4d94ff">Purchase ETFs for $1 each</span> and begin earning
          <span style="color: #4d94ff">daily dividends</span>, accruing <br />
          in either
          <NuxtImg
            class="s-site-main__title_icon aspect-square w-[24px]"
            src="/img/icons/colorful/bitcoin.svg"
            width="24"
            height="24"
            loading="lazy"
          />
          BTC or
          <NuxtImg
            class="s-site-main__title_icon aspect-square w-[24px]"
            src="/img/icons/colorful/usdt.svg"
            width="24"
            height="24"
            loading="lazy"
          />
          USDT.
        </p>
      </div>
      <div style="background: rgba(255, 255, 255, 0.1); height: 1px" />
      <div style="padding-top: 32px; padding-bottom: 32px">
        <p style="font-size: 24px; text-align: center">
          <span style="color: #4d94ff">Sell ETFs at the fixed price</span> of $1 each and retain your dividends.
        </p>
      </div>
      <div style="background: rgba(255, 255, 255, 0.1); height: 1px" />
      <div style="padding-top: 32px; padding-bottom: 32px">
        <p style="font-size: 24px; text-align: center">
          Original Investment is <span style="color: #4d94ff">NEVER at risk</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AAnimationPassiveIncome from '~/src/shared/ui/atoms/a-animation-passive-income/a-animation-passive-income.vue'
</script>

<style src="./s-site-how-it-work.scss" lang="scss" />
