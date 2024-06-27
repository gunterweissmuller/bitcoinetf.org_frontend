import { useNuxtApp } from '#app'
import { auth } from '~/src/app/store/auth'

export function useDemo() {
  const { $app } = useNuxtApp()
  const authStore = auth()

  const fetchDemoUserToken = async () => {
    try {
      const { data } =  await $app.api.eth.auth.getDemoUserToken()
      authStore.setTokens(data)
    } catch (error) {
      console.error(error);
    }
  }
  return {
    fetchDemoUserToken,
  };
}
