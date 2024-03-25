<script lang="ts" setup>
import { ref } from 'vue'
import { theme } from 'ant-design-vue'
import enUS from 'ant-design-vue/es/locale/en_US'
import jaJP from 'ant-design-vue/es/locale/ja_JP'

const defaultData = {
  borderRadius: 2,
  colorPrimary: '#ff6b00',
}

const data = ref(defaultData)

const { token } = theme.useToken()
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: data.colorPrimary,
        borderRadius: `${data.borderRadius}px`,
        fontFamily: 'Noto Sans JP',
      },
    }"
    :locale="{
      ...jaJP,
    }"
  >
    <Loading class="w-full h-full fixed top-0 left-0" />
    <div class="h-screen w-full">
      <div class="flex-1 relative">
        <slot />
      </div>
    </div>
    <Help></Help>
  </a-config-provider>
</template>
