<template>
  <div class="landing-promo">
    <div class="landing-promo__intro">
      <a-icon :name="Icon.ColorfulUsdttron"/>
      <span>TETHER USDT SPECIAL PROMO</span>
    </div>
    <h1 class="landing-promo__title">
      Boost Your Investment Instantly with a <span>{{ $app.store.user.statistic?.trc_bonus?.percent }}% Bonus!</span>
    </h1>
    <div class="landing-promo__subtitle">
      Get a {{ $app.store.user.statistic?.trc_bonus?.percent }}% Bonus on ETF Purchases with <br><a-icon :name="Icon.ColorfulUsdttron"/>Tether (USDT) - Invest Smarter, Not Harder!
    </div>
    <div class="landing-promo__cta">
      <a-button text="Get started!" @click="scrollToSection"/>
    </div>

  </div>
</template>

<script setup>
import {Icon} from "~/src/shared/constants/icons";
import AButton from "~/src/shared/ui/atoms/a-button/a-button.vue";
import AIcon from "~/src/shared/ui/atoms/a-icon/a-icon.vue";


const scrollToSection = () =>{
  const element = document.querySelector(".langing-calculation__title");
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

<style lang="scss" src="./landing-promo.scss" />
