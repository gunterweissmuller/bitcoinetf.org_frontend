<template>
  <div class="landing-weloverussia">
    <s-site-welcome :data="welcomeData" :isLanding="true" />
    <landing-calculation :isFiatLanding="true" />
    <s-site-footer />
  </div>
</template>

<script setup>
import SSiteFooter from '~/src/shared/ui/site/sections/s-site-footer/s-site-footer.vue'
import SSiteWelcome from '~/src/shared/ui/site/sections/s-site-welcome/s-site-welcome.vue'

definePageMeta({
  layout: 'site-dark',
})
const welcomeData = {
  name: 'Russia Welcome',
  title: 'WE ALWAYS WELCOME AND<img src="/img/site-dark/s-site-welcome/heart.svg" />RUSSIA',
  text: `
    <p>At BitcoinETF, we've proudly expanded our platform to serve the vibrant community of Russian Federation.</p>
    <p>Dive into our seamless experience,tailor-made for you.</p>
  `,
  img: '/img/site-dark/s-site-welcome/back.png',
  slides: [
    {
      title: 'Говорим по-русски',
      img: '/img/site-dark/s-site-welcome/slides/1.png',
      subtitle: 'Круглосуточно',
      text: 'Служба поддержки доступна 24/7',
    },
    {
      title: 'Принимаем карты МИР',
      img: '/img/site-dark/s-site-welcome/slides/2.png',
      subtitle: 'Поддержка банкинга',
      text: 'Поддержка банковских переводов из РФ',
    },
    {
      title: 'Эксклюзивный бонус',
      img: '/img/site-dark/s-site-welcome/slides/3.png',
      subtitle: 'Бонус $25',
      text: 'Для наших ценных клиентов из России',
    },
  ],
}
</script>

<style lang="scss">
.landing-weloverussia {
  padding-top: 120px;
}
</style>
