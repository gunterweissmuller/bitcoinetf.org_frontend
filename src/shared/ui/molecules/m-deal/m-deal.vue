<template>
  <div :id="withId ? withId : ''" class="m-deal">
    <template v-if="type === 'trade'">
      <div class="m-deal__trade">
        <div :class="['m-deal__type', `bg--${deal.asset.symbol.toLowerCase()}`]"></div>
        <div class="m-deal__right m-deal__right--trade">
          <div class="m-deal__name m-deal__name--trade">
            <div class="m-deal__name-title">
              <span>{{ deal.asset.name }}</span>
            </div>
            <div v-if="deal.type === 'close'" class="m-deal__info-result">
              <div v-if="deal.asset.symbol === 'BAA' && (Number(deal.result_amount) > 0)">
                {{ deal.result_amount ? '+' : '' }}${{ $app.filters.rounded(deal.result_amount, 2) }}
              </div>
              <div v-if="deal.asset.symbol === 'BFT' && (Number(deal.result_amount) > 0)">
                {{ deal.result_amount ? '+' : '' }}${{ $app.filters.rounded(deal.result_amount, 2) }}
              </div>
              <div v-if="deal.asset.symbol === 'BOT' && (Number(deal.result_amount) > 0)">
                {{ deal.result_amount ? '+' : '' }}${{ $app.filters.rounded(deal.result_amount, 2) }}
              </div>
              <div v-if="deal.asset.symbol === 'BST' && (Number(deal.result_amount) > 0)">
                {{ deal.result_amount ? '+' : '' }}${{ $app.filters.rounded(deal.result_amount, 2) }}
              </div>
              <div v-if="deal.asset.symbol === 'USDT' && (Number(deal.result_amount) > 0)">
                {{ deal.result_amount ? '+' : '' }}${{ $app.filters.rounded(deal.result_amount, 2) }}
              </div>
            </div>
          </div>
          <div class="m-deal__info m-deal__info--trade">
            <div class="m-deal__info-deal">
                <template v-if="deal.asset.symbol === 'BAA'">
                  <span class="m-deal__info-deal-date">
                    {{ $app.filters.dayjs(deal.created_at).format('DD.MM.YY hh:mm') }}
                  </span>
                  <span class="m-deal__info-deal-right" v-if="deal.type === 'close'">
                    Sell Price: ${{$app.filters.rounded(deal.bitcoin_price,2)}}
                  </span>
                  <span class="m-deal__info-deal-images">
                    <img v-for="number in getTwoRandom(deal?.bitcoin_price)" :src="`/img/dealtype/${number}.svg`" alt="">
                  </span>
                </template>

                <template v-else-if="deal.asset.symbol === 'BFT'">
                  <span class="m-deal__info-deal-date">
                    {{ $app.filters.dayjs(deal.created_at).format('DD.MM.YY hh:mm') }}
                  </span>
                  <span class="m-deal__info-deal-right">
                    Exit Price: ${{ sumDollars }}
                  </span>
                </template>

                <template v-else-if="deal.asset.symbol === 'BOT'">
                  <span class="m-deal__info-deal-date">
                    {{ $app.filters.dayjs(deal.created_at).format('DD.MM.YY hh:mm') }}
                  </span>
                  <span class="m-deal__info-deal-right" v-if="deal.type === 'close'">
                    Settlement Price: ${{$app.filters.rounded(deal.bitcoin_price,2)}}
                  </span>
                </template>

                <template v-else-if="deal.asset.symbol === 'BST'">
                  <span class="m-deal__info-deal-date">
                    {{ $app.filters.dayjs(deal.created_at).format('DD.MM.YY hh:mm') }}
                  </span>
                  <span class="m-deal__info-deal-right" v-if="deal.type === 'close'">
                    Exit Price: ${{ $app.filters.rounded(deal.initial_amount, 2) }}
                  </span>
                </template>

                <template v-else-if="deal.asset.symbol === 'USDT'">
                  <span class="m-deal__info-deal-date">
                    {{ $app.filters.dayjs(deal.created_at).format('DD.MM.YY hh:mm') }}
                  </span>
                  <span class="m-deal__info-deal-right" v-if="deal.type === 'close'">
                    USDT Staking Yield +${{ $app.filters.rounded(deal.initial_amount, 2) }}
                  </span>
                </template>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="type === 'spillover'">
      <template v-if="deal.type === 'debit'">
        <div class="m-deal__name">
          <div class="m-deal__name-title">
            <div :class="['m-deal__type', `bg--${deal.to_asset.symbol.toLowerCase()}`]"></div>
            <span>{{ deal.to_asset.name }}</span>
          </div>
          <div class="m-deal__name-date">{{ $app.filters.dayjs(deal.created_at).format('DD.MM.YY hh:mm') }}</div>
        </div>
        <div class="m-deal__info">
          <div class="m-deal__info-inflow-result">+ ${{ $app.filters.rounded(deal.amount, 2) }}</div>
          <div class="m-deal__info-inflow">New Capital Inflow</div>
        </div>
      </template>
      <template v-if="deal.type === 'credit'">
        <div class="m-deal__name">
          <div class="m-deal__transfer">
            <div class="m-deal__transfer-from">
              <div :class="['m-deal__type', `bg--${deal.from_asset.symbol.toLowerCase()}`]"></div>
              <span>{{ deal.from_asset.symbol }}</span>
            </div>
            <a-icon :name="Icon.MonoChevronRight" width="18" height="18" />
            <div class="m-deal__transfer-to">
              <div :class="['m-deal__type', `bg--${deal.to_asset.symbol.toLowerCase()}`]"></div>
              <span>{{ deal.to_asset.symbol }}</span>
            </div>
          </div>
          <div class="m-deal__name-date">{{ $app.filters.dayjs(deal.created_at).format('D MMM YY hh:mm:ss') }}</div>
        </div>
        <div class="m-deal__info">
          <div class="m-deal__info-transfer-result">${{ $app.filters.rounded(deal.amount, 2) }}</div>
          <div class="m-deal__info-transfer">Transfer</div>
        </div>
      </template>
    </template>
    <template v-else-if="type === 'purchase'">
      <div class="m-deal__name">
        <div class="m-deal__name-title">
          <a-avatar size="24px" class="m-deal__type m-deal__avatar-purchase" photo-src="/img/avatar-robot.png" :robot-data="deal.account.uuid"/>
          <span>{{ deal.account.username }}</span>
        </div>
        <div class="m-deal__name-date">{{ $app.filters.dayjs(deal.created_at).format('D MMM YY hh:mm:ss') }}</div>
      </div>
      <div class="m-deal__info">
        <div class="m-deal__info-purchase-result">{{ $app.filters.rounded(deal.amount, 0) }} Shares</div>
      </div>
    </template>
    <template v-else-if="type === 'shareholder'">
      <div class="m-deal__name m-deal__name-shareholder">
        <a-avatar size="32px" class="m-deal__type m-deal__avatar-shareholder" photo-src="/img/avatar.png"  :robot-data="deal.account.uuid"/>
        <div class="m-deal__name-content">
          <div class="m-deal__name-title">
            <span>
              {{ deal.account.username }}
            </span>
          </div>
          <div class="m-deal__info-purchase">${{ $app.filters.rounded(deal.total_dividends, 2) }} earned</div>
        </div>
      </div>
      <div class="m-deal__info">
        <div class="m-deal__info-purchase-result m-deal__info-shareholders-result">{{ $app.filters.rounded(deal.total_payments, 0) }} Shares</div>
        <div class="m-deal__info-purchase">{{ $app.filters.rounded((deal.total_payments / fundTotalUsd * 100), 2) }}% of circulation</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue';
