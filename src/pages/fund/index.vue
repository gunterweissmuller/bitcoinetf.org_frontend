<template>
  <m-scroll-navigation
    v-if="sections && y > sections[1]?.top"
    :length="sections.length - 1"
    :data="scrollInfo"
  />
  <s-site-fund-main :data="mainData"/>
  <s-site-marquee-new :data="marqueeData" :isBackground="false"/>
  <s-site-fund-vision :data="visionData"/>
  <s-site-fund-ceo :data="ceoData"/>
  <s-site-fund-main-info-dark/>
  <s-site-fund/>
  <s-site-footer/>
</template>

<script setup lang="ts">
import MScrollNavigation from "~/src/shared/ui/site/molecules/m-scroll-navigation/m-scroll-navigation.vue";
import SSiteFundMain from "~/src/shared/ui/site/sections/s-site-fund-main/s-site-fund-main.vue";
import SSiteMarqueeNew from "~/src/shared/ui/site/sections/s-site-marquee-new/s-site-marquee-new.vue";
import SSiteFundVision from "~/src/shared/ui/site/sections/s-site-fund-vision/s-site-fund-vision.vue";
import SSiteFundCeo from "~/src/shared/ui/site/sections/s-site-fund-ceo/s-site-fund-ceo.vue";
import SSiteFundMainInfoDark from '~/src/shared/ui/site/sections/s-site-fund-main-info-dark/s-site-fund-main-info-dark.vue'
import SSiteFund from '~/src/shared/ui/site/sections/s-site-fund/s-site-fund.vue'
import SSiteFooter from "~/src/shared/ui/site/sections/s-site-footer/s-site-footer.vue";
import {useWindowScroll, useWindowSize} from "@vueuse/core";

definePageMeta({
  layout: 'site-dark',
})
useSeoMeta({
  title: 'About Our Fund | BitcoinETF.org - Diversified Bitcoin Investment Solutions',
  description:'Explore BitcoinETF.org\'s fund strategy, including AI arbitrage, futures, and spot Bitcoin auto-trading desks. Invest in a diversified portfolio that leverages market fluctuations for optimal returns.'
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
    id: sectionsArray.length ,
  }

  sections.value = Object.values(sectionsArray).map((section, index) => ({
    top: section.offsetTop - header.offsetHeight,
    name: index > 0 ? section.dataset.name : '',
    id: index,
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
  title: 'Trust, Transparency <span>& Tangibility</span>',
  message: 'Real time on-chain financial attestations',
  img: '/img/site-dark/s-site-fund-main/1.png',
  text: 'Our vision and relentless dedication have set us apart, earning us a distinctive space at the forefront of the Bitcoin industry.',
  btn: {
    text: 'Learn more',
  },
};

const visionData = {
  name: 'Vision',
  title: 'Our vision <span>and relentless</span> dedication have set us apart',
  info: {
    text: `
      <p>Rooted in Innovation: Established in 2023 and anchored in Hong Kong, BitcoinETF emerged as the trailblazing Digital Bitcoin ETF.</p>
      <p>Our vision and relentless dedication have set us apart, earning us a distinctive space at the forefront of the Bitcoin industry.</p>
    `,
  },
  img: '/img/site-dark/s-site-fund-vision/1.png',
  points: [
    {
      title: '130M+',
      text: 'Total Satoshis Distributed',
    },
    {
      title: '$10M+',
      text: 'Total user Dividends',
    },
    {
      title: '28%',
      text: 'Current Overall APY (USD)',
    },
    {
      title: '$50MT',
      text: 'Assets Under Management',
    },
  ],
};

const ceoData = {
  name: 'Our CEO',
  title: 'MEET JALAL SAID <span>OUR TRUSTED CEO</span>',
  img: '/img/site-dark/s-site-fund-ceo/1.png',
  info: {
    text: `
      <p>Jalal has been at the helm of BitcoinETF since 2023, expertly managing over $1 Billion.</p>
      <p>With roles in global financial hubs like Tokyo, Hong Kong, and Dubai, he's a recognized voice in Bitcoin and fintech.</p>
    `,
    btn: {
      text: 'Invest with Confidence',
    }
  },
  message: 'Management you can rely on',
  points: [
    {
      title: 'Expert Management',
      text: 'Oversees a portfolio exceeding $1 billion',
    },
    {
      title: 'Global Expertise',
      text: 'Across continents from Asia to Europe',
    },
    {
      title: 'Fintech Pioneer',
      text: 'A regular speaker at major industry events',
    },
  ],
};

// const marqueeData = {
//   low_cards: [
//     '/img/site-dark/s-site-marquee/1.svg',
//     '/img/site-dark/s-site-marquee/2.svg',
//     '/img/site-dark/s-site-marquee/3.svg',
//     '/img/site-dark/s-site-marquee/4.svg',
//   ],
// };

const marqueeData = {
  low_cards: [
    {
      link: 'https://www.digitaljournal.com/pr/news/globe-pr-wire/bitcoinetf-org-surpasses-50m-in-assets-under-management-in-its-inaugural-year-exclusively-serving-select-international-markets',
      img: '/marquee/digitaljournal.svg'
    },
    {
      link: 'https://www.benzinga.com/content/36408488/bitcoinetf-org-surpasses-50m-in-assets-under-management-in-its-inaugural-year-exclusively-serving-se',
      img: '/marquee/benzinga.png'
    },
    {
      link: 'https://apnews.com/press-release/marketersmedia/bitcoinetf-org-surpasses-50m-in-assets-under-management-in-its-inaugural-year-exclusively-serving-select-international-markets-ed41cc9cde1250d6767d3972cc0a46cd',
      img: '/marquee/ap.svg'
    },
    {
      link: 'https://markets.businessinsider.com/news/stocks/bitcoinetf-org-surpasses-50m-in-assets-under-management-in-its-inaugural-year-exclusively-serving-select-international-markets-1032931262',
      img: '/marquee/bi.svg'
    },
    {
      link: 'https://pr.newsmax.com/article/BitcoinETForg-Surpasses-dollar50M-in-Assets-Under-Management-in-Its-Inaugural-Year-Exclusively-Serving-Select-International-Markets?storyId=658e58f2f29dad0008f55450',
      img: '/marquee/nm.svg'
    },
    {
      link: 'https://www.streetinsider.com/The+Financial+Capital/BitcoinETF.org+Surpasses+%2450M+in+Assets+Under+Management+in+Its+Inaugural+Year%2C+Exclusively+Serving+Select+International+Markets/22574048.html',
      img: '/marquee/StreetInsider.com.svg'
    },
  ],
}

</script>
