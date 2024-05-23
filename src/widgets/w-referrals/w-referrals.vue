<template>
  <div class="w-referrals">
    <div class="w-referrals__wrap">
      <div class="w-referrals__amount">
        <div class="w-referrals__amount-sum">
          <div class="w-referrals__amount-title">Referral Balance</div>
          <div class="w-referrals__amount-text">${{ $app.filters.roundedFixed2(walletReferrals.usd_amount, 2) }}</div>
        </div>
        <a-button
          v-if="!address"
          class="w-referrals__amount-withdraw"
          variant="secondary"
          text="Add Withdrawal Method"
          :disabled="!walletReferrals?.usd_amount"
          :icon="Icon.MonoPlus"
          @click="openModal"
        />

        <div v-else class="w-referrals__cards-item w-referrals__cards-item-withdraw">
          <div class="w-referrals__cards-header">
            <a-icon width="24" height="24" class="w-referrals__cards-icon-method" :name="typeMethodIcon" />
            <a-icon
              width="18"
              height="18"
              class="w-referrals__cards-icon-edit"
              :name="Icon.MonoActionEdit"
              @click="openModal"
            />
          </div>
          <div class="w-referrals__cards-body">
            <div class="w-referrals__cards-subtitle">WITHDRAW TO:</div>
            <div class="w-referrals__cards-title-second">
              {{ address }}
            </div>
          </div>
          <div class="w-referrals__cards-footer">
            <div class="w-referrals__cards-text">Withdrawals will be made automatically daily</div>
          </div>
        </div>

        <div class="w-referrals__amount-totalsum">
          <div class="w-referrals__amount-caption">
            <div class="w-referrals__amount-share">
              <a-icon width="14" height="14" :name="Icon.MonoActionShareSocial" />
            </div>
            <a-live class="w-referrals__amount-live" />
          </div>

          <div>
            <div class="w-referrals__amount-name">TOTAL REFERRALS EARNED</div>
            <div class="w-referrals__amount-price">
              ${{ $app.filters.roundedFixed2(personalReferralStats?.sum_referrals, 2) || 0 }}
            </div>
          </div>

          <m-dropdown :options="timeOptions" />
        </div>
      </div>

      <div v-if="isLoadingRefferals">
        <div class="w-referrals__subtitle">Transactions</div>
        <div v-if="personalReferrals.length" class="w-referrals__list">
          <transition-group name="fade" tag="div">
            <div v-for="item in personalReferrals" :key="item?.uuid" class="w-referrals__item">
              <div
                class="w-referrals__item-pic"
                :class="['w-referrals__item-pic', { 'w-referrals__item-pic--minus': item.type !== 'debit_to_client' }]"
              >
                <a-icon
                  width="18"
                  height="18"
                  :name="item.type === 'debit_to_client' ? Icon.MonoPlus : Icon.MonoMinus"
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
                <div class="w-referrals__item_info-usd">
                  {{ item.type === 'debit_to_client' ? '+' : '-' }} ${{ $app.filters.rounded(item?.usd_amount, 2) }}
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <div v-if="personalReferrals.length && hasNextPage" class="w-referrals__more">
          <div @click="loadMoreReferrals" class="w-referrals__more-text">Load more</div>
        </div>

        <div v-if="!personalReferrals.length" class="w-referrals__empty">
          <img
            v-if="$app.store.user.theme === 'light'"
            class="w-referrals__empty-pic"
            src="/img/cloud.png"
            alt="empty"
          />
          <img v-else class="w-referrals__empty-pic" src="/img/cloud-dark.png" alt="empty" />
          <div class="w-referrals__empty-title">You don’t have any transactions yet.</div>
          <div class="w-referrals__empty-text">Start inviting your friends to earn referral bonuses!</div>
        </div>
      </div>

      <ul class="w-referrals__stats w-referrals__stats--desktop">
        <li class="w-referrals__stat">
          <div class="w-referrals__stat-heading">Total referrals earned</div>
          <div class="w-referrals__stat-value">
            ${{ $app.filters.roundedFixed2(totalReferralStats?.sum_referrals, 2) || 0 }}
          </div>
          <img src="/img/referrals/earn.png" class="w-referrals__stat-img" />
        </li>
        <li class="w-referrals__stat">
          <div class="w-referrals__stat-heading">Invited investors</div>
          <div class="w-referrals__stat-value">{{ totalReferralStats?.invited_investors || 0 }}</div>
          <img src="/img/referrals/invited.png" class="w-referrals__stat-img" />
        </li>
        <li class="w-referrals__stat">
          <div class="w-referrals__stat-heading">Accepted invitations</div>
          <div class="w-referrals__stat-value">{{ totalReferralStats?.accepted_invitation || 0 }}</div>
          <img src="/img/referrals/accepted.png" class="w-referrals__stat-img" />
        </li>
      </ul>

      <div class="w-referrals__box">
        <div class="w-referrals__share">
          <div class="w-referrals__share-heading">Share Your Referral Link</div>

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
            @get-real-index="getRealIndex"
          >
            <template #slides>
              <swiper-slide class="w-referrals__promo-item" v-for="card in referralPromoCards" :key="card.name">
                <w-referral-promo-card :data="card" />
              </swiper-slide>
            </template>
          </m-slider>

          <div class="w-referrals__comment">
            <div class="w-referrals__comment-caption">COMMENT</div>
            <div class="w-referrals__comment-text">
              {{ shareData.description }}
            </div>
          </div>

          <button :disabled="!mobileDetector && shareCurrentSocial.name === 'SMS'" class="w-referrals__share-button" @click="share">Share on {{ shareCurrentSocial.name }}</button>
        </div>

        <div class="w-referrals__instructions">
          <div class="w-referrals__instructions-heading">Invite your friends</div>

          <ul class="w-referrals__instructions-list">
            <li class="w-referrals__instructions-item">
              <span class="w-referrals__instructions-number"> 1 </span>
              <p class="w-referrals__instructions-text">
                You share your referral link with friends in any way you like.
              </p>
            </li>
            <li class="w-referrals__instructions-item">
              <span class="w-referrals__instructions-number"> 2 </span>
              <p class="w-referrals__instructions-text">Friends purchase ETF Shares with your referral code.</p>
            </li>
            <li class="w-referrals__instructions-item">
              <span class="w-referrals__instructions-number"> 3 </span>
              <p class="w-referrals__instructions-text">
                You get 5% of what they buy, always. They get better rates too!
              </p>
            </li>
          </ul>
        </div>
      </div>

      <ul class="w-referrals__stats w-referrals__stats--mobile">
        <li class="w-referrals__stat">
          <div class="w-referrals__stat-heading">Total referrals earned</div>
          <div class="w-referrals__stat-value">
            ${{ $app.filters.roundedFixed2(personalReferralStats?.sum_referrals, 2) || 0 }}
          </div>
          <img src="/img/referrals/earn.png" class="w-referrals__stat-img" />
        </li>
        <li class="w-referrals__stat">
          <div class="w-referrals__stat-heading">Invited investors</div>
          <div class="w-referrals__stat-value">{{ totalReferralStats?.invited_investors || 0 }}</div>
          <img src="/img/referrals/invited.png" class="w-referrals__stat-img" />
        </li>
        <li class="w-referrals__stat">
          <div class="w-referrals__stat-heading">Accepted invitations</div>
          <div class="w-referrals__stat-value">{{ totalReferralStats?.accepted_invitation || 0 }}</div>
          <img src="/img/referrals/accepted.png" class="w-referrals__stat-img" />
        </li>
      </ul>
    </div>
  </div>
  <e-referral-share-modal v-model="isOpenShareModal" />
  <f-referrals-modal :address="address" :method="method" v-model="isOpenModal" @accept="setMethod" />
  <w-onboarding :steps="renderedSteps" next-route-name="personal-bonus" v-if="false" />
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import ALive from '~/src/shared/ui/atoms/a-live/a-live.vue'
import ADropdown from '~/src/shared/ui/atoms/a-dropdown/a-dropdown.vue'
import { Icon } from '~/src/shared/constants/icons'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import FReferralsModal from '~/src/features/f-referrals-modal/f-referrals-modal.vue'
import EReferralShareModal from '~/src/entities/e-referral-share-modal/e-referral-share-modal.vue'
import { Centrifuge } from 'centrifuge'
import { onUnmounted } from 'vue'
import WOnboarding from '~/src/widgets/w-onboarding/w-onboarding.vue'
import { useNuxtApp } from '#app'
import { ADropdownOption, TPromoCardDetails } from '~/src/shared/types/global'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'
//@ts-ignore
import { Pagination, Navigation } from 'swiper'
import WReferralPromoCard from '~/src/widgets/w-referral-promo-card/w-referral-promo-card.vue'
import mDropdown from '~/src/shared/ui/molecules/m-dropdown/m-dropdown.vue'
import { user } from '~/src/app/store/user'

