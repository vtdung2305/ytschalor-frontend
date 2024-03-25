<script lang="ts" setup>
import { ref } from 'vue'
import { PaginationEnum } from '@/constants/common'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  total: {
    type: Number,
    default: 0,
  },
  size: {
    type: String,
    default: 'small',
  },
  defaultPageSize: {
    type: Number,
    default: PaginationEnum.PER_PAGE,
  },
})

const current = ref(PaginationEnum.PAGE)

const emit = defineEmits(['onChange', 'update:modelValue'])

const modelValue = useSyncProps<string>(props, 'modelValue', emit)

const onChange = (page: number, pageSize: number) => {
  emit('onChange', page)
}
</script>

<template>
  <a-pagination
    v-if="total > 10"
    v-model:current="modelValue"
    :size="size"
    :total="total"
    show-less-items
    :show-size-changer="false"
    :default-page-size="defaultPageSize"
    class="flex gap-x-4px"
    @change="onChange"
  />
</template>

<style lang="scss" scoped>
:deep(.ant-pagination-item) {
  border-radius: 2px;
  font-weight: 400;
  color: $color_black2;
  font-size: 14px;
  border: none;

  a {
    padding: 0;
  }
}

:deep(.ant-pagination-item-active) {
  font-weight: 400;
  color: $color_orange;
  background-color: rgba($color: $color_orange, $alpha: 0.5);
}
</style>
