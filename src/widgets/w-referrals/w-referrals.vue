<template>
  <div class="w-referrals">
    <div class="w-referrals__wrap">

      <div class="w-referrals__amount">
        <div class="w-referrals__amount-sum">
          <div class="w-referrals__amount-title">Referral Balance</div>
          <div class="w-referrals__amount-text">${{ $app.filters.roundedFixed2(walletReferrals.usd_amount, 2) }}</div>
        </div>
        <a-button
          class="w-referrals__amount-withdraw"
          variant="secondary"
          text="Add Withdrawal Method"
          :disabled="!walletReferrals?.usd_amount"
          :icon="Icon.MonoPlus"
          @click="openModal"
        />
        <div class="w-referrals__amount-totalsum">
          <div class="w-referrals__amount-caption">
            <div class="w-referrals__amount-share">
              <a-icon width="14" height="14" :name="Icon.MonoInfo" />
            </div>
            <a-live class="w-referrals__amount-live"/>
          </div>

          <div>
            <div class="w-referrals__amount-name">
              TOTAL REFERRALS EARNED
            </div>
            <div class="w-referrals__amount-price">
              $0
            </div>
          </div>

          <a-dropdown
            @get-current-option="(option : ADropdownOption) => totalSumCurrentOption = option"
          />
        </div>
      </div>

      <div class="w-referrals__subtitle">Transactions</div>

      <div v-if="personalReferrals.length" class="w-referrals__list">
        <transition-group name="fade" tag="div">
          <div v-for="item in personalReferrals" :key="item?.uuid" class="w-referrals__item">
            <div class="w-referrals__item-pic" :class="['w-referrals__item-pic', { 'w-referrals__item-pic--minus': item.type !== 'debit_to_client' }]">
              <a-icon width="18" height="18" :name="item.type === 'debit_to_client' ? Icon.MonoPlus : Icon.MonoMinus"
              />
            </div>
            <div class="w-referrals__item_info">
              <div class="w-referrals__item_info-title">Referral</div>
              <div class="w-referrals__item_info-date">
                {{ $app.filters.dayjs(item?.created_at)?.format('D MMMM YY HH:mm:ss') }}
              </div>
            </div>
            <div v-if="item.status === 'pending'" class="w-referrals__item_sums">Pending</div>
            <div v-else class="w-referrals__item_sums">
              <div class="w-referrals__item_info-usd">{{item.type === 'debit_to_client' ? '+' : '-'}} ${{ $app.filters.rounded(item?.usd_amount, 2) }}</div>
            </div>
          </div>
        </transition-group>
      </div>

      <div v-if="personalReferrals.length && hasNextPage" class="w-referrals__more">
        <div @click="loadMoreReferrals" class="w-referrals__more-text">Load more</div>
      </div>

      <div v-if="!personalReferrals.length" class="w-referrals__empty">
        <img v-if="$app.store.user.theme === 'light'" class="w-referrals__empty-pic" src="/img/cloud.png" alt="empty" />
        <img v-else class="w-referrals__empty-pic" src="/img/cloud-dark.png" alt="empty" />
        <div class="w-referrals__empty-title">You don’t have any transactions yet.</div>
        <div class="w-referrals__empty-text">
          Start inviting your friends to earn referral bonuses!
        </div>
      </div>

      <div class="w-referrals__share">
        <div class="w-referrals__share-heading">
          Share Your Referral Link
        </div>

        <div class="w-referrals__share-socials">
          <button
            class="w-referrals__share-social"
            :class="{ current: shareCurrentName === network.name }"
            v-for="network in shareSocials"
            :key="network.name"
            @click="shareCurrentName = network.name"
          >
            <a-icon class="w-referrals__share-icon" width="20" height="20" :name="network.icon" />
          </button>
        </div>

        <m-slider
          class="w-referrals__promo"
          id="w-referrals__promo-slider"
          :modules="[Pagination, Navigation]"
          loop
          :space-between="10"
          slides-per-view="auto"
          :mousewheel="false"
          :looped-slides="1"
          centeredSlides
          :navigation="true"
          :pagination="true"
          @slide-change="console.log"
        >
          <template #slides>
            <swiper-slide class='w-referrals__promo-item'>
              <img class="w-referrals__promo-img" src="/img/referrals/promo1.png" alt="promo" />
            </swiper-slide>
            <swiper-slide class='w-referrals__promo-item'>
              <img class="w-referrals__promo-img" src="/img/referrals/promo2.png" alt="promo" />
            </swiper-slide>
            <swiper-slide class='w-referrals__promo-item'>
              <img class="w-referrals__promo-img" src="/img/referrals/promo3.png" alt="promo" />
            </swiper-slide>
          </template>
        </m-slider>

        <div class="w-referrals__comment">
          <div class="w-referrals__comment-caption">
            COMMENT
          </div>
          <div class="w-referrals__comment-text">
            {{ shareData.text }}
          </div>
        </div>

        <button class="w-referrals__share-button" @click="share">
          Share on {{ shareCurrentSocial.name }}
        </button>
      </div>

      <div class="w-referrals__instructions">
        <div class="w-referrals__instructions-heading">
          Invite your friends
        </div>

        <ul class="w-referrals__instructions-list">
          <li class="w-referrals__instructions-item">
            <span class="w-referrals__instructions-number">
              1
            </span>
            <p class="w-referrals__instructions-text">
              You share your referral link with friends in any way you like.
            </p>
          </li>
          <li class="w-referrals__instructions-item">
            <span class="w-referrals__instructions-number">
              2
            </span>
            <p class="w-referrals__instructions-text">
              Friends purchase ETF Shares with your referral code.
            </p>
          </li>
          <li class="w-referrals__instructions-item">
            <span class="w-referrals__instructions-number">
              3
            </span>
            <p class="w-referrals__instructions-text">
              You get 5% of what they buy, always. They get better rates too!
            </p>
          </li>
        </ul>
      </div>

      <ul class="w-referrals__stats">
        <li class="w-referrals__stat">
          <div class="w-referrals__stat-heading">
            Total referrals earned
          </div>
          <div class="w-referrals__stat-value">
            $547
          </div>
          <img src="/img/referrals/earn.png" class="w-referrals__stat-img" />
        </li>
        <li class="w-referrals__stat">
          <div class="w-referrals__stat-heading">
            Total referrals earned
          </div>
          <div class="w-referrals__stat-value">
            148
          </div>
          <img src="/img/referrals/invited.png" class="w-referrals__stat-img" />
        </li>
        <li class="w-referrals__stat">
          <div class="w-referrals__stat-heading">
            Total referrals earned
          </div>
          <div class="w-referrals__stat-value">
            58
          </div>
          <img src="/img/referrals/accepted.png" class="w-referrals__stat-img" />
        </li>
      </ul>
    </div>
  </div>
  <e-referral-share-modal v-model="isOpenShareModal" />
  <f-referrals-modal :address="address" :method="method" v-model="isOpenModal" @accept="setMethod" />
  <w-onboarding :steps="renderedSteps" next-route-name="personal-bonus" />
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue';
import ALive from '~/src/shared/ui/atoms/a-live/a-live.vue';
import ADropdown from '~/src/shared/ui/atoms/a-dropdown/a-dropdown.vue';
import { Icon } from '~/src/shared/constants/icons';
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue';
import FReferralsModal from '~/src/features/f-referrals-modal/f-referrals-modal.vue';
import EReferralShareModal from '~/src/entities/e-referral-share-modal/e-referral-share-modal.vue';
import { Centrifuge } from 'centrifuge';
import { onUnmounted } from 'vue';
import WOnboarding from '~/src/widgets/w-onboarding/w-onboarding.vue';
import { useNuxtApp } from '#app';
import { ADropdownOption } from '~/src/shared/types/global';
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue';
import { SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper';

const isOpenModal = ref(false)
const isOpenShareModal = ref(false)

const { $app } = useNuxtApp();

const checkKyc = async () => {
  return await $app.api.eth.kyc.getForms().then((formsResponse: any) => {
    return formsResponse.data[0].status === 'passed'
  })
}
const openModal = async () => {
  const isKycFinished = await checkKyc()

  if (isKycFinished) {
    isOpenModal.value = true
  } else {
    navigateTo({ name: 'personal-kyc' })
  }
}

const route = useRoute();


const totalSumCurrentOption = ref<ADropdownOption | null>(null);


const shareData = {
  text: 'Sign up with my link buy Bitcoin ETFs and start earning daily dividends today: choose to earn USDT or BTC!',
  hashtags: '#BitcoinETF #Bitcoin #ETF #Tether',
  url: 'bitcoinetf.org'
};
const shareSocials = [
  {
    network: `https://twitter.com/intent/tweet?text=${shareData.text}&url=${shareData.url}`,
    name: 'X',
    icon: Icon.MonoX
  },
  {
    network: `https://t.me/share/url?url=${shareData.url}&text=${shareData.text}`,
    name: 'Telegram',
    icon: Icon.MonoTelegram
  },
  {
    network: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}&title=${shareData.text}`,
    name: 'Facebook',
    icon: Icon.MonoFacebook
  },
  {
    network: `https://vk.com/share.php?url=${shareData.url}&title=${shareData.text}&noparse=true`,
    name: 'VK',
    icon: Icon.MonoVk
  },
  {
    network: `mailto:?subject=BitcoinETF&body=${shareData.url}%0D%0A${shareData.text}`,
    name: 'Email',
    icon: Icon.MonoMailLight
  },
  {
    network: `sms:?body=${shareData.text}%0D%0A${shareData.url}`,
    name: 'SMS',
    icon: Icon.MonoMessage
  },
];

