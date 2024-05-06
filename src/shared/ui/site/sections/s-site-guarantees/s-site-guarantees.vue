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
        />
      </div>
      <div class="s-site-guarantees__card-wrapper">
        <m-guarantees-card
          label="Protection 2"
          title="USDT Protection Vault"
          :cost="`$${$app.filters.rounded(fundTotalUsd, 0)}`"
          body="Whenever our AI trading bot profits from the hedging operations, the profit is deposited into the Protection Vault in the form of stablecoins. This ensures that the value of these funds remains stable, irrespective of Bitcoin price volatility."
          :currentBalance="true"
          textButton="Verify on Blockchain"
        />
      </div>

      <div class="s-site-guarantees__card-wrapper">
        <m-guarantees-card
          capital="$50,000,000 Paid Up Capital"
          label="Protection 3"
          body="The funds holding company in Hong Kong will utilize its paid up capital to fulfill guarantees if necessary."
          :currentBalance="false"
          textButton="Verify Official Record"
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
                <button @click="$router.push('/personal/registration')" class="guarantees-card__button">
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
                <button @click="$router.push('/personal/registration')" class="guarantees-card__button">
                  Verify on Blockchain
                </button>
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
                  <button @click="$router.push('/personal/registration')" class="guarantees-card__button">
                    Verify Official Record
                  </button>
                </div>
              </div>
            </div>
          </swiper-slide>
        </template>
      </m-slider>
    </div>

    <div class="s-site-guarantees__table-wrapper">
      <div class="s-site-guarantees__table-container">
        <div class="s-site-guarantees__table">
          <div class="s-site-guarantees__table-head">
            <div class="s-site-guarantees__table-head-item">
              <p class="s-site-guarantees__table-head-item-title">
                BITCOINETF.ORG <br />
                VS. VOLATILE CRYPTO <br />
                INVESTMENTS
              </p>
            </div>
            <div class="s-site-guarantees__table-head-item">
              <NuxtImg src="/img/main-guarantees-table-title-1.png" width="188" height="97" />
            </div>
            <div class="s-site-guarantees__table-head-item">
              <NuxtImg src="/img/main-guarantees-table-title-2.png" width="188" height="97" />
            </div>
            <div class="s-site-guarantees__table-head-item">
              <NuxtImg src="/img/main-guarantees-table-title-3.png" width="188" height="97" />
            </div>
            <div class="s-site-guarantees__table-head-item">
              <NuxtImg src="/img/main-guarantees-table-title-4.png" width="220" />
            </div>
          </div>
          <div class="s-site-guarantees__table-body">
            <div class="s-site-guarantees__table-row first-row">
              <div class="s-site-guarantees__table-row-item">Original investment loss</div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/alert.svg" width="24" height="24" loading="lazy" /> Mid to High Risk
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" /> High Risk
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/alert.svg" width="24" height="24" loading="lazy" /> Mid Risk
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" /> No Risk (Triple
                Protection)
              </div>
            </div>
            <div class="s-site-guarantees__table-row second-row">
              <div class="s-site-guarantees__table-row-item">Dividends</div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" /> 0%
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" /> 0%
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" /> 0%
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" /> 14-100%+ dividends
              </div>
            </div>
            <div class="s-site-guarantees__table-row third-row">
              <div class="s-site-guarantees__table-row-item">Accessible for non-U.S market</div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" /> Limited
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" /> Limited
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" /> Yes
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />
                Worldwide
                <NuxtImg src="/img/world.png" width="16" height="16" loading="lazy" />
              </div>
            </div>
            <div class="s-site-guarantees__table-row fourth-row">
              <div class="s-site-guarantees__table-row-item">Legal No-Risk Guarantee</div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" /> No
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" /> No
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" /> No
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />Yes
              </div>
            </div>
            <div class="s-site-guarantees__table-row fifth-row">
              <div class="s-site-guarantees__table-row-item">Smart-Contract Guarantee</div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" /> No
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" /> No
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" /> No
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />Yes
              </div>
            </div>
            <div class="s-site-guarantees__table-row sixth-row">
              <div class="s-site-guarantees__table-row-item">Blockchain Transparency</div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />No
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />Yes
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />Yes
              </div>
              <div class="s-site-guarantees__table-row-item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />Yes
              </div>
            </div>
          </div>
        </div>

        <div :class="[{'s-site-guarantees__drag-hide': !isDrag}]" class="s-site-guarantees__drag">
          <div class="s-site-guarantees__drag-wrapper">
            <NuxtImg src="/img/icons/mono/arrow.svg" class="s-site-guarantees__drag-arrow" alt="arrow" />
            drag 
            <NuxtImg src="/img/icons/mono/arrow.svg" class="s-site-guarantees__drag-arrow s-site-guarantees__drag-arrow-reverse" alt="arrow" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import MGuaranteesCard from '~/src/shared/ui/site/molecules/m-guarantees-card/m-guarantees-card.vue'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'
import { useNuxtApp } from '#app'
import { computed } from 'vue'

const { $app } = useNuxtApp()

const fundTotalBtc = computed(() => {
  return $app.store.assets.fundTotalBtc
})

const fundTotalUsd = computed(() => {
  return $app.store.user.fundTotalUsd
})

//drag 

const isDrag = ref(true);

const handleScroll = (event) => {
  const element = document.querySelector(".s-site-guarantees__table-wrapper");
  const elementPosition = element.offsetTop - (element.offsetHeight * 0.35);
  const toTop = window.pageYOffset ? window.pageYOffset : document.body.scrollTop;

  // console.log(toTop, elementPosition);

  if(toTop >= elementPosition) {
    setTimeout(() => {
      isDrag.value = false;
    },5000);
  } 
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll',handleScroll);
})
</script>
<style src="./s-site-guarantees.scss" lang="scss" />
