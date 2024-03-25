import { defineStore } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'
import {
  IChannel,
  IParamsSearchChannel,
  IFilterSearchChannel,
  IFilterSortChannel,
  IChannelDetail,
  IVideoByChannelParams,
  IChannelIncludes,
} from '@/interfaces/channel'
import { IVideoParams, IVideoItem } from '@/interfaces/video'

export const useChannel = defineStore('channel', {
  state: (): {
    channelList: IChannel[]
    channelListStorage: IChannel[]
    filterSearch: IFilterSearchChannel | null
    filterSort: IFilterSortChannel | null
    channelDetail: IChannelDetail | null
    listVideoChannel: IVideoItem[]
    channelListIncludes: IChannelIncludes | null
  } => ({
    channelList: [],
    channelListStorage: [],
    filterSearch: null,
    filterSort: null,
    channelDetail: null,
    listVideoChannel: [],
    channelListIncludes: null,
  }),

  actions: {
    async getSearchChannel(filter: IParamsSearchChannel) {
      const { $api } = useNuxtApp()

      const res = await $api.channel.searchChannel(filter)

      if (res && res.data) {
        this.channelList = res.data
        this.channelListStorage = res.data
        this.channelListIncludes = res.includes
      }
    },

    setFilterSort(filter: IFilterSortChannel) {
      this.filterSort = filter
    },

    resetFilterSort() {
      this.filterSort = null
    },

    setFilterSearch(filter: IFilterSearchChannel) {
      this.filterSearch = filter
    },

    sortFilterSearch(key: string, order: string, checked: boolean) {
      let channelListSort = []

      const channelListClone = cloneDeep(this.channelListStorage)

      if (checked) {
        channelListSort = channelListClone.filter(
          (e) =>
            e.coefficient >= Number(this.filterSearch?.coefficient) &&
            Number(e.viewCount) / Number(e.videoCount) >=
              Number(this.filterSearch?.coefficient_view)
        )
      } else {
        channelListSort = channelListClone
      }

      if (order === 'asc') {
        if (key === 'viewCount') {
          this.channelList = channelListSort.sort(
            (a, b) => parseFloat(a.viewCount) - parseFloat(b.viewCount)
          )
        }
        if (key === 'subscriberCount') {
          this.channelList = channelListSort.sort(
            (a, b) =>
              parseFloat(a.subscriberCount) - parseFloat(b.subscriberCount)
          )
        }
        if (key === 'publishedAt') {
          this.channelList = channelListSort.sort(
            (a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt)
          )
        }
      }
      if (order === 'desc') {
        if (key === 'viewCount') {
          this.channelList = channelListSort.sort(
            (a, b) => parseFloat(b.viewCount) - parseFloat(a.viewCount)
          )
        }
        if (key === 'subscriberCount') {
          this.channelList = channelListSort.sort(
            (a, b) =>
              parseFloat(b.subscriberCount) - parseFloat(a.subscriberCount)
          )
        }
        if (key === 'publishedAt') {
          this.channelList = channelListSort.sort(
            (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
          )
        }
      }
    },

    async getChannelDetail(id: string) {
      const { $api } = useNuxtApp()

      const res = await $api.channel.getChannelDetail(id)

      if (res && res.data) {
        this.channelDetail = res.data
      }
    },

    async getListVideoChannel(params: IVideoByChannelParams) {
      const { $api } = useNuxtApp()

      const res = await $api.channel.getListVideoByChannel(params)

      if (res && res.data) {
        this.listVideoChannel = res.data
      }
    },
  },

  getters: {},
})
