import { IItemObject } from '@/interfaces/common'

export const LIMIT_ALL = 0

export enum MasterSite {
  logo_src = '/images/logo.png',
  channel_default = '/images/channel-default.png',
  channel_default_2 = '/images/channel-default-2.png',
  img_development = '/images/img_development.png',
  NoImageMiddle = '/images/no-image-m.png',
  NoImageLarge = '/images/no-image-l.png',
  icon_link = '/images/icon-link.svg',
  delete_item = '/images/delete_item.png',
  default_avatar = '/images/default-avatar.png',
  icon_note = '/images/icon-note.svg',
  icon_delete_item = '/images/icon-delete-item.png',
  avatar_default = '/images/avatar-default.png',
  icon_edit = '/images/icon-edit.png',
  icon_note_withdrawal = '/images/icon-note-withdrawal.svg',
  icon_note_modal = '/images/icon-note-modal.svg',
  icon_help = '/images/icon-help.png',
  icon_close = '/images/icon-close.svg',
  google_image_instruction = '/images/google_image.png',
  plan_free = '/images/plan-free.svg',
  icon_hide = '/images/icon-hide.svg',
  icon_show = '/images/icon-show.svg',
  plan_personal = '/images/plan-personal.svg',
  plan_team = '/images/plan-team.svg',
}

export const REGEX_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/

export const REGEX_COEFFICIENT = /^[+-]?([0-9]*[.])?[0-9]+$/

export const REGEX_LOWER_LIMIT = /^\d+$/

export enum RecaptchaV2State {
  Init = 'init',
  Verified = 'verified',
  Expired = 'expired',
  Error = 'error',
}

export enum TitleLoading {
  LoadingList = 'components.loading.loading_list',
  LoadingRegistration = 'components.loading.loading_registration',
  LoadingTrend = 'components.loading.loading_trend',
}

export const SortOrders: IItemObject[] = [
  {
    value: 'asc',
    label: 'components.sort.ascending_order',
  },
  {
    value: 'desc',
    label: 'components.sort.descending_order',
  },
]

export enum FormatDateEnum {
  FORMAT_NORMAL = 'YYYY年MM月DD日',
  FORMAT_YEAR_MONTH = 'YYYY年MM月',
  FORMAT_MONTH_DAY = 'MM月DD日',
  FORMAT_YEAR_MONTH_DAY_TIME = 'YYYY年MM月DD日 HH時mm分',
  FORMAT_YEAR_MONTH_DAY_TIME_MINUSES = 'YYYY年MM月DD日 HH時mm分ss秒',
  FORMAT_DATE = 'YYYY/MM/DD',
  FORMAT_DATE_PARAMS = 'YYYY-MM-DD',
}

export enum PaginationEnum {
  PAGE = 1,
  PER_PAGE = 10,
}

export enum SearchTypeEnum {
  SEARCH_ALL = 'search_all',
  SEARCH_VIDEO = 'search_video',
  SEARCH_CHANNEL = 'search_channel',
}

export enum TabTypeEnum {
  VIDEO = 'video',
  CHANNEL = 'channel',
}

export enum GoogleTypeEnum {
  MANUAL = 0,
  AUTO = 1,
  DELETE = 2,
}

export const GoogleOptions: IItemObject[] = [
  {
    value: GoogleTypeEnum.AUTO,
    label: 'pages.user_setting.google_auto',
  },
  {
    value: GoogleTypeEnum.MANUAL,
    label: 'pages.user_setting.google_manual',
  },
]

export enum PlanPriceEnum {
  FREE = 0,
  PERSONAL = 10000,
  TEAM = 45000,
}

export enum WordChartFontSizeEnum {
  LARGE = 12,
  MEDIUM = 7,
  SMALL = 2,
}

export const SCOPE_GOOGLE: string =
  'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/service.management https://www.googleapis.com/auth/cloud-platform'
