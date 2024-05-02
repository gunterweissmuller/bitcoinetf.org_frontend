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

        <div class="w-aside__profile">
          <div class="w-aside__avatar">
            <div class="w-aside__avatar-logo">
              <a-icon
                class="w-aside__avatar-type"
                :name="userType === 'usdt' ? Icon.ColorfulUsdt : Icon.ColorfulBitcoin"
                width="24" height="24"
              />
              <a-avatar size="64px" photo-src="/img/avatar.png" :robot-data="$app.store.user?.info?.account?.uuid" class="w-aside__avatar-pic" />
            </div>
            <div class="w-aside__avatar-title">
              @{{ $app.store.user?.info?.account?.username }}
            </div>
            <div v-if="$app.store.user?.info?.profile?.full_name" class="w-aside__avatar-subtitle">
              {{ $app.store.user?.info?.profile?.full_name }}
            </div>

          </div>

          <w-certificate
            :type="userType"
            :username="$app.store.user?.info?.profile?.full_name"
            :shares="$app.store.user?.buyShares ?? 0"
            time="1094"
          />
        </div>

        <div class="w-aside__poster">
          <div class="w-aside__poster-title">Earn $20 by inviting your friends! 💸</div>
          <div class="w-aside__poster-text">
            We pay you $20 for each successful sign up. Get your friends and family to join!
          </div>
          <a-icon class="w-aside__poster-chevron" :name="Icon.MonoChevronRight" width="18" height="18" />
        </div>

        <nav class="w-aside__wrapper">
          <ul class="w-aside__list">
            <li class="w-aside__item w-aside__item-mobile">
              <nuxt-link
                class="w-aside__link"
                :to="{ name: 'personal-referrals' }"
                active-class="w-aside__link--active"
                target="_self"
                @click="onClickLink"
              >
              <!-- FIX ICON -->
                <!-- <a-icon class="w-aside__link-img" :name="Icon.MonoDollar" width="24" height="24" /> -->
                <div class="w-aside__link-img w-aside__link-img--referrals">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 11H13V7H15C15.2652 7 15.5196 7.10536 15.7071 7.29289C15.8946 7.48043 16 7.73478 16 8C16 8.26522 16.1054 8.51957 16.2929 8.70711C16.4804 8.89464 16.7348 9 17 9C17.2652 9 17.5196 8.89464 17.7071 8.70711C17.8946 8.51957 18 8.26522 18 8C18 7.20435 17.6839 6.44129 17.1213 5.87868C16.5587 5.31607 15.7956 5 15 5H13V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2C11.7348 2 11.4804 2.10536 11.2929 2.29289C11.1054 2.48043 11 2.73478 11 3V5H10C8.93913 5 7.92172 5.42143 7.17157 6.17157C6.42143 6.92172 6 7.93913 6 9C6 10.0609 6.42143 11.0783 7.17157 11.8284C7.92172 12.5786 8.93913 13 10 13H11V17H9C8.73478 17 8.48043 16.8946 8.29289 16.7071C8.10536 16.5196 8 16.2652 8 16C8 15.7348 7.89464 15.4804 7.70711 15.2929C7.51957 15.1054 7.26522 15 7 15C6.73478 15 6.48043 15.1054 6.29289 15.2929C6.10536 15.4804 6 15.7348 6 16C6 16.7956 6.31607 17.5587 6.87868 18.1213C7.44129 18.6839 8.20435 19 9 19H11V21C11 21.2652 11.1054 21.5196 11.2929 21.7071C11.4804 21.8946 11.7348 22 12 22C12.2652 22 12.5196 21.8946 12.7071 21.7071C12.8946 21.5196 13 21.2652 13 21V19H14C15.0609 19 16.0783 18.5786 16.8284 17.8284C17.5786 17.0783 18 16.0609 18 15C18 13.9391 17.5786 12.9217 16.8284 12.1716C16.0783 11.4214 15.0609 11 14 11ZM11 11H10C9.46957 11 8.96086 10.7893 8.58579 10.4142C8.21071 10.0391 8 9.53043 8 9C8 8.46957 8.21071 7.96086 8.58579 7.58579C8.96086 7.21071 9.46957 7 10 7H11V11ZM14 17H13V13H14C14.5304 13 15.0391 13.2107 15.4142 13.5858C15.7893 13.9609 16 14.4696 16 15C16 15.5304 15.7893 16.0391 15.4142 16.4142C15.0391 16.7893 14.5304 17 14 17Z" fill="#888CA0"/>
                  </svg>
                </div>
                <p class="w-aside__link-text">
                  Referrals
                </p>
                <a-icon class="w-aside__link-chevron" :name="Icon.MonoChevronRight" width="24" height="24" />
              </nuxt-link>
            </li>
            <li class="w-aside__item w-aside__item-mobile">
              <div
                class="w-aside__link"
              >
                <a-icon class="w-aside__link-img" :name="Icon.MonoTheme" width="24" height="24" />
                <p class="w-aside__link-text">
                  Dark Theme
                </p>
                <div class="w-aside__link-switch">
                  <a-switch
                    v-model.modelValue="themeValue"
                  />
                </div>
              </div>
            </li>
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
            <li class="w-aside__item w-aside__item-mobile">
              <nuxt-link
                class="w-aside__link"
                to="/bitcoin-education"
                active-class="w-aside__link--active"
                target="_blank"
                @click="onClickLink"
              >
                <a-icon class="w-aside__link-img" :name="Icon.MonoLearn" width="24" height="24" />
                <p class="w-aside__link-text">
                  Bitcoin education
                </p>
                <!-- FIX ICON -->
                <div class="w-aside__link-chevron">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8.82C15.7348 8.82 15.4804 8.92536 15.2929 9.11289C15.1054 9.30043 15 9.55478 15 9.82V17C15 17.2652 14.8946 17.5196 14.7071 17.7071C14.5196 17.8946 14.2652 18 14 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V6C2 5.73478 2.10536 5.48043 2.29289 5.29289C2.48043 5.10536 2.73478 5 3 5H10.18C10.4452 5 10.6996 4.89464 10.8871 4.70711C11.0746 4.51957 11.18 4.26522 11.18 4C11.18 3.73478 11.0746 3.48043 10.8871 3.29289C10.6996 3.10536 10.4452 3 10.18 3H3C2.20435 3 1.44129 3.31607 0.87868 3.87868C0.316071 4.44129 0 5.20435 0 6V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H14C14.7956 20 15.5587 19.6839 16.1213 19.1213C16.6839 18.5587 17 17.7956 17 17V9.82C17 9.55478 16.8946 9.30043 16.7071 9.11289C16.5196 8.92536 16.2652 8.82 16 8.82ZM19.92 0.62C19.8185 0.375651 19.6243 0.181475 19.38 0.0799999C19.2598 0.028759 19.1307 0.00157999 19 0H13C12.7348 0 12.4804 0.105357 12.2929 0.292893C12.1054 0.48043 12 0.734784 12 1C12 1.26522 12.1054 1.51957 12.2929 1.70711C12.4804 1.89464 12.7348 2 13 2H16.59L6.29 12.29C6.19627 12.383 6.12188 12.4936 6.07111 12.6154C6.02034 12.7373 5.9942 12.868 5.9942 13C5.9942 13.132 6.02034 13.2627 6.07111 13.3846C6.12188 13.5064 6.19627 13.617 6.29 13.71C6.38296 13.8037 6.49356 13.8781 6.61542 13.9289C6.73728 13.9797 6.86799 14.0058 7 14.0058C7.13201 14.0058 7.26272 13.9797 7.38458 13.9289C7.50644 13.8781 7.61704 13.8037 7.71 13.71L18 3.41V7C18 7.26522 18.1054 7.51957 18.2929 7.70711C18.4804 7.89464 18.7348 8 19 8C19.2652 8 19.5196 7.89464 19.7071 7.70711C19.8946 7.51957 20 7.26522 20 7V1C19.9984 0.869323 19.9712 0.740222 19.92 0.62Z" fill="#888CA0"/>
                  </svg>
                </div>
              </nuxt-link>
            </li>
            <li class="w-aside__item w-aside__item-mobile">
              <nuxt-link
                class="w-aside__link"
                to="/blog"
                active-class="w-aside__link--active"
                target="_blank"
                @click="onClickLink"
              >
                <a-icon class="w-aside__link-img" :name="Icon.MonoBlog" width="24" height="24" />
                <p class="w-aside__link-text">
                  News
                </p>
                <div class="w-aside__link-chevron">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8.82C15.7348 8.82 15.4804 8.92536 15.2929 9.11289C15.1054 9.30043 15 9.55478 15 9.82V17C15 17.2652 14.8946 17.5196 14.7071 17.7071C14.5196 17.8946 14.2652 18 14 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V6C2 5.73478 2.10536 5.48043 2.29289 5.29289C2.48043 5.10536 2.73478 5 3 5H10.18C10.4452 5 10.6996 4.89464 10.8871 4.70711C11.0746 4.51957 11.18 4.26522 11.18 4C11.18 3.73478 11.0746 3.48043 10.8871 3.29289C10.6996 3.10536 10.4452 3 10.18 3H3C2.20435 3 1.44129 3.31607 0.87868 3.87868C0.316071 4.44129 0 5.20435 0 6V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H14C14.7956 20 15.5587 19.6839 16.1213 19.1213C16.6839 18.5587 17 17.7956 17 17V9.82C17 9.55478 16.8946 9.30043 16.7071 9.11289C16.5196 8.92536 16.2652 8.82 16 8.82ZM19.92 0.62C19.8185 0.375651 19.6243 0.181475 19.38 0.0799999C19.2598 0.028759 19.1307 0.00157999 19 0H13C12.7348 0 12.4804 0.105357 12.2929 0.292893C12.1054 0.48043 12 0.734784 12 1C12 1.26522 12.1054 1.51957 12.2929 1.70711C12.4804 1.89464 12.7348 2 13 2H16.59L6.29 12.29C6.19627 12.383 6.12188 12.4936 6.07111 12.6154C6.02034 12.7373 5.9942 12.868 5.9942 13C5.9942 13.132 6.02034 13.2627 6.07111 13.3846C6.12188 13.5064 6.19627 13.617 6.29 13.71C6.38296 13.8037 6.49356 13.8781 6.61542 13.9289C6.73728 13.9797 6.86799 14.0058 7 14.0058C7.13201 14.0058 7.26272 13.9797 7.38458 13.9289C7.50644 13.8781 7.61704 13.8037 7.71 13.71L18 3.41V7C18 7.26522 18.1054 7.51957 18.2929 7.70711C18.4804 7.89464 18.7348 8 19 8C19.2652 8 19.5196 7.89464 19.7071 7.70711C19.8946 7.51957 20 7.26522 20 7V1C19.9984 0.869323 19.9712 0.740222 19.92 0.62Z" fill="#888CA0"/>
                  </svg>
                </div>
              </nuxt-link>
            </li>
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
import WCertificate from '~/src/widgets/w-certificate/w-certificate.vue';
import ASwitch from '~/src/shared/ui/atoms/a-switch/a-switch.vue'

