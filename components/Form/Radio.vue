<script setup lang="ts">
import { RadioGroupProps } from 'ant-design-vue'
import { PropType } from 'vue'

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
    type: Array as PropType<RadioGroupProps['options']>,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'on-enter'])

const modelValue = useSyncProps<string>(props, 'modelValue', emit)
</script>

<template>
  <div>
    <a-radio-group v-model:value="modelValue">
      <a-radio
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
        >{{ $t(option.label) }}</a-radio
      >
    </a-radio-group>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-radio-wrapper .ant-radio-checked) {
  &::after {
    border: 1px solid $color_blue;
    background-color: $color_white;
  }

  .ant-radio-inner {
    border-color: $color_blue;
    background-color: $color_white;
  }
}

:deep(.ant-radio-wrapper .ant-radio-inner) {
  border: 1px solid $color_gray1;

  &::after {
    width: 20px;
    height: 20px;
    margin-block-start: -10px;
    margin-inline-start: -10px;
    background-color: $color_blue;
  }
}
:deep(.ant-radio-wrapper:hover .ant-radio-inner) {
  border-color: $color_blue;
}
</style>
