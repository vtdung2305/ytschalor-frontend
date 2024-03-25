<script lang="ts" setup>
import { h } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'middle',
  },
  icon: {
    type: Function,
    default: () => false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  href: {
    type: String,
    default: undefined,
  },
})
</script>

<template>
  <a-form-item>
    <a-button
      class="w-full"
      :type="type"
      :disabled="disabled"
      html-type="submit"
      :size="size"
      :icon="icon ? h(icon) : ''"
      :loading="isLoading"
      :href="href"
    >
      {{ label }}
    </a-button>
  </a-form-item>
</template>

<style lang="scss" scoped>
:deep(.ant-btn) {
  height: 40px;
  border-radius: 2px;
  transition: background-color 0.6s ease;

  &.ant-btn-lg {
    height: 48px;
  }

  &:disabled {
    background-color: $color_gray2;
  }

  &:hover:enabled {
    // opacity: 0.6s;
    background-color: $color_button_hover;
  }

  > span {
    vertical-align: middle;
    line-height: 2;
  }
}
.ant-form-item {
  // margin-bottom: 0;
}
</style>
