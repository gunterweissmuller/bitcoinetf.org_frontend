<template>
  <div class="m-snackbars">
    <transition-group name="m-snackbars">
      <template v-for="snackbar in snackbars" :key="snackbar.id">
        <a-snackbar :text="snackbar.text" :type="snackbar.type" @close="removeNotification(snackbar)" />
      </template>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import ASnackbar from '~/src/shared/ui/atoms/a-snackbar/a-snackbar.vue'
import useNotification from '~/composables/useNotification'
interface INotificationsItem {
  id?: string
  text: string
  timeoutToHide?: number
  type: string
}

const { notificationsList, removeNotification } = useNotification()

const snackbars = computed<INotificationsItem[] | []>(() => {
  return notificationsList.value || []
})
</script>

<style lang="scss" src="./m-snackbars.scss" />
