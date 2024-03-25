<script setup lang="ts">
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
})

const emit = defineEmits(['update:modelValue', 'on-enter'])

const modelValue = useSyncProps<string>(props, 'modelValue', emit)
</script>

<template>
  <div>
    <a-checkbox v-model:checked="modelValue" :disabled="disabled">{{
      label
    }}</a-checkbox>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-checkbox .ant-checkbox-inner) {
  border-radius: 2px;
}
</style>
