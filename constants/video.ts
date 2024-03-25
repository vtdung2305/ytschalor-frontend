import { useI18n } from 'vue-i18n'
import { IItemObject } from '@/interfaces/common'
import { IFilterChannelVideo, IVideoItem } from '@/interfaces/video'

export enum PeriodSpecificationEnum {
  OPTION = 1,
  PAST_7_DAY = 7,
  PAST_14_DAY = 14,
  PAST_MONTH = 30,
}

export enum FilterTabEnum {
  FILTER_ZERO = 0,
  FILTER_ONE = 1,
  FILTER_TWO = 2,
  FILTER_THREE = 3,
  FILTER_FOUR = 4,
  FILTER_FIVE = 5,
}

export const PeriodSpecificationLists: IItemObject[] = [
  {
    value: PeriodSpecificationEnum.OPTION,
    label: 'components.specification_list.option',
  },
  {
    value: PeriodSpecificationEnum.PAST_7_DAY,
    label: 'components.specification_list.past_7_day',
  },
  {
    value: PeriodSpecificationEnum.PAST_14_DAY,
    label: 'components.specification_list.past_14_day',
  },
  {
    value: PeriodSpecificationEnum.PAST_MONTH,
    label: 'components.specification_list.past_month',
  },
]

export const CoefficientLists: IItemObject[] = [
  {
    value: 'video_detail.viewCount',
    label: 'components.sort_video.number_of_view',
  },
  {
    value: 'video_detail.likeCount',
    label: 'components.sort_video.number_of_ratings',
  },
  {
    value: 'coefficient',
    label: 'components.sort_video.coefficient',
  },
  {
    value: 'channel_detail.publishedAt',
    label: 'components.sort_video.opening_date',
  },
  {
    value: 'channel_detail.subscriberCount',
    label: 'components.sort_video.number_of_subscribers',
  },
]

export const FilterConstChannelVideo: IFilterChannelVideo = {
  ALL_CHANNEL: [],
  ONE_CHANNEL: [50000],
  TWO_CHANNEL: [40000, 49999],
  THREE_CHANNEL: [30000, 39999],
  FOUR_CHANNEL: [10000, 29999],
  FIVE_CHANNEL: [10000],
}

export const PeriodLists: IItemObject[] = [
  {
    value: null,
    label: 'components.period_list.please_select',
  },
  {
    value: '1y',
    label: 'components.period_list.one_year',
  },
  {
    value: '3y',
    label: 'components.period_list.three_year',
  },
  {
    value: '5y',
    label: 'components.period_list.five_year',
  },
]

export enum LocalStorageCompare {
  LIST_VIDEO_COMPARE = 'list_video_compare',
}

