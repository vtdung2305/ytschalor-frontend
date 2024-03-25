export interface IFilterSearchChannel {
  keyword: string
  order: string
  periodOfTime?: [string, string] | null
  periodSpecification?: string
  coefficient: string | number
  coefficient_view: string | number
}

export interface IFilterSortChannel {
  key: string
  order: string
  checked: boolean
}

export interface IParamsSearchChannel {
  keyword: string
  order: string
  date_from: string
  date_to: string
}

export interface IThumbnailChannel {
  default: string
  high: string
  medium: string
}

export interface IChannel {
  id: string
  title: string
  description: string
  customUrl: string
  publishedAt: string
  country: string
  viewCount: string | number
  subscriberCount: string | number
  hiddenSubscriberCount: boolean
  videoCount: string | number
  thumbnail: IThumbnailChannel
  coefficient: number
}

export interface IChannelVideo {
  publishedAt: string | null
  viewCount: number
  subscriberCount: number
  hiddenSubscriberCount: boolean
  videoCount: number
}
export interface IChannelBranding {
  country: string
  description: string
  image: string
  keywords: string
  title: string
}

export interface IChannelDetail {
  branding?: IChannelBranding
  coefficient: number | string
  country: string
  customUrl: string
  description: string
  hiddenSubscriberCount: boolean
  id: string
  publishedAt: string
  subscriberCount: string | number
  thumbnail: IThumbnailChannel
  title: string
  videoCount: string | number
  viewCount: string | number
}

export interface IVideoByChannelParams {
  channel_id: string
  coefficient: number
  date_from: string
  date_to: string
}

export interface IChannelIncludes {
  average_number_of_coefficient: number
  average_number_of_views: number
  number_channel_have_greater_than_coefficient: number
}
