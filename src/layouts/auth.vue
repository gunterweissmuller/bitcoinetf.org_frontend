<template>
  <div class="l-auth">
    <w-header-auth/>
    <main class="l-auth__content">
      <div class="l-auth-container">
        <slot/>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import WHeaderAuth from '~/src/widgets/layouts/w-header-auth/w-header-auth.vue'
import {Icon} from "~/src/shared/constants/icons";
import AIcon from "~/src/shared/ui/atoms/a-icon/a-icon.vue";
</script>
<style lang="scss">
.l-auth-container--back {
  display: flex;
  width: 100%;
}
</style>
