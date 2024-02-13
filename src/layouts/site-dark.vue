<template>
  <w-header-dark/>
  <main class="site-dark">
    <slot/>
  </main>
</template>

<script setup lang="ts">
import WHeaderDark from "~/src/widgets/layouts/w-header-dark/w-header-dark.vue";
</script>

<style lang="scss">

section {
  color: var(--text-inverse-primary);
  background: #01040F;
  overflow: hidden;
}

.l-site-dark {
  max-width: torem(1320);
  margin: 0 auto;

  @media (max-width: 1319px) {
    padding: 0 torem(16);
  }
}

.site-dark {
  .a-button--secondary {
    color: var(--text-primary) !important;
    background: var(--color-bg) !important;
  }

  .swiper-scrollbar {
    display: block !important;
  }
}

.title-site {
  &-h1 {
    font-family: Jakarta, sans-serif;
    font-size: torem(64);
    line-height: torem(76);
    font-weight: 800;
    text-transform: uppercase;

    @media (max-width: 767px) {
      font-size: torem(36);
      line-height: torem(43);
    }
  }

  &-h2 {
    font-family: Jakarta, sans-serif;
    font-size: torem(100);
    line-height: 1;
    font-weight: 800;
    text-transform: uppercase;

    @media (max-width: 1099px) {
      font-size: torem(80);
    }

    @media (max-width: 799px) {
      font-size: torem(40);
    }

    @media (max-width: 767px) {
      font-size: torem(36);
    }
  }

  &-h1, &-h2 {
    span {
      color: #41434b;
    }
  }
}
</style>
