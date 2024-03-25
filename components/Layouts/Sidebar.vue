<script lang="ts" setup>
import { ref } from 'vue'

const { collapsed } = useSideBar()

const { getImageUrlLogo } = useHelper()
</script>

<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    collapsible
    collapsed-width="0"
    class="laptop:hidden <tablet:block"
    :style="{
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 5,
    }"
  >
    <div class="logo-sidebar my-15px pl-15px">
      <h1>
        <nuxt-link to="/">
          <img :src="getImageUrlLogo" alt="logo" class="w-150px" />
        </nuxt-link>
      </h1>
    </div>
    <LayoutsMenu :mode="`inline`" />
  </a-layout-sider>
</template>

<style lang="scss" scoped>
:deep(.ant-menu-item) {
  padding-left: 15px !important;
}
</style>
