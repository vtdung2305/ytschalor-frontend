<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useCommon } from '@/stores/common'

const props = defineProps({
  size: {
    type: String,
    default: 'large',
  },
  spinning: {
    type: Boolean,
    default: false,
  },
})

const commonStore = useCommon()

const { t } = useI18n()

const tipLoading = computed(() => commonStore.titleLoading)

const { isLoading } = useHelper()
</script>

<template>
  <div
    v-if="isLoading"
    class="flex flex-col justify-center items-center c-loading w-full h-screen"
  >
    <a-spin :tip="$t(tipLoading)" :size="size" :spinning="isLoading"></a-spin>
  </div>
</template>

<style lang="scss" scoped>
.c-loading {
  width: 100%;
  z-index: 999;

  &::before {
    position: fixed;
    display: block;
    content: '';
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, 0.25);
  }
}

:deep(.ant-spin-spinning) {
  z-index: 1000;
}
</style>
