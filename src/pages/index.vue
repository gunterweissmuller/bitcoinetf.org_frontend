<template>
  <m-scroll-navigation
    v-if="sections && y > sections[0]?.top"
    :length="sections.length + 1"
    :data="scrollInfo"
    hidden-mobile
  />
  <s-site-main :data="mainData" />
  <s-site-marquee :data="marqueeData" />
  <s-site-how-it-work />
  <s-site-main-calculate />
  <s-site-guarantees />
  <!-- <s-site-welcome :data="welcomeData"/> -->
  <!--<s-site-act :data="actData"/>-->
  <!-- <s-site-investor :data="investorData"/> -->
  <!-- <s-site-fundinfo-dark/> -->
  <!--<s-site-fund/>-->
  <!-- <s-site-protection :data="protectionData"/> -->
  <s-site-bitcoin-education :data="blogNewsEdu" :is-education="true" />
  <s-site-earnings :data="earningsData" />
  <s-site-transparency :data="transparencyData" />
  <s-site-ultimate :data="ultimateData"/>
  <s-site-news :data="blogNews" v-if="blogNews?.length" />
  <s-site-footer />
</template>

<script setup lang="ts">
import { BITCOIN_EDUCATION_NEWS_UUID, BLOG_NEWS_UUID } from '~/src/shared/constants/global'
import MScrollNavigation from '~/src/shared/ui/site/molecules/m-scroll-navigation/m-scroll-navigation.vue'
import SSiteMain from '~/src/shared/ui/site/sections/s-site-main/s-site-main.vue'
import SSiteMarquee from '~/src/shared/ui/site/sections/s-site-marquee/s-site-marquee.vue'
import SSiteWelcome from '~/src/shared/ui/site/sections/s-site-welcome/s-site-welcome.vue'
import SSiteAct from '~/src/shared/ui/site/sections/s-site-act/s-site-act.vue'
import SSiteUltimate from '~/src/shared/ui/site/sections/s-site-ultimate/s-site-ultimate.vue'
import SSiteInvestor from '~/src/shared/ui/site/sections/s-site-investor/s-site-investor.vue'
import SSiteFund from '~/src/shared/ui/site/sections/s-site-fund/s-site-fund.vue'
import SSiteProtection from '~/src/shared/ui/site/sections/s-site-protection/s-site-protection.vue'
import SSiteEarnings from '~/src/shared/ui/site/sections/s-site-earnings/s-site-earnings.vue'
import SSiteTransparency from '~/src/shared/ui/site/sections/s-site-transparency/s-site-transparency.vue'
import SSiteFooter from '~/src/shared/ui/site/sections/s-site-footer/s-site-footer.vue'
import SSiteFundinfoDark from '~/src/shared/ui/site/sections/s-site-fundinfo-dark/s-site-fundinfo-dark.vue'
import SSiteBitcoinEducation from '~/src/shared/ui/site/sections/s-site-bitcoin-education/s-site-bitcoin-education.vue'
import SSiteNews from '~/src/shared/ui/site/sections/s-site-news/s-site-news.vue'
import SSiteHowItWork from '~/src/shared/ui/site/sections/s-site-how-it-work/s-site-how-it-work.vue'
import SSiteGuarantees from '~/src/shared/ui/site/sections/s-site-guarantees/s-site-guarantees.vue'
import SSiteMainCalculate from '~/src/shared/ui/site/sections/s-site-main-calculate/s-site-main-calculate.vue'

import { useWindowScroll } from '@vueuse/core'
import { useWindowSize } from '@vueuse/core'
import { useNuxtApp } from '#app'
import localStorage from '../app/localStorage'
import { defineAsyncComponent } from 'vue'

const LandingCalculation = defineAsyncComponent(
  () => import('~/src/shared/ui/molecules/m-profit-calculator-new/m-profit-calculator-new.vue'),
)

definePageMeta({
  layout: 'site-dark',
})
useSeoMeta({
  title: 'BitcoinETF.org: Premier Digital ETF | Earn Bitcoin Dividends Daily',
  description:
    'Join BitcoinETF.org, the leading digital ETF platform offering daily Bitcoin dividends, a robust reserve fund, and a sophisticated Mastercard. Calculate your potential returns, learn about our automated trading desks, and secure your financial freedom with transparent investments starting from $1,000.',
})

const { y } = useWindowScroll(window)

const isLoaded = ref(false)

const scrollInfo = ref({})

const sections = ref([])

const START_TO_SHOW_SECTION_ID = 2
const IGNORE_SECTIONS_ID = [0]

