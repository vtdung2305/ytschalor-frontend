import { defineStore } from 'pinia'
import {
  IUserLoginData,
  IUser,
  IAdminUser,
  IPage,
  ISubAccount,
  IDetailAccountParams,
  IDetailSubAccount,
  IUserSetting,
} from '@/interfaces/user'
import { CookieKeyEnum } from '@/constants/cookie'
import { RoleEnum } from '@/constants/role'
import { PlanEnum } from '@/constants/plan'
import { useResetStore } from '@/utils/useResetStore'
import { LocalStorageCompare } from '@/constants/video'
import { IHistoryItem } from '@/interfaces/history'
import { IPlan } from '@/interfaces/plan'

export const useUser = defineStore('user', {
  state: (): {
    userData: IUser | null
    incorrectEmail: boolean
    listAdminUser: IAdminUser[]
    adminUserPage: IPage | null
    listSubAccount: ISubAccount[]
    subAccountPage: IPage | null
    detailSubAccount: IDetailSubAccount | null
    historyPage: IPage | null
    listHistory: IHistoryItem[]
    statusAddNewAccout: boolean
  } => ({
    userData: null,
    incorrectEmail: false,
    listAdminUser: [],
    adminUserPage: null,
    listSubAccount: [],
    subAccountPage: null,
    detailSubAccount: null,
    historyPage: null,
    listHistory: [],
    statusAddNewAccout: true,
  }),

  actions: {
    /**
     * Login
     * @param params
     */
    async login(params: IUserLoginData) {
      const { $api } = useNuxtApp()

      const response = await $api.auth.login(params)

      // console.log(response)
      if (response && response?.data && response.data?.user) {
        this.userData = response.data?.user

        const token = useCookie(CookieKeyEnum.ACCESS_TOKEN, {
          maxAge: 1296000,
        })

        const refreshToken = useCookie(CookieKeyEnum.REFRESH_TOKEN, {
          maxAge: 1296000,
        })

        refreshToken.value = response.data.refresh_token

        token.value =
          response.data.token_type + ' ' + response.data.access_token

        localStorage.setItem(
          CookieKeyEnum.USER_DATA,
          JSON.stringify(this.userData)
        )
      }
    },

    /**
     * Logout
     */
    async logout() {
      try {
        const { $api } = useNuxtApp()

        await $api.auth.logout().finally(() => {
          const token = useCookie(CookieKeyEnum.ACCESS_TOKEN)

          const refreshToken = useCookie(CookieKeyEnum.REFRESH_TOKEN)

          token.value = null
          refreshToken.value = null
          this.userData = null
          localStorage.removeItem(CookieKeyEnum.USER_DATA)
          localStorage.removeItem(LocalStorageCompare.LIST_VIDEO_COMPARE)
          const resetStore = useResetStore()

          // Reset all stores
          resetStore.all()
        })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * Set user data
     * @param user
     */
    setUser(user: IUser | null) {
      this.userData = user
    },

    /**
     * Set plan user data
     * @param planInfo
     */
    setPlanUser(planInfo: IPlan) {
      if (this.userData) {
        this.userData.plan = planInfo
        localStorage.setItem(
          CookieKeyEnum.USER_DATA,
          JSON.stringify(this.userData)
        )
      }
    },

    async getListAdminUsers(pageNo: number, pageSize: number, planId: number) {
      try {
        const { $api } = useNuxtApp()

        const res = await $api.user.getListAdminUsers(pageNo, pageSize, planId)

        if (res && res.data) {
          this.listAdminUser = res.data
          this.adminUserPage = res.pages
        }
      } catch (error) {
        throw { message: error }
      }
    },

    async getListSubAccount(pageNo: number, pageSize: number) {
      try {
        const { $api } = useNuxtApp()

        const res = await $api.user.getListSubAccount(pageNo, pageSize)

        if (res && res.data) {
          this.listSubAccount = res.data
          this.subAccountPage = res.pages
          this.statusAddNewAccout = res.includes?.is_can_add_new_member
        }
      } catch (error) {
        throw { message: error }
      }
    },

    async getDetaillSubAccount(
      id: string | number,
      params: IDetailAccountParams
    ) {
      try {
        const { $api } = useNuxtApp()

        const res = await $api.user.getDetaillSubAccount(id, params)

        if (res && res.data) {
          this.detailSubAccount = res.includes?.user
          this.historyPage = res.pages
          this.listHistory = res.data
        }
      } catch (error) {
        throw { message: error }
      }
    },

    setStatusAddNewAccout(status: boolean) {
      this.statusAddNewAccout = status
    },
    removedetailSubAccount() {
      this.detailSubAccount = null
    },
    setStatusListSubAccount(id: number | string, status: number) {
      const objIndex = this.listSubAccount.findIndex((obj) => obj.id === id)

      this.listSubAccount[objIndex].status = status
    },

    /**
     * Update Google api key
     * @param api {Boolean}
     */
    updateUserAPI(api: boolean) {
      if (this.userData) {
        this.userData.google_api_key_configured = api

        localStorage.setItem(
          CookieKeyEnum.USER_DATA,
          JSON.stringify(this.userData)
        )
      }
    },

    /**
     * Update user info search setting
     * @param userInfo {IUserSetting}
     */
    updateUserSearchSetting(userInfo: IUserSetting) {
      if (this.userData) {
        this.userData.region_code = userInfo.region_code
        this.userData.relevance_language = userInfo.relevance_language
        this.userData.timezone_name = userInfo.timezone_name
        this.userData.timezone_offset = userInfo.timezone_offset

        localStorage.setItem(
          CookieKeyEnum.USER_DATA,
          JSON.stringify(this.userData)
        )
      }
    },
  },

  getters: {
    /**
     * isAuthenticated
     * @param state
     * @returns {Boolean}
     */
    isAuthenticated: (state): Boolean =>
      !!state.userData && !!state.userData.id,

    /**
     * Role name
     * @param state
     * @returns {String}
     */
    roleName: (state): String | undefined => {
      switch (state.userData?.account_type) {
        case RoleEnum.ADMIN_ID:
          return RoleEnum.ADMIN
        case RoleEnum.PARENT_ID:
          return RoleEnum.PARENT
        case RoleEnum.CHILDREN_ID:
          return RoleEnum.CHILDREN
        default:
          break
      }
    },

    /**
     * Plan name
     * @param state
     * @returns
     */
    planType: (state): String | undefined => {
      switch (state.userData?.plan?.plan_type) {
        case PlanEnum.FREE:
          return PlanEnum.FREE
        case PlanEnum.PERSONAL:
          return PlanEnum.PERSONAL
        case PlanEnum.TEAM:
          return PlanEnum.TEAM
        default:
          break
      }
    },
  },
})
