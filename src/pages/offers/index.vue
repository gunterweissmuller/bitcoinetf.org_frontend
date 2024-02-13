<template>
  <section class="s-site-offers">
    <div class="l-site">
      <h1 class="s-site-offers__title site-title-h2">{{ offers.title }}</h1>
      <div class="s-site-offers__description">{{ offers.description }}</div>
    </div>
    <div class="s-site-offers__items">
      <div class="l-site">
        <m-banner
          v-for="banner in sections"
          :title="banner.data.title"
          :description="banner.data.description"
          :img="banner.files[0].real_path"
          :background="banner.data.background"
          :button_link="banner.data.button_link"
          :button_text="banner.data.button_text"
          :url="banner.data?.link_to_offer"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {useNuxtApp} from "#app";
import MBanner from "~/src/shared/ui/site/molecules/m-banner/m-banner.vue";

definePageMeta({
  layout: 'site-texts',
})
const offers = {
  title: 'Offers',
  description: 'Remember to ensure all promotions comply with applicable laws and regulations, and provide clear terms and conditions for participants.',
}

const { $app } = useNuxtApp()

const { data: sections } = useAsyncData('offers', async () => {
  return await $app.api.eth.pages.getPageInfo('offers').then((resp) => {
    return resp.sections
  })
})
</script>
<style lang="scss">
.s-site-offers {
  padding: torem(179, 0);

  @media (max-width: 767px) {
    padding: torem(184, 0);
  }

  &__title {
    margin-bottom: torem(32);

    @media (max-width: 767px) {
      margin-bottom: torem(24);
    }
  }

  &__description {
    font-size: torem(20);
    line-height: torem(26);
    margin-bottom: torem(48);

    @media (max-width: 767px) {
      font-size: torem(16);
      line-height: torem(20);
      margin-bottom: torem(32);
    }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: torem(16);

    .l-site {
      @media (max-width: 767px) {
        padding: 0;
      }
    }
  }
  .m-banner {
    &:not(:last-child) {
      margin-bottom: torem(16);
    }
  }
}

</style>
