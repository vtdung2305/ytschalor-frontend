<script lang="ts" setup>
import { PropType } from 'vue'

type TypeInput = 'text' | 'password' | 'email'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  typeInput: {
    type: String as PropType<TypeInput>,
    default: 'text',
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
  isDisabled: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
  beforeSub: {
    type: String,
    default: '',
  },
  classNameBeforeSub: {
    type: String,
    default: '',
  },
  afterSub: {
    type: String,
    default: '',
  },
  classNameAfterSub: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'middle',
  },
})

const emit = defineEmits(['update:modelValue', 'on-enter'])

const modelValue = useSyncProps<string>(props, 'modelValue', emit)
</script>

<template>
  <div class="c-textField">
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
      <div class="flex items-center">
        <div v-if="beforeSub" class="sub-label" :class="classNameBeforeSub">
          {{ beforeSub }}
        </div>
        <a-input-password
          v-if="typeInput === 'password'"
          v-model:value="modelValue"
          :placeholder="placeholder"
          autocomplete="off"
          :disabled="isDisabled"
          :visible="visible"
          :class="className"
          :size="size"
          v-bind="$attrs"
          @blur="$emit('update:modelValue', $event.target.value.trim())"
        />
        <a-input
          v-else
          v-model:value="modelValue"
          :placeholder="placeholder"
          autocomplete="off"
          :disabled="isDisabled"
          v-bind="$attrs"
          :class="className"
          :size="size"
          @blur="$emit('update:modelValue', $event.target.value.trim())"
        />
        <div v-if="afterSub" class="sub-label" :class="classNameAfterSub">
          {{ afterSub }}
        </div>
      </div>
    </a-form-item>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-input) {
  max-height: 40px;
  height: 40px;
  background-color: $color_white;
  border-color: $color_gray1;
  border-radius: 2px;
  font-size: 16px;

  &.ant-input-sm {
    max-height: 32px;
    height: 32px;
    font-size: 14px;
  }

  &:disabled {
    background-color: $color_gray4;
    border-color: $color_gray1;
  }
}

:deep(.ant-input:focus) {
  border-color: $color_orange;
}

:deep(.ant-input-affix-wrapper) {
  padding: 0 11px;
}

:deep(.ant-input-affix-wrapper-disabled) {
  background-color: $color_gray4;
  border-color: $color_gray1;
}

:deep(.ant-input-affix-wrapper input.ant-input:focus) {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  box-shadow: 0 0 0 30px white inset !important;
}

:deep(.ant-form-item) {
  margin-bottom: 26px;
}

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
      min-width: 36px;
    }
  }
}

.sub-label {
  font-size: 16px;
}
</style>
