<template>
  <div class="site-tutorials-container">
    <w-header-dark/>
    <main class="site-tutorials">
      <div class="l-tutorials">
        <slot/>
      </div>
    </main>
  </div>
  <s-site-footer/>
</template>

<script setup lang="ts">
import WHeaderDark from '~/src/widgets/layouts/w-header-dark/w-header-dark.vue'
import SSiteFooter from "~/src/shared/ui/site/sections/s-site-footer/s-site-footer.vue";
</script>

<style lang="scss">
html,
body,
html #__nuxt,
body #__nuxt {
  overflow-x: clip;
}

.l-tutorials {
  position: relative;
  display: grid;
  grid-template-columns: 3fr 5fr;
  max-width: torem(1440);
  margin: 0 auto;

  @media (max-width: 767px) {
    grid-template-columns: 3fr;
  }
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
  font-family: Dm;
  font-size: torem(50);
  line-height: torem(65);
  font-weight: 600;
}

.site-title-h3 {
  font-family: Dm;
  font-size: torem(32);
  line-height: torem(41);
  font-weight: 900;
}

.m-site-sidebar {
  margin-left: torem(189);
  margin-right: torem(133);

  @media (max-width: 1299px) {
    max-width: fit-content;
    margin-left: torem(100);
    margin-right: torem(40);
  }

  @media (max-width: 991px) {
    margin-left: torem(16);
    margin-right: torem(16);
  }

  @media (max-width: 767px) {
    margin-left: 0;
    margin-right: 0;
  }

  a {
    color: #ABAEBE !important;
  }
}

.site-tutorials {
  position: relative;
  color: var(--text-inverse-primary);
  background: #01040F;
  padding: torem(179, 0);
  overflow: auto;

  @include breakpoint($break-tablet) {
    overflow: visible;
  }

  @media (max-width: 991px) {
    padding: torem(184, 0);
  }

  &-container {
    @include breakpoint($break-tablet) {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
