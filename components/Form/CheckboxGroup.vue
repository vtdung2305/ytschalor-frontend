<script setup lang="ts">
import { IItemObject } from '@/interfaces/common'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array as () => IItemObject[],
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'on-enter'])

const modelValue = useSyncProps<string>(props, 'modelValue', emit)
</script>

<template>
  <div>
    <a-checkbox-group v-model:value="modelValue" :disabled="disabled">
      <a-checkbox
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
        :disabled="option.disabled"
        >{{ option.label }}</a-checkbox
      >
    </a-checkbox-group>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-checkbox .ant-checkbox-inner) {
  border-radius: 2px;
}

:deep(.ant-checkbox + span) {
  color: $color_black2;
}
</style>
