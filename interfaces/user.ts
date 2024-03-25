import { IPlan } from '@/interfaces/plan'
export interface IUserSignUp {
  last_name: string
  first_name: string
  company: string
  phone_number: string
  email: string
  password: string
  password_confirmation: string
}

export interface IUserKeyUpdate {
  api_key: string | null
}

export interface IUserLoginData {
  remember_token?: any
  email: string
  password: string
  role: number | string
}

export interface IUserKey {
  api_key: string
  region_code: string
  relevance_language: string
  user_id: number
}

export interface IUser {
  id?: number | null
  address?: string
  address1?: string
  address2?: string
  address3?: string
  address4?: string
  avatar?: string
  email?: string
  account_type: string | number
  first_name?: string
  first_name_kana?: string
  last_name?: string
  last_name_kana?: string
  status?: string | number
  tel?: string
  zip1?: string
  zip2?: string
  url_avatar?: string
  total_member?: number
  key?: IUserKey | null
  plan: IPlan
  company?: string
  phone_number?: string
  google_api_key_configured: boolean
  child_account_number: number
  region_code: string | null
  relevance_language: string | null
  timezone_name: string | null
  timezone_offset: string | null
}

export interface IUserSubSignUp {
  last_name: string
  first_name: string
  company: string
  phone_number: string
  email: string
}

export interface IUserInfo {
  avatar: string | null | File
  last_name: string
  first_name: string
  company: string | null
  phone_number: string | null
  email: string
}

export interface IAdminUser {
  id: 1
  avatar: string
  full_name: string
  company: string
  email: string
  plan_id: number
  phone_number: string | number
  registration_date: string
  expiry_date: string
  childe: string | number
  last_login_datetime: string
}

export interface IPage {
  count: number
  page_no: number
  page_size: number
  total_page: number
}

export interface ISubAccount {
  id: number
  avatar: string
  full_name: string
  company: string
  email: string
  plan_id: number
  phone_number: string
  search_count: number
  status: number
  registration_date: string
  expiry_date: string
  childe: number
  last_login_datetime: string
}

export interface IDetailSubAccount {
  id: number | string
  avatar: string
  full_name: string
  email: string
  last_login_datetime: string
  phone_number: string | number
  status: number
  block_time: number
  block_datetime: string
}
export interface IDetailAccountParams {
  date_from: string | number
  date_to: string | number
  search_type: string | number
  page_no: number
  page_size: number
}

export interface IUserSetting {
  region_code: string | null
  relevance_language: string | null
  timezone_name: string | null
  timezone_offset: string | null
}

export interface IParamsAPIKey {
  google_access_token?: string
  google_refresh_token?: string | null
  region_code?: string
  relevance_language?: string
  api_key?: string
  handle_action: number
  timezone_name?: string | null
  timezone_offset?: string | null
}
