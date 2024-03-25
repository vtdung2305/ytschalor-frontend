<script setup lang="ts">
import { ref } from 'vue'
import type { DrawerProps } from 'ant-design-vue'
import { useCompare } from '@/stores/compare'

const { isMobile, isTablet } = useDevice()

const props = defineProps({
  width: {
    type: [String, Number],
    default: 720,
  },
  modelValue: {
    type: [Boolean],
    default: false,
  },
  placement: {
    type: String,
    default: 'right',
  },
  title: {
    type: String,
    default: undefined,
  },
  closable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'on-enter'])

const modelValue = useSyncProps<Boolean>(props, 'modelValue', emit)

const afterOpenChange = (bool: boolean) => {
  // console.log('open', bool)
  // document.documentElement.classList.toggle('openMenu', bool)
  // document.body.classList.toggle('openMenu', bool)
}

const showDrawer = () => {
  modelValue.value = true
}

const onClose = () => {
  modelValue.value = false
}

const { isLoadingDrawer } = useHelper()

const compareStore = useCompare()

watch(modelValue, () => {
  if (modelValue.value) {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
  } else {
    document.getElementsByTagName('body')[0].style.overflow = 'unset'
  }
})
</script>

<template>
  <div v-if="modelValue" class="drawer">
    <a-drawer
      :width="width"
      :title="title"
      :placement="placement"
      :open="modelValue"
      :get-container="false"
      @close="onClose"
      @after-open-change="afterOpenChange"
    >
      <loading-drawer v-if="isLoadingDrawer" :is-loading="isLoadingDrawer" />
      <div
        v-else
        class="drawer-wrapper"
        :class="{ compare: compareStore.isShowCompare }"
      >
        <slot />
      </div>
      <template #extra>
        <slot name="custom-head"></slot>
      </template>
    </a-drawer>
  </div>
</template>

<style lang="scss" scoped>
.drawer {
  padding: 80px;
  height: 100%;

  @include mq-down(sp) {
    padding: 0;
  }
}

:deep(.ant-drawer-inline) {
  position: fixed;
}

:deep(.ant-drawer .ant-drawer-close) {
  @include mq-up(pc) {
    width: 35px;
    height: 35px;
    position: absolute;
    top: -1px;
    z-index: 1;
    left: -35px;
    background-color: $color_black2;

    .anticon {
      font-size: 28px;
      color: $color_white;
    }
  }
}

:deep(.ant-drawer) {
  .ant-drawer-content {
    padding: 8px;

    @include mq-down(sp) {
      padding: 10px;
    }
  }

  .ant-drawer-title {
    font-size: 24px;
    color: $color_black2;
    font-weight: 700;
  }

  .ant-drawer-header {
    border-bottom: none;

    @include mq-down(sp) {
      padding: 16px 0;
    }
  }

  .ant-drawer-body {
    @include mq-down(sp) {
      padding: 10px;
    }
  }
}

.drawer-wrapper {
  &.compare {
    padding-bottom: 150px;
  }
}

:deep(.ant-drawer-header) {
  padding: 16px 24px 0 24px;
}

:deep(.ant-drawer-body) {
  padding: 32px 24px 24px 24px;
}
</style>
