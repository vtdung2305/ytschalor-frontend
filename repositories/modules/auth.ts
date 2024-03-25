import HttpFactory from '../factory'
import { IUserLoginData, IUserSignUp } from '@/interfaces/user'
import { CookieKeyEnum } from '@/constants/cookie'

class AuthModule extends HttpFactory {
  private config = useRuntimeConfig()

  async signup(credentials: IUserSignUp): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'POST',
      `${this.config.public.apiVer}/signup`,
      credentials
    )
  }

  async login(credentials: IUserLoginData): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/login`,
      credentials
    )
  }

  async logout(): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/logout`
    )
  }

  async activate(token: string): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/activate/${token}`
    )
  }

  async refreshToken(): Promise<Object | null | any> {
    const refreshToken = useCookie(CookieKeyEnum.REFRESH_TOKEN)

    const params = {
      refresh_token: refreshToken.value,
    }

    const res = await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/refresh-token`,
      params
    )

    if (res && res.data) {
      const token = useCookie(CookieKeyEnum.ACCESS_TOKEN, {
        maxAge: 1296000,
      })

      const refreshToken = useCookie(CookieKeyEnum.REFRESH_TOKEN, {
        maxAge: 1296000,
      })

      refreshToken.value = res.data.refresh_token
      token.value = res.data.token_type + ' ' + res.data.access_token
    }

    return res
  }

  async forgotPassword(credentials: {
    email: string
  }): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/forgot-password`,
      credentials
    )
  }

  async checkExpiration(token: string): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/password-reset/check-expiration/${token}`
    )
  }

  async resetPassword(
    token: string,
    params: {
      password: string
      password_confirmation: string
    }
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/reset-password/${token}`,
      params
    )
  }
}

export default AuthModule