export const VideoDataSample: IVideoItem[] = [
  {
    videoId: 'eISomx-VMow',
    channelId: 'UCaO6TYtlC8U5ttz62hTrZgg',
    channelTitle: 'JYP Entertainment',
    title: 'GOT7 &quot;A&quot; M/V',
    description:
      'GOT7(\uAC13\uC138\uBE10) "A" M/V Download GOT7 2nd Mini Album "GOT\u2661" on iTunes: https://itunes.apple.com/album/got-love/id892276874 ...',
    thumbnail: {
      default: 'https://i.ytimg.com/vi/eISomx-VMow/default.jpg',
      medium: 'https://i.ytimg.com/vi/eISomx-VMow/mqdefault.jpg',
      high: 'https://i.ytimg.com/vi/eISomx-VMow/hqdefault.jpg',
    },
    video_detail: {
      publishedAt: '2014-06-23T03:00:35Z',
      viewCount: 124526444,
      likeCount: 1388093,
      favoriteCount: 0,
      commentCount: 84731,
    },
    channel_detail: {
      publishedAt: '2008-01-25T07:45:44Z',
      viewCount: 21247291454,
      subscriberCount: 28400000,
      hiddenSubscriberCount: false,
      videoCount: 1963,
    },
    details: {
      id: 'eISomx-VMow',
      publishedAt: '2014-06-23T03:00:35Z',
      title: 'GOT7 "A" M/V',
      description:
        'GOT7(\uAC13\uC138\uBE10) "A" M/V\n\nDownload GOT7 2nd Mini Album "GOT\u2661" on iTunes:\nhttps://itunes.apple.com/album/got-love/id892276874\n\nGOT7 Official Facebook: http://www.facebook.com/GOT7Official\nGOT7 Official Twitter: http://www.twitter.com/GOT7Official\nGOT7 Official Fan\'s: http://fans.jype.com\nGOT7 Official Homepage: http://got7.jype.com\n\nCopyrights 2014 \u24D2 JYP Entertainment. All Rights Reserved.',
      channelTitle: 'JYP Entertainment',
      channelId: 'UCaO6TYtlC8U5ttz62hTrZgg',
      categoryId: '10',
      defaultAudioLanguage: 'en',
      tags: [
        "GOT7 'A' M/V",
        'GOT7 A M/V',
        'GOT7 A Music Video',
        'GOT7 A \uBBA4\uC9C1 \uBE44\uB514\uC624',
        'GOT7 A \uBBA4\uC9C1\uBE44\uB514\uC624',
        'GOT7 A \uBBA4\uBE44',
        'GOT7 \uC5D0\uC774 \uBBA4\uC9C1\uBE44\uB514\uC624',
        'GOT7 \uC5D0\uC774 M/V',
        '\uAC13\uC138\uBE10 A M/V',
        '\uAC13\uC138\uBE10 A Music Video',
        '\uAC13\uC138\uBE10 A \uBBA4\uC9C1 \uBE44\uB514\uC624',
        '\uAC13\uC138\uBE10 A \uBBA4\uC9C1\uBE44\uB514\uC624',
        '\uAC13\uC138\uBE10 \uC5D0\uC774 \uBBA4\uC9C1\uBE44\uB514\uC624',
        '\uAC13\uC138\uBE10 A \uBBA4\uBE44',
        'GOT\u2661',
        'GOT7',
        '\uAC13\uC138\uBE10',
        '\uC5D0\uC774',
        'GOT7 A',
        '\uAC13\uC138\uBE10 \uC5D0\uC774',
        'JB',
        'Jr.',
        'Mark',
        'Jackson',
        'Youngjae',
        'Yugyeom',
        'BamBam',
        '\uC7AC\uBC94',
        '\uC9C4\uC601',
        '\uC8FC\uB2C8\uC5B4',
        'Junior',
        '\uC7AD\uC2A8',
        '\uB9C8\uD06C',
        '\uC720\uACB8',
        '\uBC40\uBC40',
        '\uC601\uC7AC',
        '\uAC13\uC138\uBE10 \uBBA4\uC9C1\uBE44\uB514\uC624',
        'GOT7 Music Video',
        'A Music Video',
        '\uC5D0\uC774 \uBBA4\uC9C1\uBE44\uB514\uC624',
        '\uAC13\uC138\uBE10 A',
        '\uAC13\uC138\uBE10 a',
        '\uAC13\uC138\uBE10 a M/V',
      ],
      viewCount: 124526444,
      likeCount: 1388093,
      favoriteCount: 0,
      commentCount: 84731,
      thumbnail: {
        default: 'https://i.ytimg.com/vi/eISomx-VMow/default.jpg',
        medium: 'https://i.ytimg.com/vi/eISomx-VMow/mqdefault.jpg',
        high: 'https://i.ytimg.com/vi/eISomx-VMow/hqdefault.jpg',
      },
      topicDetails: [],
      coefficient: 0,
    },
    coefficient: 4.38,
  },
  {
    videoId: 'vA9S_KC38wM',
    channelId: 'UCEc1YzMOSKKtJD7H-q71HgQ',
    channelTitle: 'Creepy Nuts',
    title: '\u3010Lyric Video\u3011Creepy Nuts - \u53CB\u4EBAA',
    description:
      'Listen to Creepy Nuts : https://smar.lnk.to/0RtVJj \u25FE\uFE0FConnect with Creepy Nuts TikTok - https://www.tiktok.com/@creepy_nuts_ ...',
    thumbnail: {
      default: 'https://i.ytimg.com/vi/vA9S_KC38wM/default.jpg',
      medium: 'https://i.ytimg.com/vi/vA9S_KC38wM/mqdefault.jpg',
      high: 'https://i.ytimg.com/vi/vA9S_KC38wM/hqdefault.jpg',
    },
    video_detail: {
      publishedAt: '2023-04-13T11:00:11Z',
      viewCount: 1939070,
      likeCount: 34186,
      favoriteCount: 0,
      commentCount: 912,
    },
    channel_detail: {
      publishedAt: '2014-11-25T11:42:08Z',
      viewCount: 420445396,
      subscriberCount: 776000,
      hiddenSubscriberCount: false,
      videoCount: 88,
    },
    details: {
      id: 'eISomx-VMow',
      publishedAt: '2014-06-23T03:00:35Z',
      title: 'GOT7 "A" M/V',
      description:
        'GOT7(\uAC13\uC138\uBE10) "A" M/V\n\nDownload GOT7 2nd Mini Album "GOT\u2661" on iTunes:\nhttps://itunes.apple.com/album/got-love/id892276874\n\nGOT7 Official Facebook: http://www.facebook.com/GOT7Official\nGOT7 Official Twitter: http://www.twitter.com/GOT7Official\nGOT7 Official Fan\'s: http://fans.jype.com\nGOT7 Official Homepage: http://got7.jype.com\n\nCopyrights 2014 \u24D2 JYP Entertainment. All Rights Reserved.',
      channelTitle: 'JYP Entertainment',
      channelId: 'UCaO6TYtlC8U5ttz62hTrZgg',
      categoryId: '10',
      defaultAudioLanguage: 'en',
      tags: [
        "GOT7 'A' M/V",
        'GOT7 A M/V',
        'GOT7 A Music Video',
        'GOT7 A \uBBA4\uC9C1 \uBE44\uB514\uC624',
        'GOT7 A \uBBA4\uC9C1\uBE44\uB514\uC624',
        'GOT7 A \uBBA4\uBE44',
        'GOT7 \uC5D0\uC774 \uBBA4\uC9C1\uBE44\uB514\uC624',
        'GOT7 \uC5D0\uC774 M/V',
        '\uAC13\uC138\uBE10 A M/V',
        '\uAC13\uC138\uBE10 A Music Video',
        '\uAC13\uC138\uBE10 A \uBBA4\uC9C1 \uBE44\uB514\uC624',
        '\uAC13\uC138\uBE10 A \uBBA4\uC9C1\uBE44\uB514\uC624',
        '\uAC13\uC138\uBE10 \uC5D0\uC774 \uBBA4\uC9C1\uBE44\uB514\uC624',
        '\uAC13\uC138\uBE10 A \uBBA4\uBE44',
        'GOT\u2661',
        'GOT7',
        '\uAC13\uC138\uBE10',
        '\uC5D0\uC774',
        'GOT7 A',
        '\uAC13\uC138\uBE10 \uC5D0\uC774',
        'JB',
        'Jr.',
        'Mark',
        'Jackson',
        'Youngjae',
        'Yugyeom',
        'BamBam',
        '\uC7AC\uBC94',
        '\uC9C4\uC601',
        '\uC8FC\uB2C8\uC5B4',
        'Junior',
        '\uC7AD\uC2A8',
        '\uB9C8\uD06C',
        '\uC720\uACB8',
        '\uBC40\uBC40',
        '\uC601\uC7AC',
        '\uAC13\uC138\uBE10 \uBBA4\uC9C1\uBE44\uB514\uC624',
        'GOT7 Music Video',
        'A Music Video',
        '\uC5D0\uC774 \uBBA4\uC9C1\uBE44\uB514\uC624',
        '\uAC13\uC138\uBE10 A',
        '\uAC13\uC138\uBE10 a',
        '\uAC13\uC138\uBE10 a M/V',
      ],
      viewCount: 124526444,
      likeCount: 1388093,
      favoriteCount: 0,
      commentCount: 84731,
      thumbnail: {
        default: 'https://i.ytimg.com/vi/eISomx-VMow/default.jpg',
        medium: 'https://i.ytimg.com/vi/eISomx-VMow/mqdefault.jpg',
        high: 'https://i.ytimg.com/vi/eISomx-VMow/hqdefault.jpg',
      },
      topicDetails: [],
      coefficient: 0,
    },
    coefficient: 2.5,
  },
]

