<template>
  <w-header-dark />
  <main>
    <slot />
  </main>
  <s-site-footer-new />
</template>

<script setup lang="ts">
import WHeaderDark from '~/src/widgets/layouts/w-header-dark/w-header-dark.vue'
import SSiteFooterNew from '~/src/shared/ui/site/sections/s-site-footer-new/s-site-footer-new.vue'
</script>

<style lang="scss">
section {
  color: var(--text-inverse-primary);
  background: #01040f;
  overflow: hidden;
}

.l-site {
  max-width: torem(1062);
  margin: 0 auto;

  @media (max-width: 1199px) {
    padding: 0 torem(16);
  }

  &-footer {
    max-width: torem(1280);
    margin: 0 auto;

    @media (max-width: 1299px) {
      padding: 0 torem(16);
    }
  }
}

.site-title-h1 {
  font-family: Dm, sans-serif;
  font-size: torem(50);
  line-height: torem(65);
  font-weight: 600;
}

.site-title-h2 {
  font-family: Dm, sans-serif;
  font-size: torem(42);
  line-height: 130%;
  font-weight: 900;

  span {
    color: var(--accent-primary);
  }
}

.site-title-h3 {
  font-family: Dm, sans-serif;
  font-size: torem(32);
  line-height: torem(41);
  font-weight: 900;

  span {
    color: var(--accent-primary);
  }
}

.s-site-back {
  cursor: pointer;
  display: flex;
  align-items: center;
  max-width: fit-content;
  font-family: Dm, sans-serif;
  font-size: torem(16);
  color: var(--accent-primary);
  margin-bottom: torem(16);

  .a-icon {
    margin-right: torem(4);
  }

  &__text {
    font-weight: 600;
  }
}
</style>
