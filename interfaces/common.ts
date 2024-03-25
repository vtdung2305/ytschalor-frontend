import type { Dayjs } from 'dayjs'
export interface IParamsPagination {
  count?: string | number | null
  page_no?: string | number | null
  page_size?: string | number | null
  total_page?: string | number | null
}

export interface ILoading {
  isLoading?: boolean
  titleLoading?: string
  isLoadingDrawer?: boolean
  titleLoadingDrawer?: string
}
export interface IThemesData {
  borderRadius?: number
  colorPrimary?: string
  colorBgLayout?: string
}
export interface IItemObject {
  value: string | number | null | undefined
  label: string
  disabled?: boolean
}

export interface INotification {
  message: string | null
  description: string | null
  status?: boolean | null | undefined
  btn: string
  duration: number | undefined
  icon?: boolean | undefined
}

export interface IModalParams {
  title?: string | null
  content?: string | null
  okText?: string | null
  okType: string
  cancelText?: string | null
}

export type IRangeValue = [Dayjs, Dayjs]

export interface ISuggestion {
  value: number
  label: string
}
