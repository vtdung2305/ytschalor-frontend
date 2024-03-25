import HttpFactory from '../factory'
import {
  IUserSubSignUp,
  IUserInfo,
  IDetailAccountParams,
} from '@/interfaces/user'
import { IHistoryParams } from '@/interfaces/history'
import { serialize } from '@/helper/common'
import { useUser } from '@/stores/user'

class UserModule extends HttpFactory {
  private config = useRuntimeConfig()

  async updateGoogleApiKey(credentials: {
    api_key: string
    region_code: string
    relevance_language: string
  }): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'POST',
      `${this.config.public.apiVer}/user-settings`,
      credentials
    )
  }

  async createSubAccount(
    credentials: IUserSubSignUp
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'POST',
      `${this.config.public.apiVer}/create-sub-account`,
      credentials
    )
  }

  async editUserInfo(credentials: IUserInfo): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'PUT',
      `${this.config.public.apiVer}/edit-user-info`,
      credentials
    )
  }

  async getListAdminUsers(
    pageNo: number,
    pageSize: number,
    planId: number
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/admin/users?page_no=${pageNo}&page_size=${pageSize}&plan_id=${planId}`
    )
  }

  async getKeywordHistory(
    params: IHistoryParams
  ): Promise<Object | null | any> {
    const userStore = useUser()

    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/keyword-search-history/${userStore.userData?.id}?`,
      undefined,
      {
        params: {
          ...params,
        },
      }
    )
  }

  async getListSubAccount(
    pageNo: number,
    pageSize: number
  ): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/list-sub-account?page_no=${pageNo}&page_size=${pageSize}`
    )
  }

  async getDetaillSubAccount(
    id: string | number,
    params: IDetailAccountParams
  ): Promise<Object | null | any> {
    const userStore = useUser()

    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/keyword-search-history/${id}?`,
      undefined,
      {
        params: {
          ...params,
        },
      }
    )
  }

  async changeStatusAccount(
    id: number | string,
    params: {
      status: string | number
    }
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'PATCH',
      `${this.config.public.apiVer}/change-status-user/${id}`,
      params
    )
  }

  async changePassword(params: {
    old_password: string
    password: string
    password_confirmation: string
  }): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'PATCH',
      `${this.config.public.apiVer}/change-password`,
      params
    )
  }

  async changePlan(params: { plan_id: number }): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'PUT',
      `${this.config.public.apiVer}/users/change-plan`,
      params
    )
  }

  async cancelAccount(isDeleteAll: number): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/cancel-account?is_delete_all=${isDeleteAll}`
    )
  }

  async confirmPassword(params: {
    password: string
  }): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/confirm-password`,
      params
    )
  }

  async settingKey(credentials: {
    google_access_token: string
    google_refresh_token: string
    region_code: string
    relevance_language: string
    api_key: string
    handle_action: number
  }): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/auth/callback`,
      credentials
    )
  }

  async verifyPaymentPlan(transactionId: string): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/users/verify-update-plan/${transactionId}`
    )
  }
}

export default UserModule