const getElements = () => {
  const sectionsArray = document.querySelectorAll('section')
  const footer = document.querySelector('footer')
  const header = document.querySelector('header')

  sections.value = Object.values(sectionsArray)
    .filter((section, index) => !IGNORE_SECTIONS_ID.includes(index))
    .map((section, index) => ({
      top: section.offsetTop - header.offsetHeight,
      name: section.dataset.name || '',
      id: index + START_TO_SHOW_SECTION_ID,
    }))

  const lasElement = {
    top: footer.offsetTop - header.offsetHeight - window.innerHeight / 5,
    name: 'Final',
    id: sections.value.length + START_TO_SHOW_SECTION_ID,
  }

  sections.value.push(lasElement)
}

onUpdated(() => {
  if (!isLoaded.value) {
    getElements()
  }
  isLoaded.value = true
})

const timerId = ref(null)

watch(y, (newVal) => {
  clearTimeout(timerId.value)
  timerId.value = setTimeout(() => {
    getElements()
  }, 0)

  sections.value.forEach((section) => {
    if (newVal > section.top) {
      scrollInfo.value = section
    }
  })
})

const mainData = {
  title: '<span>DON’T BUY</span> BITCOIN, EARN <span>IT</span>',
  items: [
    {
      title: '$9,483.59',
      text: 'Dividends paid',
    },
    {
      title: '1,023',
      text: 'BTC in Reserve Fund',
    },
    {
      title: '$65,234,354',
      text: 'Assets Under Management',
    },
  ],
  startItems: [
    {
      subtitle: 'Daily Dividends',
      title: '$24.7',
      text: 'Projected',
    },
    {
      subtitle: 'Total Dividends',
      title: '$1,999',
      text: 'Projected',
    },
    {
      subtitle: 'APY',
      title: '33%',
      text: 'Projected',
    },
  ],
}

const marqueeData = {
  low_cards: [
    {
      link: '/#',
      img: '/img/icons/colorful/yahoo.svg',
    },
    {
      link: '/#',
      img: '/img/icons/colorful/bloomberg.svg',
    },
    {
      link: '/#',
      img: '/img/icons/colorful/coindesk.svg',
    },
    {
      link: '/#',
      img: '/img/icons/colorful/cointelegraph.svg',
    },
  ],
}

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

const actData = {
  name: 'Halving',
  title: 'ACT NOW, <span>BEFORE THE</span> BITCOIN HALVING',
  text: 'Hurry up and sign up!',
  timer: {
    text: '2024<br /> Bitcoin Halving <br /> ETA',
    date: 'Mon Apr 20 2024 00:00:00 GMT+0300',
  },
  info: {
    text: `
      <p>The Bitcoin Halving is around the corner! Historically, it's a catalyst for major price surges.</p>
      <p>Don't miss out on the prime opportunity to earn daily dividends as Bitcoin's value climbs.</p>
    `,
    btn: {
      text: 'Become an investor',
    },
  },
}

const ultimateData = {
  name: 'Mastercard',
  title: 'THE ULTIMATE <span>CRYPTO-POWERED</span> MASTERCARD',
  img: '/img/site-dark/s-site-ultimate/hand.png',
  info: {
    text: `
      <p>Redefine the way you spend with the power of Bitcoin right in your pocket.</p>
      <p>Our exclusive Mastercard bridges the gap between traditional finance and the world of cryptocurrency.</p>
    `,
    btn: {
      text: 'Unlock financial freedom',
    },
  },
  message: 'Your Financial Freedom',
  points: [
    {
      title: 'Sky-High Limits',
      text: 'Spend up to $100,000 daily. Unleash true financial power!',
    },
    {
      title: 'Easy Funding',
      text: 'Load up with Bitcoin or major stablecoins. Enjoy seamless spending.',
    },
    {
      title: 'Be First',
      text: 'Grab your exclusive spot in the payment revolution. Stand out, stay ahead.',
    },
  ],
}

const investorData = {
  name: 'Get started',
  title: 'BECOME <span>AN INVESTOR</span> IN 3 EASY STEPS',
  steps: [
    {
      title: 'Sign up',
      text: 'Just an e-mail away.',
      img: '/img/site-dark/s-site-investor/1.png',
    },
    {
      title: 'Buy Shares',
      text: 'Tailor your dividend stream.',
      img: '/img/site-dark/s-site-investor/2.png',
    },
    {
      title: 'Receive ₿ Daily',
      text: 'Set up and let the Bitcoin flow.',
      img: '/img/site-dark/s-site-investor/3.png',
    },
  ],
}

