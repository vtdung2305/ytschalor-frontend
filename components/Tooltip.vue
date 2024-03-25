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
})
</script>

<template>
  <div class="inline-block">
    <a-tooltip :placement="placement" :title="title" arrow-point-at-center>
      <info-circle-outlined v-if="theme === 'outlined'" :style="style" />
      <info-circle-filled v-else-if="theme === 'filled'" :style="style" />
      <info-circle-two-tone
        v-else
        :style="style"
        :two-tone-color="twoToneColor"
      />
    </a-tooltip>
  </div>
</template>

<style lang="scss" scoped>
:deep(.anticon svg) {
  font-size: 16px;
}
</style>
