<template>
  <section class="s-site-guarantees" :data-name="'Guarantees'">
    <div class="s-site-guarantees__wrapper-title">
      <h2 class="s-site-guarantees__title for-desktop title-site-h1">
        TRIPLE PROTECTION <br />
        <span>GUARANTEE</span>
      </h2>
      <h2 class="s-site-guarantees__title for-mobile title-site-h1">
        PROTECTION <br />
        <span>VAULT</span>
      </h2>
    </div>

    <div class="s-site-guarantees__main-section">
      <div class="s-site-guarantees__card-wrapper">
        <m-guarantees-card
          :label="'Protection 1'"
          title="BTC Reserve Fund"
          :cost="`${$app.filters.rounded(fundTotalBtc, 2)} BTC`"
          body="The reserve fund serves as a safety net, absorbing losses and maintaining liquidity during times of market turmoil. By diversifying our holdings into Bitcoin, we can weather unexpected events and continue delivering steady returns to our investors."
          :currentBalance="true"
          textButton="Verify on Blockchain"
          @click="goToRegistration"
        />
      </div>
      <div class="s-site-guarantees__card-wrapper">
        <m-guarantees-card
          label="Protection 2"
          title="USDT Protection Vault"
          :cost="`$${$app.filters.rounded(fundTotalUsd, 0)}`"
          body="Every time our bot makes a profit from these hedging operations the profit is deposited into the Protection Vault in the form of stablecoins. This ensures that the value of these funds remains stable, regardless of the Bitcoin price volatility."
          :currentBalance="true"
          textButton="Verify on Blockchain"
          @click="goToRegistration"
        />
      </div>

      <div class="s-site-guarantees__card-wrapper">
        <m-guarantees-card
          capital="$50,000,000 Paid Up Capital"
          label="Protection 3"
          body="The funds holding company in Hong Kong will utilize its paid up capital to fulfill guarantees if necessary."
          :currentBalance="false"
          textButton="Verify Official Record"
          @click="goToRegistration"
        />
      </div>

      <NuxtImg src="/img/guarantees-main-img.png" loading="lazy" width="900" />
      <div
        style="
          position: absolute;
          width: 100%;
          height: 313px;
          bottom: 0;
          background: linear-gradient(180deg, rgba(1, 4, 15, 0) 0%, #01040f 74.5%, #01040f 100%);
        "
      ></div>
    </div>
    <div class="s-site-guarantees__slide_cards" style="margin-top: -80px; padding-left: 16px">
      <m-slider class="s-site-main__items" :modules="[]" :navigation="false" slides-per-view="auto" :space-between="8">
        <template #slides>
          <swiper-slide class="s-site-main__item">
            <div class="s-site-main__item-value">
              <div class="s-site-main__item-value--wrapper">
                <div class="s-site-main__item-value-body">
                  <p class="s-site-main__item-value--title" style="font-size: 20px">BTC Reserve Fund</p>
                  <p style="font-size: 32px; text-align: left">{{ $app.filters.rounded(fundTotalBtc, 2) }} BTC</p>
                  <p class="guarantees-card__current_balance" style="font-size: 20px; text-align: left">
                    Current Balance
                    <span
                      ><NuxtImg
                        class="s-site-main__title_icon aspect-square w-[14px]"
                        src="/img/icons/colorful/live-data.svg"
                        width="14"
                        height="14"
                        loading="lazy"
                      />
                      LIVE DATA</span
                    >
                  </p>
                  <p style="font-size: 16px; text-align: left; line-height: 120%; margin-top: 16px; font-weight: 500">
                    The reserve fund serves as a safety net, absorbing losses and maintaining liquidity during times of
                    market turmoil. By diversifying our holdings into Bitcoin, we can weather unexpected events and
                    continue delivering steady returns to our investors.
                  </p>
                </div>
                <button @click="goToRegistration" class="guarantees-card__button">
                  Verify on Blockchain
                </button>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide class="s-site-main__item">
            <div class="s-site-main__item-value">
              <div class="s-site-main__item-value--wrapper">
                <div class="s-site-main__item-value--body">
                  <p class="s-site-main__item-value--title" style="font-size: 20px">USDT Protection Vault</p>
                  <p style="font-size: 32px; text-align: left">${{ $app.filters.rounded(fundTotalUsd, 0) }}</p>
                  <p class="guarantees-card__current_balance" style="font-size: 20px; text-align: left">
                    Current Balance
                    <span
                      ><NuxtImg
                        class="s-site-main__title_icon aspect-square w-[14px]"
                        src="/img/icons/colorful/live-data.svg"
                        width="14"
                        height="14"
                        loading="lazy"
                      />
                      LIVE DATA</span
                    >
                  </p>
                  <p style="font-size: 16px; text-align: left; line-height: 120%; margin-top: 16px; font-weight: 500">
                    Every time our bot makes a profit from these hedging operations the profit is deposited into the
                    Protection Vault in the form of stablecoins. This ensures that the value of these funds remains
                    stable, regardless of the Bitcoin price volatility.
                  </p>
                </div>
                <button @click="goToRegistration" class="guarantees-card__button">Verify on Blockchain</button>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide class="s-site-main__item">
            <div class="s-site-main__item-value">
              <div class="s-site-main__item-value--wrapper">
                <div class="s-site-main__item-value--body">
                  <p class="s-site-main__item-value--title">$50,000,000 Paid Up Capital</p>
                  <p class="s-site-main__item-value--description">
                    The funds holding company in Hong Kong will use its paid up capital to satisfy guarantees if needed.
                  </p>
                </div>
                <div class="s-site-main__item-value--footer">
                  <button @click="goToRegistration" class="guarantees-card__button">
                    Verify Official Record
                  </button>
                </div>
              </div>
            </div>
          </swiper-slide>
        </template>
      </m-slider>
    </div>
    <m-guarantees-table />
  </section>
</template>
<script setup lang="ts">
import MGuaranteesCard from '~/src/shared/ui/site/molecules/m-guarantees-card/m-guarantees-card.vue'
import MGuaranteesTable from '~/src/shared/ui/site/molecules/m-guarantees-table/m-guarantees-table.vue'

import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'
import { useNuxtApp } from '#app'
import { computed } from 'vue'
import { auth } from '~/src/app/store/auth'

const { $app } = useNuxtApp()
const $router = useRouter()
const authStore = auth()
const isAuth = computed(() => authStore.isUserAuthenticated)

  

const fundTotalBtc = computed(() => {
  return $app.store.assets.fundTotalBtc
})

const fundTotalUsd = computed(() => {
  return $app.store.user.fundTotalUsd
})


function goToRegistration() {
    if (isAuth.value) {
      const isProd = ['bitcoinetf.org', 'app.bitcoinetf.org'].includes(window.location.host) ? true : false
      const blockchainLink = isProd
        ? 'https://explorer.nextdev.org/account/PccUG4tvCYT8RaaCozjCzRXyxpryAgowJ4'
        : 'https://explorer.stage.techetf.org/account/PccUG4tvCYT8RaaCozjCzRXyxpryAgowJ4'
        
      window.open(blockchainLink, '_blank').focus()
    } else {
      $router.push('/personal/registration')
    }
  }
</script>
<style src="./s-site-guarantees.scss" lang="scss" />
