import { defineStore } from 'pinia'
import { IVideoInfo } from '@/interfaces/video'
import { LocalStorageCompare } from '@/constants/video'

export const useCompare = defineStore('compare', {
  state: (): {
    listVideoCompare: IVideoInfo[]
  } => ({
    listVideoCompare: [],
  }),

  actions: {
    addItem(item: IVideoInfo) {
      const found = this.listVideoCompare.some((el) => el.id === item.id)

      if (!found) {
        this.listVideoCompare.push(item)

        localStorage.setItem(
          LocalStorageCompare.LIST_VIDEO_COMPARE,
          JSON.stringify(this.listVideoCompare)
        )
      }
    },

    addAllItem(arr: IVideoInfo[]) {
      this.listVideoCompare = arr

      localStorage.setItem(
        LocalStorageCompare.LIST_VIDEO_COMPARE,
        JSON.stringify(this.listVideoCompare)
      )
    },

    removeItem(id: string) {
      const index = this.listVideoCompare
        .map((x) => {
          return x.id
        })
        .indexOf(id)

      this.listVideoCompare.splice(index, 1)

      localStorage.setItem(
        LocalStorageCompare.LIST_VIDEO_COMPARE,
        JSON.stringify(this.listVideoCompare)
      )
    },

    removeAllItem() {
      this.listVideoCompare = []

      localStorage.removeItem(LocalStorageCompare.LIST_VIDEO_COMPARE)
    },
  },

  getters: {
    /**
     * is Show Video Compare
     * @param state
     * @returns {Boolean}
     */
    isShowCompare: (state): Boolean => !!state.listVideoCompare.length,
  },
})
