import { defineStore } from 'pinia'

export interface ICollapsed {
  isCollapsed: boolean
}

export const useMenu = defineStore('menu', {
  state: (): ICollapsed => ({
    isCollapsed: true,
  }),
  actions: {
    setData() {
      this.isCollapsed = !this.isCollapsed
    },
  },
})