interface ISetMethodBody {
  address: string
  method: string
}

const userStore = user()

const isOpenModal = ref(false)
const isOpenShareModal = ref(false)

const { $app } = useNuxtApp()

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

const route = useRoute()

const totalSumCurrentOption = ref<ADropdownOption | null>(null)

const shareData = reactive({
  text: 'Sign up with my link buy Bitcoin ETFs and start earning daily dividends today: choose to earn USDT or BTC!',
  hashtags: '#BitcoinETF #Bitcoin #ETF #Tether',
  url: 'bitcoinetf.org/personal/registration',
  description: 'Bitcoin ETF that pays dividends: choose to earn USDT or BTC',
})

const shareSocials = [
  {
    name: 'X',
    icon: Icon.MonoX,
  },
  {
    name: 'Telegram',
    icon: Icon.MonoTelegram,
  },
  {
    name: 'Facebook',
    icon: Icon.MonoFacebook,
  },
  {
    name: 'VK',
    icon: Icon.MonoVk,
  },
  {
    name: 'Email',
    icon: Icon.MonoMailLight,
  },
  {
    name: 'SMS',
    icon: Icon.MonoMessage,
  },
]

const availableNetworks = {
  email: 'mailto:?subject=@t&body=@u%0D%0A@d',
  facebook: 'https://www.facebook.com/sharer/sharer.php?u=@u&title=@t&description=@d&quote=@q&hashtag=@h',
  sms: 'sms:?body=@t%0D%0A@u%0D%0A@d',
  telegram: 'https://t.me/share/url?url=@u&text=@t%0D%0A@d',
  x: 'https://twitter.com/intent/tweet?text=@t&url=@u&hashtags=@h@tu',
  vk: 'https://vk.com/share.php?url=@u&title=@t&description=@d&image=@m&noparse=true',
}

