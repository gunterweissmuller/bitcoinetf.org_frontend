import { Ability, AbilityClass } from '@casl/ability'
import { defineAbility } from '@casl/ability'
// import roles_permissions from '~/src/shared/constants/roles_permissions'

type Actions = 'review' | 'publish' | 'read'
type Subjects = 'demo' | 'auth'

export type AppAbility = Ability<[Actions, Subjects]>
export const AppAbility = Ability as AbilityClass<AppAbility>

function c(can, permissions) {
  permissions.forEach((item) => {
    can(item.action, item.subject)
  })
}

const demoPermissions = [{ action: 'readonly', subject: 'demo' }]

export const ability = defineAbility((can) => c(can, demoPermissions))

export default defineNuxtPlugin(({ $app }) => {
  console.log('test-ability-->', ability.rules);
  
  // const isUserAuthenticated = $app.store.auth.isUserAuthenticated
  // if (isUserAuthenticated) {
  //   ability.update(roles_permissions['auth'])
  // }

  // $app.store.user.$onAction(({ name, args }) => {
  //   if (name == 'setPermissions') {
  //     const [role] = args
  //     ability.update(roles_permissions[role])
  //   }
  // })
})