export enum ErrorCodeEnum {
  RATE_SEARCH_LIMIT_EXCEEDED = 'RATE_SEARCH_LIMIT_EXCEEDED',
  CSV_EXPORT_FORBIDDEN = 'CSV_EXPORT_FORBIDDEN',
  VIEW_SEARCH_HISTORY_FORBIDDEN = 'VIEW_SEARCH_HISTORY_FORBIDDEN',
  SUGGESTION_KEYWORD_LIMIT_EXCEEDED = 'SUGGESTION_KEYWORD_LIMIT_EXCEEDED',
  TOOL_SUGGESTION_KEYWORD_LIMIT_EXCEEDED = 'TOOL_SUGGESTION_KEYWORD_LIMIT_EXCEEDED',
  TRENDS_REQUEST_LIMIT_EXCEEDED = 'TRENDS_REQUEST_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED_DAY = 'QUOTA_EXCEEDED_DAY',
  EXPIRY_PLAN = 'EXPIRY_PLAN',
  API_KEY_INVALID = 'API_KEY_INVALID',
}

export const ErrorCode = [
  ErrorCodeEnum.RATE_SEARCH_LIMIT_EXCEEDED,
  ErrorCodeEnum.CSV_EXPORT_FORBIDDEN,
  ErrorCodeEnum.VIEW_SEARCH_HISTORY_FORBIDDEN,
  ErrorCodeEnum.SUGGESTION_KEYWORD_LIMIT_EXCEEDED,
  ErrorCodeEnum.TOOL_SUGGESTION_KEYWORD_LIMIT_EXCEEDED,
  ErrorCodeEnum.TRENDS_REQUEST_LIMIT_EXCEEDED,
  ErrorCodeEnum.QUOTA_EXCEEDED_DAY,
  ErrorCodeEnum.EXPIRY_PLAN,
]
