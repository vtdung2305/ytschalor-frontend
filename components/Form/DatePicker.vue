<script lang="ts" setup>
import locale from 'ant-design-vue/es/date-picker/locale/ja_JP'
import dayjs from 'dayjs'
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
    default: 'YYYY-MM-DD',
  },
  valueFormat: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  showTime: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'on-enter'])

const modelValue = useSyncProps<string>(props, 'modelValue', emit)
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
          :format="format"
          :show-time="showTime"
          :value-format="valueFormat"
          :size="size"
          :disabled="isDisabled"
          :locale="locale"
        />
      </a-config-provider>
    </a-form-item>
  </div>
</template>

<style lang="scss" scoped>
.c-label {
  font-size: 16px;
  display: flex;
  align-items: center;
  padding-bottom: 3px;

  span {
    display: inline-block;
    font-size: 10px;
    line-height: 18px;
    color: $color_gray3;
    border: 1px solid;
    border-color: $color_gray3;
    padding: 2px 7px;
    border-radius: 4px;
    margin-left: 11px;

    &.required {
      color: $color_red1;
      border-color: $color_red1;
    }
  }
}

:deep(.ant-picker) {
  border-radius: 2px;
}

:deep(.ant-picker-large) {
  width: 100%;
}
</style>
