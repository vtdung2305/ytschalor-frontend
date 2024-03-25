import { LocationQueryValue } from 'vue-router'
import { IRangeValue } from '@/interfaces/common'
import { IChannelVideo } from '@/interfaces/channel'

export interface IFormSearchParams {
  keyword: string | null | LocationQueryValue[]
  coefficient: number | string
  specification?: string | number | null
  periodOfTime?: string[] | string | null
  date_from: string | null
  date_to: string | null
}

export interface IPeriodSpecification {
  id: number | string
  name: string
}

export type SortOrder = 'asc' | 'desc'

export interface IFormSortVideo {
  sort_type: string
  order: SortOrder
  checked: boolean
  filter: number[]
}

// export interface IVideoItem {
//   title_video: string
//   number_of_views: number
//   post_date: string
//   high_rating: string | number
//   number_of_comments: number
//   channel_name: string
//   number_of_registrants: number
//   number_of_videos: number
//   total_number_of_views: number
//   oppening_date: string
// }

export interface IVideoParams {
  keyword: string | null
  coefficient: number
  date_from: string
  date_to: string
}

export interface IVideoDetail {
  publishedAt: string | null
  viewCount: string | null | number
  likeCount: string | null | number
  favoriteCount: string | null | number
  commentCount: string | null | number
}

export interface IThumbnailVideo {
  default: string | null
  medium: string | null
  high: string | null
}

export interface IKeywordAnalysis {
  count: number
  keyword: string
  type: string
}

export interface IVideoInfo {
  id: string | null
  publishedAt: string
  title: string | null
  description: string | null
  channelTitle: string | null
  channelId: string | null
  categoryId: string | number | null
  defaultAudioLanguage: string | null
  tags: string[]
  viewCount: string | number | null
  likeCount: string | number | null
  favoriteCount: string | number | null
  commentCount: string | number | null
  thumbnail: IThumbnailVideo
  coefficient: number
  category_title?: string | null
  titleLists?: IKeywordAnalysis[]
  descriptionLists?: IKeywordAnalysis[]
  registrants?: number
  topicDetails: string[]
}

export interface IVideoItem {
  videoId: string | null
  channelId: string | null
  channelTitle: string | null
  title: string | null
  description: string | null
  thumbnail: IThumbnailVideo
  video_detail: IVideoDetail
  channel_detail: IChannelVideo
  coefficient: number
  details: IVideoInfo
}

export interface IVideoIncludes {
  average_number_of_coefficient: number
  average_number_of_views: number
  number_video_have_greater_tha_coefficient: number
}

export interface IFilterChannelVideo {
  ALL_CHANNEL: number[]
  ONE_CHANNEL: number[]
  TWO_CHANNEL: number[]
  THREE_CHANNEL: number[]
  FOUR_CHANNEL: number[]
  FIVE_CHANNEL: number[]
}
