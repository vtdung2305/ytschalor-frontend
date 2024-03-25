import { SmileOutlined, FrownOutlined } from '@ant-design/icons-vue'
import { notification, Button } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { h, ComputedRef } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { MasterSite, FormatDateEnum } from '@/constants/common'
import { useCommon } from '@/stores/common'
import { INotification } from '@/interfaces/common'
import { useUser } from '@/stores/user'
import { PlanEnum } from '@/constants/plan'
import { RoleEnum } from '@/constants/role'

dayjs.extend(timezone)
dayjs.extend(utc)
// dayjs.tz.setDefault('Asia/Tokyo')

export const useHelper = () => {
  const getImageUrlLogo = computed(() => {
    return MasterSite.logo_src
  })

  const { t } = useI18n()

  const commonStore = useCommon()

  const userStore = useUser()

  const isLoading = computed(() => commonStore.isLoading)

  const isLoadingDrawer = computed(() => commonStore.isLoadingDrawer)

  const setLoading = (val: boolean, tip?: string) => {
    commonStore.setLoading(val, tip)
  }

  const setLoadingDrawer = (val: boolean, tip?: string) => {
    commonStore.setLoadingDrawer(val, tip)
  }

  const showNotification = async (params: INotification) => {
    return await new Promise((resolve, reject) => {
      const key = `open${Date.now()}`

      notification.config({
        duration: params.duration || 0,
      })

      const notificationParams = {
        message: params.message
          ? params.message
          : params.status
          ? t('components.notification.message_success')
          : t('components.notification.message_error'),
        description: params.description || null,
        key,
        onClose: () => {
          resolve(false)
        },
      }

      if (params.icon) {
        Object.assign(notificationParams, {
          icon: () =>
            params.status
              ? h(SmileOutlined, { style: 'color: #1890FF' })
              : h(FrownOutlined, { style: 'color: #FF4D4F' }),
        })
      }

      if (params.btn) {
        Object.assign(notificationParams, {
          btn: () =>
            h(
              Button,
              {
                type: 'primary',
                size: 'small',
                onClick: () => {
                  notification.close(key)
                  resolve(true)
                },
              },
              { default: () => params.btn }
            ),
        })
      }

      notification.open(notificationParams)
    })
  }

  const getFullName = (
    lastName: string | null | undefined,
    firstName: string | null | undefined
  ): string => {
    if (lastName || firstName) {
      return `${lastName || ''} ${firstName || ''}`
    }

    return ''
  }

  const serialize = (params: any, prefix?: string): string => {
    const query = Object.keys(params).map((key) => {
      const value = params[key]

      if (params.constructor === Array) key = `${prefix}[]`
      else if (params.constructor === Object)
        key = prefix ? `${prefix}[${key}]` : key

      if (typeof value === 'object') return serialize(value, key)
      else return `${key}=${encodeURIComponent(value)}`
    })

    return query.join('&')
  }

  const notificationDeveloping = () => {
    const params = {
      description: t('others.noti_development'),
      duration: 4.5,
      icon: true,
      status: false,
    }

    showNotification(params as INotification)
  }

  const userName = computed(() => {
    return userStore.userData
      ? getFullName(userStore.userData.last_name, userStore.userData.first_name)
      : t('others.empty')
  })

  const hasApiKey = computed(() => {
    return userStore.userData && userStore.userData?.google_api_key_configured
  })

  const currentDate = computed(() => dayjs().format(FormatDateEnum.FORMAT_DATE))

  const isAdmin = computed((): boolean => userStore.roleName === RoleEnum.ADMIN)

  const isChildren = computed(
    (): boolean => userStore.roleName === RoleEnum.CHILDREN
  )

  const isPlanFree = computed(
    (): boolean => userStore.planType === PlanEnum.FREE
  )

  const isPlanPersonal = computed(
    () => userStore.planType === PlanEnum.PERSONAL
  )

  const isPlanTeam = computed(() => userStore.planType === PlanEnum.TEAM)

  const childAccountNumber = computed(
    () => userStore.userData?.child_account_number
  )

  const subtractDate = (date: any, num: number): string => {
    return dayjs(date).subtract(num, 'day').format(FormatDateEnum.FORMAT_DATE)
  }

  const formatDate = (date: string, format?: string) => {
    if (format) {
      return dayjs.tz(date).format(format)
    }

    return dayjs.tz(date).format(FormatDateEnum.FORMAT_NORMAL)
  }

  const convertKeyword = (keyword: string) => {
    const withoutQuotes: string = keyword.slice(1, -1)

    return withoutQuotes.replace(/("\s+"|"\s|")/g, ', ')
  }

  return {
    getImageUrlLogo,
    isLoading,
    isLoadingDrawer,
    isPlanFree,
    isPlanPersonal,
    isPlanTeam,
    isAdmin,
    isChildren,
    getFullName,
    setLoading,
    setLoadingDrawer,
    showNotification,
    userName,
    hasApiKey,
    currentDate,
    subtractDate,
    serialize,
    formatDate,
    notificationDeveloping,
    convertKeyword,
    childAccountNumber,
  }
}
