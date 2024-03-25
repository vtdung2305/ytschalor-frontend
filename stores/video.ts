import { defineStore } from 'pinia'
import orderBy from 'lodash/orderBy'
import cloneDeep from 'lodash/cloneDeep'
import {
  IVideoItem,
  IVideoParams,
  IVideoIncludes,
  IFormSortVideo,
  IVideoInfo,
  IFormSearchParams,
} from '@/interfaces/video'
import {
  PeriodSpecificationEnum,
  FilterConstChannelVideo,
} from '@/constants/video'

import { filterChannelVideo } from '@/utils/video'

export const useVideo = defineStore('video', {
  state: (): {
    videoStorageLists: IVideoItem[]
    videoLists: IVideoItem[]
    videoIncludes: IVideoIncludes | null
    videoDetail: IVideoInfo | null
    filterParams: IFormSortVideo
    searchParams: IFormSearchParams
  } => ({
    videoStorageLists: [],
    videoLists: [],
    videoIncludes: null,
    videoDetail: null,
    filterParams: {
      sort_type: 'video_detail.viewCount',
      order: 'desc',
      checked: false,
      filter: [],
    },
    searchParams: {
      keyword: null,
      coefficient: 3,
      specification: PeriodSpecificationEnum.OPTION,
      periodOfTime: null,
      date_from: null,
      date_to: null,
    },
  }),

  actions: {
    /**
     * Get list video
     * @param params
     */
    async getVideos(params: IFormSearchParams) {
      try {
        const { $api } = useNuxtApp()

        this.searchParams.coefficient = params.coefficient
        this.searchParams.specification = params.specification
        this.searchParams.periodOfTime = params.periodOfTime
        this.searchParams.keyword = params.keyword
        this.searchParams.date_from = params.date_from
        this.searchParams.date_to = params.date_to

        const paramVideos = cloneDeep(params)

        delete paramVideos.specification
        delete paramVideos.periodOfTime

        const res = await $api.video.getListVideo(paramVideos)

        if (res && res.data && res.data.data) {
          this.videoStorageLists = res.data.data
          this.videoLists = res.data.data
          this.videoIncludes = res.data.includes
        } else if (res.data && !res.data?.data) {
          this.videoStorageLists = orderBy(
            res.data,
            [this.filterParams.sort_type],
            [this.filterParams.order]
          )
          this.videoLists = orderBy(
            res.data,
            [this.filterParams.sort_type],
            [this.filterParams.order]
          )
          this.videoIncludes = res.includes
        }
      } catch (error: any) {
        throw { message: error }
      }
    },

    /**
     * Reset filter params
     * @param params
     */
    resetFilter(params: IFormSortVideo) {
      this.filterParams.sort_type = params.sort_type
      this.filterParams.order = params.order
      this.filterParams.checked = params.checked
      this.filterParams.filter = params.filter
    },

    /**
     * Get Detail Video
     * @param videoId
     */
    async getVideoDetail(videoId: string) {
      try {
        const { $api } = useNuxtApp()

        this.videoDetail = null
        const res = await $api.video.getVideoDetail(videoId)

        if (res && res.data) {
          const result = res.data

          this.videoDetail = result
        }
      } catch (error: any) {
        throw { message: '' }
      }
    },

    /**
     * Filter video
     * @param params
     */
    filterVideo(params: IFormSortVideo) {
      const videoLists = cloneDeep(this.videoStorageLists)

      this.videoLists = orderBy(videoLists, [params.sort_type], [params.order])
      this.filterParams.checked = params.checked
      this.filterParams.filter = params.filter
      this.filterParams.sort_type = params.sort_type
      this.filterParams.order = params.order
      if (params.checked) {
        this.videoLists = this.videoLists.filter(
          (e) => e.coefficient >= Number(this.searchParams.coefficient)
        )
      }

      this.videoLists = filterChannelVideo(this.videoLists, params.filter)
    },
  },

  getters: {
    countVideos: (state) => {
      if (!state.videoStorageLists.length) {
        return null
      }

      return {
        one_channel: state.videoStorageLists.filter(
          (item) =>
            item.channel_detail.subscriberCount >=
            FilterConstChannelVideo.ONE_CHANNEL[0]
        ).length,
        two_channel: state.videoStorageLists.filter(
          (item) =>
            item.channel_detail.subscriberCount >=
              FilterConstChannelVideo.TWO_CHANNEL[0] &&
            item.channel_detail.subscriberCount <=
              FilterConstChannelVideo.TWO_CHANNEL[1]
        ).length,
        three_channel: state.videoStorageLists.filter(
          (item) =>
            item.channel_detail.subscriberCount >=
              FilterConstChannelVideo.THREE_CHANNEL[0] &&
            item.channel_detail.subscriberCount <=
              FilterConstChannelVideo.THREE_CHANNEL[1]
        ).length,
        four_channel: state.videoStorageLists.filter(
          (item) =>
            item.channel_detail.subscriberCount >=
              FilterConstChannelVideo.FOUR_CHANNEL[0] &&
            item.channel_detail.subscriberCount <=
              FilterConstChannelVideo.FOUR_CHANNEL[1]
        ).length,
        five_channel: state.videoStorageLists.filter(
          (item) =>
            item.channel_detail.subscriberCount <=
            FilterConstChannelVideo.FIVE_CHANNEL[0]
        ).length,
      }
    },
  },
})