const { $app } = useNuxtApp()

withDefaults(
  defineProps<{
    isPage: boolean
  }>(),
  {
    isPage: false,
  },
)

const userType = computed<'btc' | 'usdt' | 'init_btc'>(() => $app.store.user?.info?.account?.order_type ?? 'init_btc');

const isUserAuthenticated = computed(() => {
  return $app.store.auth.isUserAuthenticated
})

const { isLaptop, isDesktop, isMobile, isTablet } = useMediaDevice()
const route = useRoute()

const isOpenModalCredit = ref(false)
const isOpenModalCreditSuccess = ref(false)
const isOpenModalRefer = ref(false)

const cardCount = ref(0)

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
    title: 'Fund',
    icon: Icon.MonoAnalytics,
    link: 'personal-fund',
    subNav: [
      {
        title: 'Portfolio',
        icon: Icon.MonoEarnings,
        link: 'personal-portfolio',
      },
      {
        title: 'Protection',
        icon: Icon.MonoEarnings,
        link: 'personal-protection',
      },
      {
        title: 'Shareholders',
        icon: Icon.MonoEarnings,
        link: 'personal-shareholders',
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
    title: 'Apply for credit card',
    icon: Icon.MonoCreditCard,
    type: 'button',
    callback: openModalCredit,
  },
  {
    title: 'Statement',
    icon: Icon.MonoFile,
    link: '/personal/earnings/statements',
  },
  {
    title: 'Purchase agreement',
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
    case 'personal-protection':
      return (
        route.name === 'personal-protection' || route.name === 'personal-portfolio' || route.name === 'personal-shareholders'
      )
    case 'personal-dividends':
      return (
        route.name === 'personal-dividends' || route.name === 'personal-referrals' 
      )
    case 'personal-more':
      return route.name?.includes('personal-more')

    default:
      return false
  }
}

const themeValue = ref<boolean>($app.store.user.theme === 'dark');

watch(() => themeValue.value, (value) => {
  const theme = value ? 'dark' : 'light';

  localStorage.setItem('theme', theme);
  document.body.dataset.theme = theme;
  $app.store.user.theme = theme;
});
</script>

<style src="./w-aside.scss" lang="scss" />
