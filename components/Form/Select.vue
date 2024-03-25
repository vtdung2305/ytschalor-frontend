<script lang="ts" setup>
import { Empty } from 'ant-design-vue'
import { IItemObject } from '@/interfaces/common'

const imageNoData = Empty.PRESENTED_IMAGE_SIMPLE

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
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
  items: {
    type: Object as () => IItemObject[],
    default: () => {},
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  isShowRequired: {
    type: Boolean,
    default: false,
  },
  showSearch: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'middle',
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
})

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().includes(input.toLowerCase())
}

const emit = defineEmits(['update:modelValue', 'on-enter'])

const modelValue = useSyncProps<string>(props, 'modelValue', emit)
</script>

<template>
  <div>
    <a-form-item :name="name">
      <label v-if="label" class="c-label">
        {{ label }}
        <template v-if="isShowRequired">
          <span v-if="isRequired" class="required">{{
            $t('common.required')
          }}</span>
          <span v-else>{{ $t('common.option') }}</span>
        </template>
      </label>
      <a-select
        v-model:value="modelValue"
        :placeholder="placeholder"
        :show-search="showSearch"
        :size="size"
        :filter-option="filterOption"
        :disabled="isDisabled"
        v-bind="$attrs"
      >
        <template #notFoundContent>
          <a-empty :image="imageNoData" :description="$t('common.no_data')" />
        </template>
        <a-select-option
          v-for="(item, index) in items"
          :key="index"
          :value="item.value"
          :label="item.label"
          >{{ $t(item.label) }}</a-select-option
        >
      </a-select>
    </a-form-item>
  </div>
</template>

<style lang="scss" scoped>
.c-label {
  font-size: 16px;
  display: flex;
  align-items: center;
  padding-bottom: 3px;
  color: $color_black2;

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

:deep(.ant-select-single .ant-select-selector) {
  border-radius: 2px;
}

:deep(.ant-select-single) {
  .ant-select-selector {
    height: 40px;

    .ant-select-selection-item {
      line-height: 38px;
    }
  }
  &.ant-select-sm {
    .ant-select-selector {
      height: 32px;
      align-items: center;

      .ant-select-selection-item {
        line-height: 30px;
      }
    }
  }
}
</style>
