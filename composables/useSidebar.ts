import { useMenu } from '@/stores/menu'

export const useSideBar = () => {
  const menuStore = useMenu()

  const collapsed = computed((): boolean => menuStore.isCollapsed)

  const handleSideMenu = () => {
    menuStore.setData()
  }

  return {
    collapsed,
    handleSideMenu,
  }
}
