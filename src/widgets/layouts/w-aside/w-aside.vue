<template>
  <transition>
    <aside ref="asideRef" :class="['w-aside', { 'w-aside--page': isPage }]">
      <div class="w-aside__inner">
        <div class="w-aside__profile">
          <div class="w-aside__avatar">
            <a-avatar size="64px" photo-src="/img/avatar.png" :robot-data="$app.store.user?.info?.account?.uuid" class="w-aside__avatar-pic" />
            <div v-if="$app.store.user?.info?.profile?.full_name" class="w-aside__avatar-title">
              {{ $app.store.user?.info?.profile?.full_name }}
            </div>
            <div class="w-aside__avatar-subtitle">@{{ $app.store.user?.info?.account?.username }}</div>

          </div>

          <w-certificate
            :type="$app.store.user?.info?.account?.order_type"
            :username="$app.store.user?.info?.profile?.full_name"
            shares="1000"
            time="1094"
          />
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
import { useNuxtApp } from '#app'
import EApplyCreditCardModal from '~/src/entities/e-apply-credit-card-modal/e-apply-credit-card-modal.vue'
import EApplyCreditSuccessModal from '~/src/entities/e-apply-credit-success-modal/e-apply-credit-success-modal.vue'
import FReferFriends from '~/src/features/f-refer-friends/f-refer-friends.vue'
import { ref } from 'vue'
import FTermsModal from '~/src/features/f-terms-modal/f-terms-modal.vue'
import WCertificate from '~/src/widgets/w-certificate/w-certificate.vue';

withDefaults(
  defineProps<{
    isPage: boolean
  }>(),
  {
    isPage: false,
  },
)

const { $app } = useNuxtApp();

const isUserAuthenticated = computed(() => {
  return $app.store.auth.isUserAuthenticated;
})

const isOpenModalCredit = ref(false);
const isOpenModalCreditSuccess = ref(false);
const isOpenModalRefer = ref(false);

const cardCount = ref(0);

const isHiddenTerms = computed(() => {
  return !$app.store.user.lastPayment;
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
    });
}

const requestCreditCard = async () => {
  await $app.api.eth.billingEth
    .requestCreditCard()
    .then((response) => {
      cardCount.value = response.data.number
      isOpenModalCreditSuccess.value = true
    })
    .catch(() => {
      // Todo: notify something went wrond
    });
}

const openModalCredit = async () => {
  await checkCardRequest();
}

const acceptCreditCard = async () => {
  await requestCreditCard();
}

const isOpenTermsModal = ref(false);

const openTermsModal = () => {
  isOpenTermsModal.value = true;
}

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

const asideRef = ref(null);

const emit = defineEmits(['click-link', 'click-outside']);

const onClickLink = () => {
  emit('click-link');
}

const logout = () => {
  $app.store.auth.logout();
}
</script>

<style src="./w-aside.scss" lang="scss" />
