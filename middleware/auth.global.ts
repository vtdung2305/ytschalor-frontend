import { useUser } from '@/stores/user'
import { RoleEnum } from '@/constants/role'

const PAGE_IGNORE_AUTH = [
  // 'index',
  'signup',
  'activate-token',
  'forgot-password',
  'reset-password',
  // 'signup-confirmation',
  // 'facilities-verify',
  // 'forgot-password',
  // 'purchase-reminder',
  // 'policy',
  // 'specified',
  // 'flow-to-registration',
  // 'flow-to-procedure',
  // 'terms',
  // 'app-forgot-password-id',
  // 'guide',
]

const PAGE_IGNORE_MIDDLEWARE = ['404', 'terms', 'specified', 'policy', 'guide']

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUser()

  const isAdmin = userStore.roleName === RoleEnum.ADMIN

  const pathRole = to.path.split('/')[2]

  if (PAGE_IGNORE_MIDDLEWARE.includes(to.name as string)) {
    return
  }
  if (!userStore.isAuthenticated) {
    if (PAGE_IGNORE_AUTH.includes(to.name as string)) {
      return
    }
    if (!to.path.includes('/login')) {
      return `/login`
    }
  } else {
    if (to.path.includes('/login')) {
      return `/`
    }
    if (
      (to?.name && to.name === 'index') ||
      (to?.name && to.name === 'admin')
    ) {
      return !isAdmin ? `/analysis` : '/admin/users'
    }
  }
})
