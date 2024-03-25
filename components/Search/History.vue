<script setup lang="ts">
import dayjs from 'dayjs'
import { PropType } from 'vue'
import { IHistoryParams } from '@/interfaces/history'
import { SearchTypeLists } from '@/constants/history'
import { FormatDateEnum } from '@/constants/common'
import { PeriodSpecificationEnum } from '@/constants/video'

const props = defineProps({
  modelValue: {
    type: Object as PropType<IHistoryParams>,
    default: () => {},
  },
  count: {
    type: Number,
    default: 0,
  },
})

const { isPlanFree } = useHelper()

// const params = reactive<IHistoryParams>({
//   date_from: subtractDate(
//     currentDate.value,
//     PeriodSpecificationEnum.PAST_7_DAY
//   ),
//   date_to: currentDate.value,
//   search_type: 'search_all',
//   periodOfTime: [
//     subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_7_DAY),
//     currentDate.value,
//   ],
//   page_no: PaginationEnum.PAGE,
//   page_size: PaginationEnum.PER_PAGE,
// })

const isSearching = ref<boolean>(false)

const emit = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <div>
    <a-form ref="formSearchHistory" :model="modelValue">
      <div class="flex flex-wrap">
        <div class="w-320px mr-20px <tablet:w-full <tablet:ml-0 <tablet:mr-0">
          <FormLabel :label="$t('pages.search.target_period')" />
          <FormDateRangePicker
            v-model="modelValue.periodOfTime"
            :format="FormatDateEnum.FORMAT_NORMAL"
            :value-format="FormatDateEnum.FORMAT_DATE"
            :disabled="isSearching || isPlanFree"
            :size="`large`"
            :show-time="$device.isTablet || $device.isMobile ? true : false"
          >
          </FormDateRangePicker>
        </div>
        <div class="w-210px <tablet:w-full <tablet:ml-0">
          <FormLabel :label="$t('pages.search.search_type')" />
          <FormSelect
            v-model="modelValue.search_type"
            :size="`large`"
            :items="SearchTypeLists"
            :disabled="isSearching || isPlanFree"
          >
          </FormSelect>
        </div>
        <div
          class="flex items-center pl-20px text-16px <tablet:pl-0 <tablet:mb-15px"
        >
          <span class="pr-15px">{{ $t('pages.analysis.search_results') }}</span>
          <span>{{ props?.count }}</span>
          <span>{{ $t('components.units.pieces') }}</span>
        </div>
      </div>
    </a-form>
  </div>
</template>

<style lang="scss" scoped>
// :deep(.c-label_txt) {
//   font-size: 14px;
// }
</style>
