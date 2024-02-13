import { useNuxtApp } from '#app'
import { h, ref } from '#imports'
import MSnackbars from '~/src/shared/ui/molecules/m-snackbars/m-snackbars.vue'

interface INotificationsItem {
  id?: string
  text: string
  timeoutToHide?: number
  type?: 'default' | 'error'
}

const notificationsList = ref<INotificationsItem[] | []>([])

const TIMEOUT_TO_HIDE: number = 6000
const removeNotification = (item: INotificationsItem) => {
  notificationsList.value = notificationsList.value.filter((el) => el.id !== item.id)
}

const clearNotifications = () => {
  notificationsList.value = []
}

const addNotification = (item: INotificationsItem) => {
  const { $app } = useNuxtApp()
  const newNotification: INotificationsItem = {
    id: $app.filters.uuid(),
    text: item.text,
    timeoutToHide: item.timeoutToHide || TIMEOUT_TO_HIDE,
    type: item.type || 'default',
  }

  notificationsList.value.push(newNotification)
  setTimeout(() => {
    removeNotification(newNotification)
  }, newNotification.timeoutToHide)
}

export default function () {
  return {
    notifications: h(MSnackbars, {
      list: notificationsList.value,
    }),
    notificationsList,
    removeNotification,
    addNotification,
    clearNotifications,
  }
}
