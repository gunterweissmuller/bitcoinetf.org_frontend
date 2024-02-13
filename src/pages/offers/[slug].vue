<template>
  <component v-for="section in sections" :is="section.name" :data="section?.data" :files="section?.files" />
</template>

<script setup lang="ts">
import SSiteOfferDetail from '~/src/shared/ui/site/sections/s-site-offer-detail/s-site-offer-detail.vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'

const { $app } = useNuxtApp()

const route = useRoute()
const currentSlugForApi = route.path.slice(1).replaceAll('/', '-')
definePageMeta({
  layout: 'site-texts',
})
const { data: sections, pending } = useAsyncData('fund', async () => {
  return await $app.api.eth.pages.getPageInfo(currentSlugForApi).then((resp) => {
    return resp.sections
  })
})
const offer = {
  title: 'Win 3 BTC for Christmas 2024!',
  subtitle:
    'Dive into the Future of Investment with Our Bitcoin ETF Offer! Use Code “WIN3BTC2023” for an Exclusive $25 Bonus & a Shot at Winning 3 Bitcoins! 🚀',
  description:
    'Enroll now for a golden opportunity to celebrate the holiday season with an extra 3 Bitcoins in your wallet!',
  img: '/img/offers/3.png',
  background: '/img/offers/bg-2.jpg',
  btn: {
    text: 'Create account',
    href: '',
  },
  texts: [
    {
      title: '🎉 Welcome to Your Golden Opportunity!',
      text: '<p>Ever dreamt of unlocking the mysteries and rewards of Bitcoin without the complexity? Your golden ticket is here! Join us on a revolutionary journey with our Bitcoin ETF that pays interest daily in Bitcoin starting Day 1 and grab your chance to WIN 3 BITCOINS!</p>',
    },
    {
      title: '💰 Exclusive $25 Bonus!',
      text: '<p>Simply SIGN UP with the referral code “WIN3BTC2024” and embark on your crypto adventure with a FREE $25 BONUS! Use this bonus to buy shares in our Bitcoin ETF and watch the magic happen!</p>',
    },
    {
      title: '🌟 Daily Bitcoin Interest!',
      text: '<p>From the very first day, enjoy the thrill of EARNING INTEREST DAILY, directly in Bitcoin! Watch your earnings grow every day as you experience the excitement of the crypto world!</p>',
    },
    {
      title: '🌟 Daily Bitcoin Interest!',
      text: '<p>By using the exclusive code, you’re automatically entered our thrilling raffle to WIN 3 BITCOINS! Yes, you heard it right! Three whole Bitcoins could be yours!</p>',
    },
    {
      title: '🎲 How Does the Raffle Work?',
      text: '<p>Block Height Countdown: The raffle is tied to Bitcoin block height 840,000, expected around April 25, 2024! Mark the date!</p><p>Shares & Transactions Alignment: The shareholder with the number of shares closest to the number of transactions in that block will be crowned the winner!</p><p>Sharing the Wealth: If multiple investors hit the magic number of shares, the grand prize of 3 Bitcoins will be evenly split!</p><p>Entry Deadline: Hurry! The last participants are accepted on April 15, 2024. Don’t miss your shot!</p><p>Announcement Delight: The winner(s) will be announced on our platform and contacted directly. Stay tuned for the big reveal!</p>',
    },
  ],
  steps: {
    title: 'Get started in 6 easy steps!',
    imgs: ['/img/offer/1.png', '/img/offer/2.png'],
  },
}
</script>
