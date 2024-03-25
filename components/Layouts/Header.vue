<script lang="ts" setup>
import { MasterSite } from '@/constants/common'
import { useUser } from '@/stores/user'

const getImageUrlLogo = computed(() => {
  return MasterSite.logo_src
})

const { collapsed, handleSideMenu } = useSideBar()

const { isAdmin } = useHelper()

const userStore = useUser()
</script>

<template>
  <a-layout-header
    class="<tablet:flex"
    style="background: #fff; padding: 0; height: 56px; line-height: 56px"
  >
    <div class="header w-full">
      <div
        class="header-container flex justify-between items-center px-32px <laptop:px-20px <tablet:px-10px"
      >
        <div
          class="header-left flex items-center gap-x-25px <laptop:gap-x-15px"
        >
          <h1>
            <nuxt-link :to="isAdmin ? '/admin/users' : '/analysis'">
              <img
                :src="getImageUrlLogo"
                alt="logo"
                class="w-200px <tablet:w-150px"
              />
            </nuxt-link>
          </h1>
          <div class="hidden <tablet:flex">
            <menu-unfold-outlined
              v-if="collapsed"
              :style="{ fontSize: '20px' }"
              class="trigger"
              @click="handleSideMenu()"
            />
            <menu-fold-outlined
              v-else
              :style="{ fontSize: '20px' }"
              class="trigger"
              @click="handleSideMenu()"
            />
          </div>
          <div class="header-navigation block <tablet:hidden">
            <LayoutsMenu />
          </div>
        </div>

        <div class="header-right">
          <dropdown-navigation :key="userStore.planType"></dropdown-navigation>
        </div>
      </div>
    </div>
  </a-layout-header>
</template>

<style lang="scss" scoped>
.header {
  background-color: $color_white;
  border-bottom: 1px solid $color_gray1;
}
</style>
