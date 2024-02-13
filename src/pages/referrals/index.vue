<template>
  <m-scroll-navigation
    v-if="sections && y > sections[2]?.top"
    :length="sections.length - 2"
    :data="scrollInfo"
  />
  <s-site-referrals-main :data="mainData"/>
  <s-site-marquee :data="marqueeData"/>
  <s-site-referrals-id :data="idData"/>
  <s-site-referrals-share :data="shareData"/>
  <s-site-footer/>
</template>

<script setup lang="ts">
import MScrollNavigation from "~/src/shared/ui/site/molecules/m-scroll-navigation/m-scroll-navigation.vue";
import SSiteReferralsMain from "~/src/shared/ui/site/sections/s-site-referrals-main/s-site-referrals-main.vue";
import SSiteReferralsId from "~/src/shared/ui/site/sections/s-site-referrals-id/s-site-referrals-id.vue";
import SSiteReferralsShare from "~/src/shared/ui/site/sections/s-site-referrals-share/s-site-referrals-share.vue";
import SSiteFooter from "~/src/shared/ui/site/sections/s-site-footer/s-site-footer.vue";
import SSiteMarquee from "~/src/shared/ui/site/sections/s-site-marquee/s-site-marquee.vue";
import {useWindowScroll, useWindowSize} from "@vueuse/core";

definePageMeta({
  layout: 'site-dark',
})

const {y} = useWindowScroll(window);
const {width} = useWindowSize();

const scrollInfo = ref({});
const isLoaded = ref(false);

const sections = ref([]);

const getElements = () => {
  const sectionsArray = document.querySelectorAll('section');
  const footer = document.querySelector('footer');
  const header = document.querySelector('header');

  const lasElement = {
    top: footer.offsetTop - header.offsetHeight,
    name: 'Final',
    id: sectionsArray.length - 1,
  }

  sections.value = Object.values(sectionsArray).map((section, index) => ({
    top: section.offsetTop - header.offsetHeight,
    name: index > 1 ? section.dataset.name : '',
    id: index - 1,
  }));

  sections.value.push(lasElement);
}

onUpdated(() => {
  if (!isLoaded.value) {
    getElements();
  }
  isLoaded.value = true;
});

watch(y, (newVal) => {
  sections.value.forEach((section) => {
    if (newVal > section.top) {
      scrollInfo.value = section;
    }
  });
});

watch(width, () => {
  getElements();
});

const mainData = {
  title: '<span>Invest Together</span>, Prosper Together!',
  message: 'WGMI',
  avatars: [
    '/img/site-dark/s-site-referrals-main/1.jpg',
    '/img/site-dark/s-site-referrals-main/2.jpg',
    '/img/site-dark/s-site-referrals-main/3.jpg',
  ],
  img: '/img/site-dark/s-site-referrals-main/1.png',
  text: 'Introducing our Referral Reward Program — a unique way for you and your network to grow your wealth collaboratively.',
  btn: {
    text: 'Ready to Invest',
  },
};

const marqueeData = {
  low_cards: [
    '/img/site-dark/s-site-marquee/1.svg',
    '/img/site-dark/s-site-marquee/2.svg',
    '/img/site-dark/s-site-marquee/3.svg',
    '/img/site-dark/s-site-marquee/4.svg',
  ],
};

const idData = {
  name: 'General Points',
  title: 'Obtain Your <span>Unique</span> Referral ID',
  btn: {
    text: 'Start earning!',
  },
  img: '/img/site-dark/s-site-referrals-id/1.png',
  message: 'Earnings are a few clicks away',
  info: {
    title: 'Bonus +5% APY',
    text: `
      <p>Refer a friend today and grant them an exceptional start with a +5% bonus APY on their guaranteed minimum for the first 6 months of investment in our ETF shares.</p>
      <p>Plus, you'll earn a 5% reward on all deposits they make. </p>
      <p>Seize this dual benefit opportunity – your investment journey is brighter together! </p>
    `,
  },
  slides: [
    {
      title: 'Competitive Returns',
      img: '/img/site-dark/s-site-referrals-id/slides/1.png',
      text: `Our ETF yields up to 33% APY, with returns amplified by Bitcoin's price appreciation, ensuring our investors enjoy superior gains.`,
    },
    {
      title: 'Transparency',
      img: '/img/site-dark/s-site-referrals-id/slides/2.png',
      text: `We ensure complete transparency by granting investors direct access to verify trades, on-chain reserves, and share activities on the blockchain, independently and confidently.`,
    },
    {
      title: 'Cutting-Edge Solutions',
      img: '/img/site-dark/s-site-referrals-id/slides/3.png',
      text: `As fintech evolves, so do our offerings. We’re committed to keeping our investors at the forefront of the industry`,
    },
  ],
};

const shareData = {
  name: 'Share and Shine',
  title: 'Share and Shine <span>Together</span>',
  btn: {
    text: 'Create account',
  },
  img: '/img/site-dark/s-site-referrals-share/1.png',
  message: 'Easy sign up',
  info: {
    title: 'The Referral Reward Program isn’t just an initiative',
    text: `
      <p>It’s our way of fostering a community where every participant has the opportunity to thrive.</p>
      <p>So, kickstart this collaborative journey today!</p>
    `,
  }
};
</script>
