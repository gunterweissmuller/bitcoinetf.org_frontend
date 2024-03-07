<template>
  <div class="landing-promo-new">
    <div class="landing-promo-new__intro">
      <a-icon :name="Icon.ColorfulUsdttron"/>
      <span>TETHER USDT SPECIAL PROMO</span>
    </div>
    <h1 class="landing-promo-new__title">
      Boost Your Investment Instantly with a <span>{{ $app.store.user.statistic?.trc_bonus?.percent }}% Discount</span> on Your Bitcoin ETF!
    </h1>
    <div class="landing-promo-new__subtitle">
      Get a {{ $app.store.user.statistic?.trc_bonus?.percent }}% Discount on ETF Purchases with <br><a-icon :name="Icon.ColorfulUsdttron"/>Tether (USDT) - Invest Smarter, Not Harder!
    </div>
    <div class="landing-promo-new__cta">
      <a-button text="Get started!" @click="scrollToSection"/>
    </div>

  </div>
</template>

<script setup>
import {Icon} from "~/src/shared/constants/icons";
import AButton from "~/src/shared/ui/atoms/a-button/a-button.vue";
import AIcon from "~/src/shared/ui/atoms/a-icon/a-icon.vue";


const scrollToSection = () =>{
  const element = document.querySelector(".landing-calculation__journey");
  let headerOffset
  if (window.innerWidth < 768) {
    headerOffset = 145;
  } else {
    headerOffset = 155;

  }
  const elementPosition = element.offsetTop;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}
</script>

<style lang="scss" src="./landing-promo-new.scss" />
