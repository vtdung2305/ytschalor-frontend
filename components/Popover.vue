<script setup lang="ts">
import {
  InfoCircleTwoTone,
  InfoCircleOutlined,
  InfoCircleFilled,
} from '@ant-design/icons-vue'

const props = defineProps({
  style: {
    type: Object,
    default: () => {},
  },
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  placement: {
    type: String,
    default: 'top',
  },
  twoToneColor: {
    type: String,
    default: '',
  },
  theme: {
    type: String,
    default: 'outlined',
  },
  isShowContent: {
    type: Boolean,
    default: true,
  },
})

const visible = ref<boolean>(false)
</script>

<template>
  <div class="popover" :class="{ 'not-cursor': !isShowContent }">
    <a-popover
      :get-popup-container="(triggerNode) => triggerNode.parentNode"
      :title="isShowContent ? title : false"
      :placement="placement"
    >
      <template v-if="isShowContent" #content>
        <div v-html="content"></div>
      </template>
      <info-circle-outlined v-if="theme === 'outlined'" :style="style" />
      <info-circle-filled v-else-if="theme === 'filled'" :style="style" />
      <info-circle-two-tone
        v-else
        :style="style"
        :two-tone-color="twoToneColor"
      />
    </a-popover>
  </div>
</template>

<style lang="scss" scoped>
:deep(.anticon svg) {
  font-size: 16px;
}

:deep(.ant-popover) {
  max-width: 236px;

  .ant-popover-inner {
    padding: 0;
  }

  .ant-popover-title {
    padding: 5px 16px;
    margin-bottom: 0;
    border-bottom: 1px solid $color_gray1;
  }

  .ant-popover-inner-content {
    padding: 12px 16px;
    font-size: 14px;
    line-height: 22px;
  }
}

.not-cursor {
  :deep(.anticon) {
    cursor: auto;
  }
  :deep(.ant-popover-arrow) {
    display: none;
  }
}

:deep(.ant-popover-inner-content) {
  div {
    white-space: break-spaces;
  }
}
</style>
