<template>
  <transition>
    <aside ref="asideRef" :class="['w-aside', { 'w-aside--page': isPage }]">
      <div class="w-aside__inner">
        <div class="w-aside__logo">
          <nuxt-link to="/">
            <a-icon class="w-aside__logo-icon" :name="getLogo" width="142" height="24" />
          </nuxt-link>
        </div>
        <div v-if="!isPage && isShowBuyButton" class="w-aside__button">
          <!-- <a-button
            :icon="Icon.MonoPlus"
            size="small"
            class="w-aside__button-buy"
            text="Buy Bitcoin ETF Shares"
            @click="$router.push({ name: 'personal-buy-shares' })"
          /> -->
          <a-button
            :icon="Icon.MonoPlus"
            size="small"
            class="w-aside__button-buy"
            text="Buy Bitcoin ETF Shares"
            @click="() => {$app.store.user.isInvestModalShow.show = true;}"
          />
          
        </div>
        <div class="w-aside__links">
          <ul class="w-aside__list">
            <li v-for="(nav, index) in routesList" :key="index" class="w-aside__item" :id="`menu-${nav.link}`">
              <m-accordion
                v-if="nav.subNav"
                :icon="nav.icon"
                :top-link="nav.link"
                ref="accordionRef"
                class="w-aside__accordion"
                :title="nav.title"
                :activeLink="activeLinkClass(nav.link)"
              >
                <template #default>
                  <div class="w-aside__sub-nav">
                    <nuxt-link
                      v-for="(item, idx) in nav.subNav"
                      :key="idx"
                      class="w-aside__sub-nav__link"
                      :to="{ name: item.link }"
                      active-class="w-aside__sub-nav__link--active"
                      >{{ item.title }}
                    </nuxt-link>
                  </div>
                </template>
              </m-accordion>

              <nuxt-link
                v-else
                :class="['w-aside__link', { 'w-aside__link--active': activeLinkClass(nav.link) }]"
                :to="{ name: nav.link }"
                active-class="w-aside__link--active"
              >
                <a-icon class="w-aside__link-img" :name="nav.icon" width="24" height="24" />
                <p class="w-aside__link-text">{{ nav.title }}</p>
                <a-icon class="w-aside__link-chevron" :name="Icon.MonoChevronRight" width="24" height="24" />
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div class="w-aside__item w-aside__item--more">
          <nuxt-link
            :class="['w-aside__link', { 'w-aside__link--active': activeLinkClass('personal-more') }]"
            to="/personal/more"
            active-class="w-aside__link--active"
            @click="onClickLink"
          >
            <a-icon class="w-aside__link-img" :name="Icon.MonoMore" width="24" height="24" />
            <p class="w-aside__link-text">More</p>
            <a-icon class="w-aside__link-chevron" :name="Icon.MonoChevronRight" width="24" height="24" />
          </nuxt-link>
        </div>

        <div class="w-aside__avatar">
          <a-avatar size="64px" photo-src="/img/avatar.png" :robot-data="$app.store.user?.info?.account?.uuid" class="w-aside__avatar-pic" />
          <div v-if="$app.store.user?.info?.profile?.full_name" class="w-aside__avatar-title">
            {{ $app.store.user?.info?.profile?.full_name }}
          </div>
          <div class="w-aside__avatar-subtitle">@{{ $app.store.user?.info?.account?.username }}</div>

        </div>

        <f-refer-friends class="w-aside__refer" :modal="false" @click="isOpenModalRefer = true" />

        <div class="w-aside__poster">
          <div class="w-aside__poster-title">Earn $20 by inviting your friends! 💸</div>
          <div class="w-aside__poster-text">
            We pay you $20 for each successful sign up. Get your friends and family to join!
          </div>
          <a-icon class="w-aside__poster-chevron" :name="Icon.MonoChevronRight" width="18" height="18" />
        </div>

        <nav class="w-aside__wrapper">
          <ul class="w-aside__list">
            <template v-for="(nav, index) in navList">
              <li v-if="!nav?.isHidden" :key="index" class="w-aside__item w-aside__item-mobile">
                <div v-if="nav.type === 'button'" class="w-aside__link" @click="nav.callback">
                  <a-icon class="w-aside__link-img" :name="nav.icon" width="24" height="24" />
                  <p class="w-aside__link-text">{{ nav.title }}</p>
                  <a-icon class="w-aside__link-chevron" :name="Icon.MonoChevronRight" width="24" height="24" />
                </div>
                <nuxt-link
                  v-else
                  class="w-aside__link"
                  :to="nav.link"
                  active-class="w-aside__link--active"
                  :target="nav?.newTab ? '_blank' : '_self'"
                  @click="onClickLink"
                >
                  <a-icon class="w-aside__link-img" :name="nav.icon" width="24" height="24" />
                  <p class="w-aside__link-text">{{ nav.title }}</p>
                  <a-icon class="w-aside__link-chevron" :name="Icon.MonoChevronRight" width="24" height="24" />
                </nuxt-link>
              </li>
            </template>
            <li class="w-aside__item w-aside__item--indent w-aside__item--avatar">
              <div class="w-aside__link">
                <a-avatar
                  size="24px"
                  class="w-aside__link-avatar"
                  photo-src="/img/avatar.png"
                  :text="$app.store.user?.info?.account?.username"
                  :robot-data="$app.store.user?.info?.account?.uuid"
                  @click="$router.push('/personal/more')"
                />
              </div>
            </li>
            <li class="w-aside__item w-aside__item--logout" @click="logout">
              <div class="w-aside__link">
                <a-icon class="w-aside__link-img" :name="Icon.MonoLogout" width="24" height="24" />
                <p class="w-aside__link-text">Log out</p>
                <a-icon class="w-aside__link-chevron" :name="Icon.MonoChevronRight" width="24" height="24" />
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  </transition>
  <e-apply-credit-card-modal @accept="acceptCreditCard" v-model="isOpenModalCredit" />
  <e-apply-credit-success-modal v-model="isOpenModalCreditSuccess" :count="cardCount" />
  <f-refer-friends
    class="w-aside__refer"
    :button="false"
    :show="isOpenModalRefer"
    @update="isOpenModalRefer = $event"
  />
  <f-terms-modal v-model="isOpenTermsModal" title="Purchase agreement" />
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import AAvatar from '~/src/shared/ui/atoms/a-avatar/a-avatar.vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import EApplyCreditCardModal from '~/src/entities/e-apply-credit-card-modal/e-apply-credit-card-modal.vue'
import EApplyCreditSuccessModal from '~/src/entities/e-apply-credit-success-modal/e-apply-credit-success-modal.vue'
import FReferFriends from '~/src/features/f-refer-friends/f-refer-friends.vue'
import useMediaDevice from '~/composables/useMediaDevice'
import MAccordion from '~/src/shared/ui/molecules/m-accordion/m-accordion.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import { ref } from 'vue'
import FTermsModal from '~/src/features/f-terms-modal/f-terms-modal.vue'

