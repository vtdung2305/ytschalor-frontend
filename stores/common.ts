import { defineStore } from 'pinia'
import { ILoading } from '@/interfaces/common'

export const useCommon = defineStore('counter', {
  state: (): ILoading => ({
    isLoading: false,
    isLoadingDrawer: false,
    titleLoading: '',
    titleLoadingDrawer: '',
  }),

  actions: {
    setLoading(val: boolean, tip: string = '') {
      this.isLoading = val
      if (tip) {
        this.titleLoading = tip
      }

      if (!val) {
        this.titleLoading = ''
      }
    },

    setLoadingDrawer(val: boolean, tip: string = '') {
      this.isLoadingDrawer = val
      if (tip) {
        this.titleLoadingDrawer = tip
      }

      if (!val) {
        this.titleLoadingDrawer = ''
      }
    },
  },
})
