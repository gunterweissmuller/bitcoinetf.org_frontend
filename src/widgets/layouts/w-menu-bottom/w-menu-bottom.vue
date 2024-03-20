<template>
  <footer v-if="route.name !== 'buy-shares'" :class="['w-menu-bottom', { 'w-menu-bottom--menu-opened': isOpenMenu }]">
    <ul class="w-menu-bottom__list">
      <div v-for="item in navList" :key="item.title" :id="`menu-${item.link}-bottom`">
        <m-popper
          v-if="item.link === 'personal-buy-shares'"
          :text="btnPopper.text"
          :title="btnPopper.title"
          :show="showBuyPopper"
          close-btn
          type="colorful"
          @close="closePopper"
          @click="() => {$app.store.user.setIsInvestModalShow({show: true});}"
          style="cursor: pointer"
        > <!--@click="$router.push({ name: 'personal-buy-shares' })"-->
          <nuxt-link :to="{ name: item.link }" class="w-menu-bottom__item" @click="emit('click-link')">
            <a-icon
              :class="['w-menu-bottom__item-img', { 'w-menu-bottom__item-img--active': activeLinkClass(item.link) }]"
              width="32"
              height="32"
              :name="item.icon"
            />
            <p
              :class="[
                'w-menu-bottom__item-text',
                'w-menu-bottom__item-text--buy',
                { 'w-menu-bottom__item-text--active': activeLinkClass(item.link) },
              ]"
              v-html="item.title"
            ></p>
          </nuxt-link>
        </m-popper>
        <nuxt-link v-else :to="{ name: item.link }" class="w-menu-bottom__item" @click="emit('click-link')">
          <a-icon
            :class="['w-menu-bottom__item-img', { 'w-menu-bottom__item-img--active': activeLinkClass(item.link) }]"
            width="24"
            height="24"
            :name="item.icon"
          />
          <p :class="['w-menu-bottom__item-text', { 'w-menu-bottom__item-text--active': activeLinkClass(item.link) }]">
            {{ item.title }}
          </p>
        </nuxt-link>
      </div>
      <li class="w-menu-bottom__item" @click="toggleMenu">
        <a-icon
          :class="[
            'w-menu-bottom__item-img',
            { 'w-menu-bottom__item-img--active': isOpen || activeLinkClass('personal-more') },
          ]"
          width="24"
          height="24"
          :name="Icon.MonoMenu"
        />
        <p
          :class="[
            'w-menu-bottom__item-text',
            { 'w-menu-bottom__item-text--active': activeLinkClass('personal-more') },
          ]"
        >
          Menu
        </p>
      </li>
    </ul>
  </footer>
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import { useRoute } from 'vue-router'
import MPopper from '~/src/shared/ui/molecules/m-popper/m-popper.vue'
import { nextTick } from 'vue'
import useMediaDevice from '~/composables/useMediaDevice'
import { useNuxtApp } from '#app'

const router = useRouter()

const props = withDefaults(
  defineProps<{
    isOpenMenu: boolean
  }>(),
  {
    isOpenMenu: false,
  },
)

const route = useRoute()
const { $app } = useNuxtApp()
const { isMobile, isTablet } = useMediaDevice()

const navList = [
  { title: 'Analytics', icon: Icon.MonoAnalytics, link: 'personal-performance' },
  { title: 'Dividends', icon: Icon.MonoEarnings, link: 'personal-earnings' },
  {
    title: "BUY <i class='a-icons icon-mono--btc-uni convert-icon' aria-hidden='true' ></i> ETF ",
    icon: Icon.ColorfulBitcoin,
    link: 'personal-buy-shares',
  },
  { title: 'Wallet', icon: Icon.MonoWallet, link: 'personal-dividends' },
]

const isOpen = ref<boolean>(false)

const apyValue = ref(14)

const emit = defineEmits(['toggle-menu', 'click-link'])

const hashMap = {
  'personal-dividends': 'walletDividends',
  'personal-referrals': 'walletReferral',
  'personal-bonus': 'walletBonus'
}

const boostText = computed(() => {
  switch (route.name) {
    case 'personal-dividends':
      return 'Dividends'
    case 'personal-referrals':
      return 'Referrals'
    case 'personal-bonus':
      return 'Bonus'
    default:
      return ''
  }
})

const btnPopperText = computed(() => {
  const divSum = $app.store.user?.[hashMap?.[route.name]]?.usd_amount || 0
  const divSumIn3Years = divSum + divSum * (apyValue.value / 100) * 3
  return `Reinvest ${boostText.value} into ${$app.filters.rounded(
    divSum,
    2,
  )} Bitcoin ETF shares. Aim for a combined return of over $${$app.filters.rounded(
    divSumIn3Years,
    2,
  )} in just 1095 days!`
})

const btnPopper = ref({
  title: 'Boost Your Dividends! 🚀',
  text: btnPopperText.value,
})

const toggleMenu = () => {
  router.push({ name: 'personal-more' })
}

const pageAmount = computed(() => {
  return $app.store.user?.[hashMap?.[route.name]]?.usd_amount || 0
})

const showBuyPopper = ref(false)

const isShowBuyPopper = computed<boolean>(() => {
  const onboarding = localStorage.getItem('journey')

  return (
    (isMobile.value || isTablet.value) &&
    $app.store.user?.[hashMap?.[route.name]]?.usd_amount &&
    (route.name === 'personal-dividends' || route.name === 'personal-referrals' || route.name === 'personal-bonus') &&
    onboarding
  )
})

const closePopper = () => {
  showBuyPopper.value = false
}

const activeLinkClass = (link: string): boolean => {
  switch (link) {
    case 'personal-performance':
      return (
        route.name === 'personal-performance' ||
        route.name === 'personal-portfolio' ||
        route.name === 'personal-fund' ||
        route.name === 'personal-asset-id'
      )
    case 'personal-earnings':
      return route.name === 'personal-earnings'
    case 'personal-more':
      return route.name?.includes('personal-more')
    case 'personal-dividends':
      return (
        route.name === 'personal-dividends' || route.name === 'personal-referrals' || route.name === 'personal-bonus'
      )

    default:
      return false
  }
}


watch(pageAmount, (v) => {
  showBuyPopper.value = v && isShowBuyPopper.value
  btnPopper.value.title = `Boost Your ${boostText.value}! 🚀`
  btnPopper.value.text = btnPopperText.value

}, {
  immediate: true
})
</script>

<style src="./w-menu-bottom.scss" lang="scss" />