import { Icon } from '~/src/shared/constants/icons';
import { useNuxtApp } from '#app';
import AAvatar from '~/src/shared/ui/atoms/a-avatar/a-avatar.vue';
import { computed } from 'vue';

const { $app } = useNuxtApp();

const dealTypes: any = {
  open: 'Open',
  close: 'Close',
}

const sumDollars = ref('');

const props = withDefaults(
  defineProps<{
    deal: any
    type?: 'trade' | 'spillover' | 'purchase' | 'shareholder'
    withId?: string
  }>(),
  {
    type: 'trade',
    withId: '',
  },
)

const btcValue = computed(() => {
  return props.deal?.bitcoin_price || $app.store.user.btcValue
})

const fundTotalUsd = computed(() => {
  return $app.store.user.fundTotalUsd
})

function getRandomInt(min, max) {
  const uuid = props.deal?.uuid;

  if (!uuid) return ''
  const bigIntValue = BigInt(
    "0x" + uuid.replace(/-/g, "")
  );
  const bigIntStr = bigIntValue.toString()

  const anyNumber = Number(bigIntStr.split('').slice(-5 ).join(''))
  const diff = max - anyNumber
  return diff > min ? diff : min + diff
}

const getTwoRandom = (value) => {
  if (!value) return

  let one = Number(String(value)[String(value).length - 2])
  let two = Number(String(value)[String(value).length - 1])

  if (one === 0) {
    one += 1
  }

  if (two === 0) {
    two += 1
  }


  if (one > 6) {
    one -= 6
  }
  if (two > 6) {
    two -= 6
  }

  if (one === two) {
    one === 6 || one > 1 ?  one -= 1 : one += 1
  }

  return [one, two]
}

onMounted(() => {
   sumDollars.value = $app.filters.rounded(getRandomInt(40000, 86000),2)

})
</script>

<style src="./m-deal.scss" lang="scss" />
