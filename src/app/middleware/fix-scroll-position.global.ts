import { useNuxtApp } from '#app'

export default defineNuxtRouteMiddleware(() => {
  if (process.server) return

  const scrollWrapper = document.body

  useNuxtApp().hook('page:finish', () => {
    scrollWrapper.scrollTop = 0
  })
})
