<template>
  <VOnboardingWrapper class="w-onboarding" ref="wrapper" :steps="steps">
    <template #default="{ previous, next, step, exit, isFirst, isLast, index }">
      <VOnboardingStep class="w-onboarding__step">
        <m-popper :show="true" type="colorful" style="margin: 0 auto">
          <template #content>
            <div class="w-onboarding-popper">
              <a-icon
                v-if="closeIconVisible(isLast)"
                class="w-onboarding-popper__icon"
                width="18"
                height="18"
                :name="Icon.MonoActionClose"
                @click="finishOnboarding('finished')"
              />
              <div class="w-onboarding-popper__head">
                <div class="w-onboarding-popper__head-title">{{ step.content.title }}</div>
              </div>
              <div class="w-onboarding-popper__content">
                <div v-html="step.content.description" class="w-onboarding-popper__text"></div>
              </div>
              <div class="w-onboarding-popper__buttons">
                <a-button
                  class="w-onboarding-popper__button"
                  @click="isLast && !nextRouteName ? finishOnboarding('finished') : goToNextStep(isLast, next)"
                  :text="isLast && !nextRouteName ? 'Buy Bitcoin ETF Shares' : 'Next'"
                  size="small"
                  variant="secondary"
                />
                <a-button
                  v-if="showSecondButton(isLast)"
                  class="w-onboarding-popper__button"
                  :text="secondButtonText(isLast)"
                  @click="secondButtonClick(isLast)"
                />
              </div>
            </div>
          </template>
        </m-popper>
      </VOnboardingStep>
    </template>
  </VOnboardingWrapper>
</template>
<script setup lang="ts">
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import MPopper from '~/src/shared/ui/molecules/m-popper/m-popper.vue'
import { ref, watch } from 'vue'
import { VOnboardingWrapper, VOnboardingStep, useVOnboarding } from 'v-onboarding'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'

const { $app } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    steps: any[]
    nextRouteName?: string
    isPurchase?: boolean
  }>(),
  {
    steps: [],
    nextRouteName: null,
    isPurchase: false,
  },
)

const router = useRouter()
const route = useRoute()

const isPageFinished = ref(false)

// Onboarding
const wrapper = ref(null)
const { start, finish } = useVOnboarding(wrapper)

const finishOnboarding = (status) => {
  finish()
  localStorage.setItem('onboarding', status)
  localStorage.setItem('journey', status ? status : 'finished')
  document.body.classList.remove('no-scroll')
  document.body.style.pointerEvents = 'all'
}

const goToNextStep = (isLast: boolean, next: Function) => {


  if (isLast && props.nextRouteName) {

    // finishOnboarding('finished')

    if(props.isPurchase && props.nextRouteName == 'personal-buy-shares') {
      finishOnboarding('finished');
      $app.store.user.setIsInvestModalShow({show: true});
    } else {
      router.push({ name: props.nextRouteName })
    }

  } else {
    next()
  }
}

const showSecondButton = (isLast: boolean) => {
  const journey = localStorage?.getItem('journey')

  if (route.name === 'personal-buy-shares') {
    if (journey && isLast) {
      return false
    }

    return true
    // return !journey
  } else {
    // return !!props.nextRouteName
    if (props.nextRouteName) {
      return true
    } else {
      return !isLast
    }
  }

  // return !isLast && props.nextRouteName
}

const secondButtonText = (isLast) => {
  const journey = localStorage?.getItem('journey')

  if (route.name !== 'personal-buy-shares') {
    return 'Skip tutorial'
  }

  if (!isLast) {
    return 'Skip tutorial'
  }

  return journey ? 'Skip tutorial' : 'Extended tutorial'
}

const closeIconVisible = (isLast) => {
  const journey = localStorage?.getItem('journey')

  return isLast && !journey && route.name === 'personal-buy-shares'
}

const secondButtonClick = (isLast) => {
  // const journey = localStorage?.getItem('journey')

  if (route.name === 'personal-buy-shares') {
    if (isLast) {
      goToExtended()
    } else {
      finishOnboarding('skipped')
    }
  } else {
    finishOnboarding('skipped');
    $app.store.user.setIsInvestModalShow({show: true});
    // router.push({ name: 'personal-buy-shares' })
  }
}

const goToExtended = () => {
  localStorage.setItem('journey', 'finished')
  router.push({ name: 'personal-analytics' })
}

const loading = computed(() => {
  return $app.store.asset.loading
})

watch(
  () => loading.value,
  (value) => {
    if (value) {
      const journey = localStorage.getItem('journey')
      const onboarding = localStorage.getItem('onboarding')

      if ((!journey && !onboarding) || (journey && !onboarding)) {
        setTimeout(async () => {
          document.body.classList.add('no-scroll')
          document.body.style.pointerEvents = 'none'
          start()
        }, 500)
      }
    }
  },
)

useNuxtApp().hook('page:finish', (): void => {
  setTimeout(() => {
    isPageFinished.value = true
  }, 1000)
})
</script>

<style lang="scss" scoped>
// Стили кастомного онбординга
.w-onboarding {
  &__step {
    pointer-events: all;

    svg {
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      pointer-events: none;
    }
  }

  :deep(.popper) {
    max-width: calc(100vw - 32px);
    width: calc(100vw - 32px);
    margin: 0 auto;

    @include breakpoint($break-desktop-1024) {
      min-width: torem(343);
      max-width: torem(343);
    }
  }

  &-popper {
    // Эти стили нужны, если захотим на нативный с либы переписать
    //max-width: 100vw;
    //width: calc(100vw - 32px);
    //margin: 0 auto;
    //padding: torem(24);
    //border-radius: torem(16);
    //background-color: var(--accent-primary);
    //border-color: var(--accent-primary);

    &__icon {
      position: absolute;
      cursor: pointer;
      color: var(--text-inverse-primary);
      right: torem(16);
      top: torem(16);
    }

    &__head {
      margin-bottom: var(--spacing-s);

      &-title {
        color: var(--text-inverse-primary);
        font-family: Dm, sans-serif;
        font-size: torem(20);
        font-weight: 700;
        line-height: normal;
      }
    }

    &__text {
      color: var(--text-inverse-secondary);
      font-family: Dm, sans-serif;
      font-size: torem(16);
      font-weight: 400;
      line-height: normal;
      margin-bottom: var(--spacing-m-1);
    }

    &__buttons {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__button {
      width: 100%;
    }
  }

  &__step {
    text-align: center;

    .m-popper__head {
      justify-content: center;
    }
  }
}
</style>
