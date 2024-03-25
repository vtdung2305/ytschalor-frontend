<script setup lang="ts">
const props = defineProps({
  items: {
    type: [Array],
    default: () => [],
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
})

const activeKey = ref('1')

const emit = defineEmits(['update:modelValue', 'on-enter'])

const modelValue = useSyncProps<number>(props, 'modelValue', emit)
</script>

<template>
  <a-tabs v-model:activeKey="modelValue">
    <a-tab-pane
      v-for="tab in items"
      :key="tab.key"
      :tab="tab.name"
      >{{
    }}</a-tab-pane>
  </a-tabs>
</template>

<style lang="scss" scoped>
:deep(.ant-tabs-top > .ant-tabs-nav) {
  margin: unset;
}

:deep(.ant-tabs-large > .ant-tabs-nav .ant-tabs-tab) {
  color: $color_black2;
}

.ant-tabs-top > .ant-tabs-nav::before {
  border-bottom: none;
}

.ant-tabs-top {
  :deep(> .ant-tabs-nav::before) {
    border-bottom: none;
  }
}

.ant-tabs {
  :deep(.ant-tabs-tab + .ant-tabs-tab) {
    @include mq-down(sp) {
      margin: 0 0 0 16px;
    }
  }
  :deep(.ant-tabs-tab-btn) {
    color: $color_black2;
    font-size: 16px;

    @include mq-down(sp) {
      font-size: 13px;
    }
  }
}
</style>
