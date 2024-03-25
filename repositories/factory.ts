import { $Fetch } from 'ohmyfetch'
import { notification } from 'ant-design-vue'
import { CookieKeyEnum } from '@/constants/cookie'
import { useUser } from '@/stores/user'
import { RoleEnum } from '@/constants/role'
import { useCommon } from '@/stores/common'
import { IModalParams } from '@/interfaces/common'

type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

class HttpFactory {
  private $fetch: $Fetch

  constructor(fetcher: $Fetch) {
    this.$fetch = fetcher
  }

  /**
   * method - GET, POST, PUT
   * URL
   **/
  async call<T>(
    method: MethodType,
    url: string,
    data?: object,
    extras = {}
  ): Promise<T> {
    const config = useRuntimeConfig()

    const route = useRoute()

    const commonStore = useCommon()

    const { $modalWarning } = useNuxtApp()

    const token = useCookie(CookieKeyEnum.ACCESS_TOKEN)

    const headersOption = new Headers()

    headersOption.set('Accept', 'application/json')
    if (token.value && !route.path.includes('/login')) {
      headersOption.set('Authorization', token.value as string)
      // headersOption.set('Secure', 'true')
      // headersOption.set('HttpOnly', 'true')
    }

    const navigateToLogin = () => {
      const pathRole = route.path.split('/')[2]

      const token = useCookie(CookieKeyEnum.ACCESS_TOKEN)

      const refreshToken = useCookie(CookieKeyEnum.REFRESH_TOKEN)

      const router = useRouter()

      token.value = null
      refreshToken.value = null
      localStorage.removeItem(CookieKeyEnum.USER_DATA)
      const userStore = useUser()

      userStore.setUser(null)
      if (userStore.roleName === RoleEnum.ADMIN) {
        router.push(`/admin/login`)
      } else {
        router.push(`/login`)
      }
    }

    const $res: T = await this.$fetch(url, {
      method,
      body: data,
      ...extras,
      baseURL: config.public.apiUrl,
      headers: headersOption,
    }).catch(async (e) => {
      // console.log(e?.response);

      // throw e?.response
      if (e?.response?.status === 401) {
        try {
          const { $api } = useNuxtApp()

          const resRefresh = await $api.auth.refreshToken()

          console.log(resRefresh)

          if (resRefresh && resRefresh.data) {
            return await this.call(method, url, data, extras)
          } else {
            commonStore.setLoading(false)
            navigateToLogin()
          }
        } catch (error: any) {
          // console.log('refresh token')
          if (!error?._data.data && error.url.includes('refresh-token')) {
            commonStore.setLoading(false)
            if (error?._data.message) {
              const params: IModalParams = {
                title: useNuxtApp().vueApp.config.globalProperties.$t(
                  'pages.login.heading_modal'
                ),
                content: error?._data.message,
                okText:
                  useNuxtApp().vueApp.config.globalProperties.$t(
                    'pages.login.title'
                  ),
                okType: 'primary',
              }

              notification.destroy()

              const confirm = await $modalWarning(params)

              if (confirm) {
                navigateToLogin()
              }
            } else {
              navigateToLogin()
            }
          }
        }
      } else if (e?.response?.status === 429) {
        const params: IModalParams = {
          title: useNuxtApp().vueApp.config.globalProperties.$t(
            'pages.login.heading_modal'
          ),
          content: e?.response?._data.message,
          okText: 'OK',
          okType: 'primary',
        }

        notification.destroy()

        await $modalWarning(params)
        // $showModal(ModalNameEnum.ALERT_MANY_REQUEST)
      } else {
        // if (
        //   e?.response?.status === 400 &&
        //   e?.response?._data?.error_code === 'facility_expired'
        // ) {
        // }
        throw e?.response
      }
    })

    return $res as T
  }
}

export default HttpFactory
