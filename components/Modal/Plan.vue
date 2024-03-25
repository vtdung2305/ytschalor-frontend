<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: [Boolean],
    default: false,
  },
  title: {
    type: String,
    default: 'false',
  },
  width: {
    type: [String, Number],
    default: 640,
  },
  closable: {
    type: Boolean,
    default: false,
  },
  footer: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'on-enter'])

const modelValue = useSyncProps<Boolean>(props, 'modelValue', emit)

const { isLoadingDrawer } = useHelper()

const getContainer = () => {
  return document.getElementById('modal')
}
</script>

<template>
  <div id="modal" class="modal">
    <a-modal
      v-if="modelValue"
      v-model:open="modelValue"
      :width="width"
      :title="title"
      :get-container="getContainer"
      :closable="closable"
      :footer="footer"
      centered
    >
      <loading-drawer v-if="isLoading" :is-loading="isLoading" />
      <div v-else class="modal-body">
        <slot />
      </div>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-modal) {
  .ant-modal-content {
    border-radius: 2px;
    padding: 60px 35px;
    color: $color_black2;
  }

  .ant-modal-title {
    color: $color_black2;
    font-size: 24px;
    font-weight: 700;
  }

  .ant-modal-header {
    margin-bottom: 16px;
  }

  @include mq_down(sp) {
    .ant-modal-content {
      padding: 20px;
    }
  }
}
</style>