const personalReferralStats = ref<any>(null)
const totalReferralStats = ref<any>(null)
const shareCurrentName = ref<string>(shareSocials[0].name)

//@ts-ignore
const referralCode = computed(() => userStore.info?.referrals?.code)

const referralLink = computed(() =>
  referralCode.value
    ? window.location.origin + '/personal/registration' + `?referral=${referralCode.value}`
    : window.location.origin + '/personal/registration',
)

const shareCurrentSocial = computed(
  () => shareSocials.find((social) => social.name === shareCurrentName.value) ?? shareSocials[0],
)
const rawLink = computed(() => {
  const ua = navigator.userAgent.toLowerCase()
  const key = shareCurrentSocial.value.name.toLowerCase()

  if (key === 'sms' && (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1)) {
    return availableNetworks[key].replace(':?', ':&')
  }

  //@ts-ignore
  return availableNetworks[key]
})

const shareLink = computed(() => {
  let link = rawLink.value
  const key = shareCurrentSocial.value.name.toLowerCase()

  if (key === 'x') {
    link = link.replace('&hashtags=@h', 'shareData.hashtags')
    link = link.replace('@tu', '')
  }

  return link
    .replace(/@tu/g, '&via=' + encodeURIComponent(''))
    .replace(/@u/g, encodeURIComponent(referralLink.value))
    .replace(/@t/g, encodeURIComponent(shareData.text))
    .replace(/@d/g, encodeURIComponent(shareData.description))
    .replace(/@q/g, encodeURIComponent(''))
    .replace(/@h/g, shareData.hashtags)
    .replace(/@m/g, encodeURIComponent(''))
})

const opendSharedViaSocial = () => {
  window.open(shareLink.value, '_blank')
}

const share = async () => {
  opendSharedViaSocial()
}