const shareCurrentName= ref<string>(shareSocials[0].name);
const shareCurrentSocial = computed(() => shareSocials.find((social) => social.name === shareCurrentName.value) ?? shareSocials[0]);

const share = () => {
  window.open(shareCurrentSocial.value.network, '_blank');
}

const openShareModal = () => {
  isOpenShareModal.value = true
}
const centrifuge = ref(null)

const walletReferrals = ref([])
const personalReferrals = ref([])
const currentPage = ref(1)
const hasNextPage = ref(true)
const transactionsKey = ref(0)

const method = ref('')
const address = ref('')
const setMethodError = ref('');
const setMethod = () => {
  setTimeout(async ()=>{
    await getWalletReferrals()
  }, 2000)
}

const typeWorkMethod = computed(() => {
  return 'Manual'
})

const typeMethodIcon = computed(() => {
  return method.value === 'tron' ? Icon.ColorfulTron : Icon.ColorfulUsdant
})

const typeMethodText = computed(() => {
  return method.value === 'tron' ? 'Tron' : 'USDANT'
})

const selectedAddressShort = computed(() => {
  if (!address.value) return ''
  if (address.value?.length <= 5) return address.value
  return address.value.slice(0, 5) + '...' + address.value.slice(address.value.length - 4)
})

const getWalletReferrals = async () => {
  await $app.api.eth.billingEth
    .getWallet({ type: 'referral' })
    .then((response: any) => {
      walletReferrals.value = response.data
      $app.store.user.walletReferral = response.data
      address.value = response.data?.withdrawal_address || ''
      method.value = 'tron'
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const getPersonalReferrals = async (initial) => {
  if (initial) {
    currentPage.value = 1
  }
  await $app.api.eth.billingEth
    .getTransactions({
      page: currentPage.value,
      per_page: 4,
      type: 'referral',
    })
    .then((response: any) => {
      if (initial) {
        personalReferrals.value = []
      }
      hasNextPage.value = !!response.data.next_page_url
      personalReferrals.value = [...personalReferrals.value, ...response.data.data]

      transactionsKey.value += 1
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const withdrawalReferrals = async () => {
  $app.api.eth.billingEth
    .withdrawalReferrals()
    .then(() => {
      getWalletReferrals()
    })
    .catch((e) => {
      console.error(e.errors)
    })
}

const loadMoreReferrals = async () => {
  currentPage.value += 1
  await getPersonalReferrals()
}
const config = useRuntimeConfig()
const centrifugeURL = config.public.WS_URL
const centrifugeToken = config.public.WS_TOKEN

onMounted(async () => {
  await getWalletReferrals()
  await getPersonalReferrals()

  centrifuge.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })

  centrifuge.value.connect()

  const sub = centrifuge.value.newSubscription(`wallet.${$app.store.user.info?.account?.uuid}`)

  sub
    .on('publication', async function (ctx) {
      if (ctx.data.message.status === 'success') {
        await getPersonalReferrals(true)
      } else if (ctx.data.message.status === 'pending') {
        personalReferrals.value = [ctx.data.message, ...personalReferrals.value]
      }
    })
    .subscribe()
})

onUnmounted(() => {
  centrifuge.value?.disconnect()
})

// Onboarding
const { width } = useWindowSize()

const steps = computed(() => {
  return [
    {
      attachTo: { element: width.value < 1024 ? '#personal-referrals-tab-mobile' : '#personal-referrals-tab' },
      content: {
        title: 'Referral Wallet',
        description:
          'Earn here when friends join BitcoinETF.org through your referral. Withdraw or reinvest to amplify your Dividends.',
      },
      options: {
        overlay: {
          padding: 16,
          borderRadius: 16,
        },
      },
      on: {
        beforeStep: async function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.add('onboarding-index')
        },
        afterStep: function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.remove('onboarding-index')
        },
      },
    },
  ]
})

const renderedSteps = computed(() => {
  return steps.value.filter((step) => step.isRender !== false)
})
</script>

<style src="./w-referrals.scss" lang="scss" />
