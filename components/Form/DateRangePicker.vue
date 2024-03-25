<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs'
import locale from 'ant-design-vue/es/date-picker/locale/ja_JP'
import { FormatDateEnum } from '@/constants/common'
import { IRangeValue } from '@/interfaces/common'
import 'dayjs/locale/ja'
dayjs.locale('ja')

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  isShowRequired: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'middle',
  },
  format: {
    type: String,
    default: FormatDateEnum.FORMAT_NORMAL,
  },
  valueFormat: {
    type: [String, Array],
    default: FormatDateEnum.FORMAT_NORMAL,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showTime: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'on-enter'])

// const modelValue = useSyncProps<IRangeValue>(props, 'modelValue', emit)

const modelValue = computed({
  // getter
  get() {
    return props.modelValue
  },
  // setter
  set(newValue) {
    emit('update:modelValue', newValue)
  },
})

const onChange = (date: Dayjs | string, dateString: string) => {
  // console.log(date, dateString)
}

const onRangeChange = (
  date: [string, string],
  dateString: [string, string]
) => {
  // console.log(date, dateString)
}
</script>

<template>
  <div>
    <label class="c-label">
      {{ label }}
      <template v-if="isShowRequired">
        <span v-if="isRequired" class="required">{{
          $t('common.required')
        }}</span>
        <span v-else>{{ $t('common.option') }}</span>
      </template>
    </label>
    <a-form-item :name="name">
      <a-config-provider :locale="locale">
        <a-range-picker
          v-model:value="modelValue"
          :size="size"
          :format="format"
          :value-format="valueFormat"
          :locale="locale"
          :disabled="disabled"
          :show-time="showTime"
          v-bind="$attrs"
          @change="onRangeChange"
        >
        </a-range-picker>
      </a-config-provider>
    </a-form-item>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-picker) {
  border-radius: 2px;
}

:deep(.ant-picker-large) {
  width: 100%;
}
</style>