const openShareModal = () => {
  isOpenShareModal.value = true
}
const centrifuge = ref<Centrifuge | null>(null)

const walletReferrals = ref<any>([])
const personalReferrals = ref<any>([])
const isLoadingRefferals = ref<boolean>(false)
const currentPage = ref(1)
const hasNextPage = ref(true)
const transactionsKey = ref(0)

const method = ref('')
const address = ref('')
const setMethodError = ref('')

const setMethod = async (payload: ISetMethodBody) => {
  const { method, address } = payload
  await $app.api.info.billing
    .setWithdrawalMethod({
      address,
      method,
      walletType: 'referral',
    })
    .then(async () => {
      await getWalletReferrals()
    })
    // @ts-ignore
    .catch((e) => {
      if (e?.errors?.error?.message) {
        setMethodError.value = e.errors.error.message
      } else {
        setMethodError.value = 'Something went wrong'
      }
    })
}

const typeMethodIcon = computed(() => Icon.ColorfulUsdtPolygon)

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
      method.value = 'polygon_usdt'
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const getPersonalReferrals = async (initial: boolean = false): Promise<void> => {
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
    .finally(() => {
      if (initial) {
        isLoadingRefferals.value = true
      }
    })
}

const getPersonalReferralsStats = async (time: any = '') => {
  const filterObj: Record<string, any> = {}

  if (time !== 'all') {
    filterObj.days = time
  }

  const { data } = await $app.api.eth.statisticEth.getPersonalStatsReferrals({ filters: filterObj })
  personalReferralStats.value = data

  if (!time || time === 'all') {
    totalReferralStats.value = data
  }
}

const loadMoreReferrals = async () => {
  currentPage.value += 1
  await getPersonalReferrals()
}
const config = useRuntimeConfig()
const centrifugeURL = config.public.WS_URL
const centrifugeToken = config.public.WS_TOKEN

const timeOptions = [
  { value: 'All time', callback: () => getPersonalReferralsStats('all') },
  { value: '1 year', callback: () => getPersonalReferralsStats(365) },
  { value: '6 months', callback: () => getPersonalReferralsStats(180) },
  { value: '3 months', callback: () => getPersonalReferralsStats(90) },
  { value: '1 month', callback: () => getPersonalReferralsStats(30) },
  { value: '1 week', callback: () => getPersonalReferralsStats(7) },
  { value: '7 days', callback: () => getPersonalReferralsStats(7) },
  { value: '24 hours', callback: () => getPersonalReferralsStats(1) },
]

onMounted(async () => {
  await getWalletReferrals()
  await getPersonalReferrals(true)

  getPersonalReferralsStats()

  centrifuge.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken,
  })

  centrifuge.value.connect()

  const sub = centrifuge.value.newSubscription(`wallet.${$app.store.user.info?.account?.uuid}`)

  sub
    .on('publication', async function (ctx) {
      if (ctx.data.message.status === 'success') {
        await getPersonalReferrals(true)
      } else if (ctx.data.message.status === 'pending') {
        personalReferrals.value = [ctx?.data?.message, ...personalReferrals.value]
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
        beforeStep: async function (options: any) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.add('onboarding-index')
        },
        afterStep: function (options: any) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.remove('onboarding-index')
        },
      },
    },
  ]
})

const renderedSteps = computed((): any => {
  return steps
})

const referralPromoCards: TPromoCardDetails[] = [
  {
    name: 'brand',
    title: 'Passive Income for Smart Investors',
    description: 'Bitcoin ETF that pays dividends: choose to earn USDT or BTC',
  },
  {
    name: 'tether',
    title: 'Passive Income for Smart Investors',
    description: 'Bitcoin ETF that pays daily dividends in USDT Tether.',
  },
  {
    name: 'bitcoin',
    title: 'Passive Income for Smart Investors',
    description: 'Bitcoin ETF that pays daily dividends in Bitcoin.',
  },
]

function getRealIndex(swipe: number) {
  shareData.description = referralPromoCards[swipe].description
}

const mobileDetector = computed(() => {
  let check = false
  ;(function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4),
      )
    )
      check = true
  })(navigator.userAgent || navigator.vendor)
  return check
})

</script>

<style src="./w-referrals.scss" lang="scss" />