const { $app } = useNuxtApp()

const isUserAuthenticated = computed(() => {
  return $app.store.auth.isUserAuthenticated
})

const { isLaptop, isDesktop, isMobile, isTablet } = useMediaDevice()
const route = useRoute()

const isOpenModalCredit = ref(false)
const isOpenModalCreditSuccess = ref(false)
const isOpenModalRefer = ref(false)

const cardCount = ref(0)

withDefaults(
  defineProps<{
    isPage: boolean
  }>(),
  {
    isPage: false,
  },
)

const isHiddenTerms = computed(() => {
  return !$app.store.user.lastPayment
})

const checkCardRequest = async () => {
  await $app.api.eth.billingEth
    .getCreditCardRequestInfo()
    .then((response) => {
      if (response.data.is_created) {
        cardCount.value = response.data.number
        isOpenModalCreditSuccess.value = true
      } else {
        isOpenModalCredit.value = true
      }
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const isShowBuyButton = computed<boolean>(() => {
  if ((isDesktop.value || isLaptop.value) && route.name === 'personal-earnings') {
    return true
  }

  return (
    (isDesktop.value || isLaptop.value) &&
    // route.name !== 'personal-buy-shares' &&
    route.name !== 'personal-buy-shares-payment'
  )
})

const getLogo = computed(() => {
  return $app.store.user.theme === 'dark' ? Icon.ColorfulBtcDarkLogo : Icon.ColorfulBitcoinFull
})

const requestCreditCard = async () => {
  await $app.api.eth.billingEth
    .requestCreditCard()
    .then((response) => {
      cardCount.value = response.data.number
      isOpenModalCreditSuccess.value = true
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const openModalCredit = async () => {
  await checkCardRequest()
}

const acceptCreditCard = async () => {
  await requestCreditCard()
}

const isOpenTermsModal = ref(false)

const openTermsModal = () => {
  isOpenTermsModal.value = true
}

const routesList = [
  {
    title: 'Analytics',
    icon: Icon.MonoAnalytics,
    link: 'personal-performance',
    subNav: [
      {
        title: 'Performance',
        icon: Icon.MonoEarnings,
        link: 'personal-performance',
      },
      {
        title: 'Portfolio',
        icon: Icon.MonoEarnings,
        link: 'personal-portfolio',
      },
      {
        title: 'Fund',
        icon: Icon.MonoEarnings,
        link: 'personal-fund',
      },
    ],
  },
  {
    title: 'Dividends',
    icon: Icon.MonoEarnings,
    link: 'personal-earnings',
  },
  {
    title: 'Wallet',
    icon: Icon.MonoWallet,
    link: 'personal-dividends',
    subNav: [
      {
        title: 'Dividends',
        icon: Icon.MonoEarnings,
        link: 'personal-dividends',
      },
      {
        title: 'Referrals',
        icon: Icon.MonoEarnings,
        link: 'personal-referrals',
      },
      {
        title: 'Bonus',
        icon: Icon.MonoEarnings,
        link: 'personal-bonus',
      },
    ],
  },
]

const navList = ref([
  {
    title: 'Personal details',
    icon: Icon.MonoProfile,
    link: '/personal/more/personal-details',
  },
  {
    title: 'Display currency',
    icon: Icon.MonoBitcoinB,
    link: '/personal/more/display-currency',
  },
  {
    title: 'Change password',
    icon: Icon.MonoLock,
    link: '/personal/more/change-pass',
  },
  {
    title: 'Theme',
    icon: Icon.MonoTheme,
    link: '/personal/more/theme',
  },
  {
    title: 'Apply for credit card',
    icon: Icon.MonoCreditCard,
    type: 'button',
    callback: openModalCredit,
  },
  {
    title: 'Bitcoin education',
    icon: Icon.MonoLearn,
    link: '/bitcoin-education',
    newTab: isUserAuthenticated.value,
  },
  {
    title: 'Blog',
    icon: Icon.MonoBlog,
    link: '/blog',
    newTab: isUserAuthenticated.value,
  },
  {
    title: 'Purchase agreement',
    isHidden: isHiddenTerms.value,
    icon: Icon.MonoTerms,
    type: 'button',
    callback: openTermsModal,
  },
  {
    title: 'Support',
    icon: Icon.MonoSupport,
    link: '/personal/support',
  },
])

const asideRef = ref(null)

const emit = defineEmits(['click-link', 'click-outside'])

const onClickLink = () => {
  emit('click-link')
}

const logout = () => {
  $app.store.auth.logout()
}

const activeLinkClass = (link: string): boolean => {
  switch (link) {
    case 'personal-performance':
      return (
        route.name === 'personal-performance' || route.name === 'personal-portfolio' || route.name === 'personal-fund'
      )
    case 'personal-dividends':
      return (
        route.name === 'personal-dividends' || route.name === 'personal-referrals' || route.name === 'personal-bonus'
      )
    case 'personal-more':
      return route.name?.includes('personal-more')

    default:
      return false
  }
}
</script>

<style src="./w-aside.scss" lang="scss" />