const protectionData = {
  name: 'Protection',
  title: 'PROTECTION VAULT',
  message: 'Additional Protection',
  info_1: {
    title: 'Automated Hedging',
    text: 'Our advanced trading bot performs hedging operations every time the Bitcoin price drops, making a profit.',
  },
  info_2: {
    title: 'Deposits to the Vault',
    text: 'Whenever our AI trading bot profits from the hedging operations, the profit is deposited into the Protection Vault in the form of stablecoins. This ensures that the value of these funds remains stable, irrespective of Bitcoin price volatility.',
  },
  img: '/img/site-dark/s-site-protection/1.png',
  items: [
    {
      title: 'Earn up to 33% APY in USD',
      text: 'Outperforming industry averages over the last 12 months.',
    },
    {
      title: 'Invest as little as $1,000',
      text: 'Dividends paid on a DAILY basis right to your wallet of choice.',
    },
    {
      title: 'Assured Dividends',
      text: 'Contractually Guaranteed APY by the Bitcoin ETF Issuer.',
    },
  ],
}

const earningsData = {
  name: 'Earnings',
  title: 'Transparent Earnings <span>Every 👏🏽 Single  👏🏽 Day 👏🏽</span>',
  img_1: '/img/site-dark/s-site-earnings/1.png',
  img_2: '/img/site-dark/s-site-earnings/2.png',
  img_3: '/img/site-dark/s-site-earnings/3.png',
  qr: '/img/site-dark/s-site-earnings/qr.png',
  message: 'Your Statements',
  info: {
    text: `
      <p>Receive detailed monthly dividend statements straight to your inbox.</p>
      <p>Not just a record of your BitcoinETF earnings but an official income verification too.</p>
    `,
    btn: {
      text: 'Start Earning',
    },
  },
  items: [
    {
      title: 'Full Overview',
      text: 'Each daily payment, clearly detailed',
    },
    {
      title: 'Monthly Summaries',
      text: 'Track your monthly totals with ease',
    },
    {
      title: 'QR Verification',
      text: 'Your earnings, verified in a snap',
    },
    {
      title: 'Trust & Transparency',
      text: 'Official statements for peace of mind.',
    },
  ],
}

const transparencyData = {
  name: 'Transparency',
  title: 'TOTAL TRANSPARENCY, <span>TOTAL TRUST</span>',
  text: `
    <p>At BitcoinETF, our actions are clear as day. From every USDT and Bitcoin transaction to our vault details - everything is open for third-party audits.</p>
    <p>We believe in total openness, providing you with regular financial statements and real-time trading data.</p>
  `,
  img: '/img/site-dark/s-site-transparency/1.png',
  slides: [
    {
      title: 'Open Transactions',
      text: 'Every USDT & Bitcoin transaction is verifiable',
    },
    {
      title: 'Auditable Vaults',
      text: 'Our vaults stand up to independent scrutiny',
    },
    {
      title: 'Real-time Data',
      text: 'Stay informed with a minimal delay',
    },
  ],
}

const blogNews = ref([])
const blogNewsPage = ref(1)

const blogNewsEdu = ref([])
const blogNewsEduPage = ref(1)

const getBlogNewsRequest = async (uuid, page = 1) => {
  return await useNuxtApp()
    .$app.api.eth.news.getListNewsArticles({ uuid, page })
    .then((resp) => resp)
}

interface Post {
  slug: string
  title: string
  excerpt: string
  feature_image: string
  created_at: string
}

interface Blog {
  posts: Post[]
}

const blogPosts = ref<Post[]>([])

const blogConfig = (page: number) => {
  return {
    limit: 11,
    fields: 'slug,title,excerpt,feature_image,created_at',
    page: page,
  }
}

const getBlogNews = async (page: number = 1) => {
  return await useNuxtApp()
    .$app.api.eth.news.getGhostBlogs(blogConfig(page))
    .then(({ data }: { data: Blog }) => {
      blogNews.value = data.posts
    })
}

const getBlogNewsEdu = async (uuid = BITCOIN_EDUCATION_NEWS_UUID, page = 1) => {
  const response = await getBlogNewsRequest(BITCOIN_EDUCATION_NEWS_UUID, page)
  blogNewsEdu.value = [...blogNewsEdu.value, ...response.data.data]

  if (response.data.total > blogNewsEdu.value.length) {
    blogNewsEduPage.value += 1

    await getBlogNewsEdu(uuid, blogNewsEduPage.value)
  }
}

onMounted(async () => {
  await getBlogNews()
  await getBlogNewsEdu()
})
</script>
