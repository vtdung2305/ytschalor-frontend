<script lang="ts" setup>
import { ref } from 'vue'
import { theme } from 'ant-design-vue'
import enUS from 'ant-design-vue/es/locale/en_US'
import jaJP from 'ant-design-vue/es/locale/ja_JP'
import { IThemesData } from '@/interfaces/common'
import { useCompare } from '@/stores/compare'
import { LocalStorageCompare } from '@/constants/video'

const themesRegister = ref<IThemesData>({
  borderRadius: 2,
  colorPrimary: '#ff6b00',
  colorBgLayout: '#FDF8F4',
})

const locale = ref(jaJP.locale)

const data = ref(themesRegister.value)

const { token } = theme.useToken()

const { collapsed, handleSideMenu } = useSideBar()

const compareStore = useCompare()

const route = useRoute()

const { isAdmin } = useHelper()

const checkShowDrawerCompare = () => {
  const listVideoCompare = localStorage.getItem(
    LocalStorageCompare.LIST_VIDEO_COMPARE
  )

  if (listVideoCompare) {
    compareStore.addAllItem(JSON.parse(listVideoCompare))
  }
}

onMounted(() => {
  checkShowDrawerCompare()
})
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: data.colorPrimary,
        colorBgLayout: data.colorBgLayout,
        fontFamily: 'Noto Sans JP',
      },
    }"
    :locale="{
      ...jaJP,
    }"
  >
    <Loading class="w-full h-full fixed top-0 left-0" />
    <a-layout has-sider>
      <LayoutsSidebar></LayoutsSidebar>
      <div
        class="ant-drawer-mask hidden <tablet:block"
        :class="{ active: !collapsed }"
        @click="handleSideMenu()"
      ></div>
      <a-layout>
        <LayoutsHeader></LayoutsHeader>
        <a-layout-content
          :style="{ margin: '27px 16px 0', overflow: 'initial' }"
        >
          <div class="main-content">
            <slot />
          </div>
        </a-layout-content>
        <LayoutsFooter></LayoutsFooter>
      </a-layout>
    </a-layout>
    <Help v-if="!isAdmin"></Help>
    <DrawerCompare
      v-if="route.name !== 'compare' && !isAdmin"
      v-model="compareStore.isShowCompare"
    ></DrawerCompare>
    <div id="modalConfirm" class="modalConfirm"></div>
  </a-config-provider>
</template>

<style lang="scss" scoped>
.ant-layout {
  min-height: 100vh;
}

.ant-drawer-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  opacity: 0;
  transition: opacity 0.3s linear, height 0s ease 0.3s;
  pointer-events: none;
  z-index: 4;

  &.active {
    height: 100%;
    opacity: 1;
    transition: none;
    animation: antdDrawerFadeIn 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    pointer-events: auto;
  }
}

.main-content {
  max-width: 896px;
  margin: 0 auto;
}

.ant-layout .ant-layout-sider {
  background-color: $color_white;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
}
</style>
