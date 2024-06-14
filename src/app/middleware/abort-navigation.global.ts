export default defineNuxtRouteMiddleware((to) => {
  const closedRoutes = ['offers']
  if (closedRoutes.includes(to.name as string)){
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  }
})
