<script lang="ts" setup>
import fetchJsonp from 'fetch-jsonp'

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
  size: {
    type: String,
    default: 'middle',
  },
})

const emit = defineEmits(['update:modelValue', 'on-enter'])

const modelValue = useSyncProps<string>(props, 'modelValue', emit)

let options = reactive<{ value: string }[]>([])

const handleSearch = (val: string) => {
  fetchJsonp(
    `https://clients1.google.com/complete/search?client=youtube&gs_ri=youtube&ds=yt&q=${val}`
  )
    .then(function (response) {
      return response.json()
    })
    .then((json) => {
      const fetchedData = json[1]

      const suggestions: { value: string }[] = []

      fetchedData.forEach((element: string) => {
        suggestions.push({
          value: element[0],
        })
      })

      options = suggestions
    })
    .catch(() => {})
}
</script>

<template>
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
    <a-auto-complete
      v-model:value="modelValue"
      :size="size"
      :placeholder="placeholder"
      autocomplete="off"
      :disabled="isDisabled"
      :options="options"
      @search="handleSearch"
      @blur="$emit('update:modelValue', $event.target.value.trim())"
      @outfocus="$emit('update:modelValue', $event.target.value.trim())"
    >
    </a-auto-complete>
  </a-form-item>
</template>

<style lang="scss" scoped>
:deep(.ant-select-single .ant-select-selector) {
  border-radius: 2px;
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
</style>
