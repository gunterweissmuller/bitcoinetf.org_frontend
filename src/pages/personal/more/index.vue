<template>
  <div class="more">
    <w-aside is-page />
    <f-refer-friends class="more__refer" :modal="false" @click="isOpenModalRefer = true" />
    <f-refer-friends class="more__refer" :button="false" :show="isOpenModalRefer" @update="isOpenModalRefer = $event" />
  </div>
</template>

<script lang="ts" setup>
import WAside from '~/src/widgets/layouts/w-aside/w-aside.vue'
import FReferFriends from '~/src/features/f-refer-friends/f-refer-friends.vue'

const isOpenModalRefer = ref(false)
</script>

<style lang="scss">
.more {
  max-width: torem(1056);
  display: flex;

  &__refer {
    display: none;

    @include breakpoint($break-desktop-1024) {
      margin-left: torem(24);
      display: block;
    }
  }
}
</style>
