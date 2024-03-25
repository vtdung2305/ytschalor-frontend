<script lang="ts" setup>
import { reactive, ref, ComputedRef, PropType } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'

import dayjs from 'dayjs'
import { IFormSearchParams, IVideoParams } from '@/interfaces/video'
import {
  PeriodSpecificationLists,
  PeriodSpecificationEnum,
} from '@/constants/video'
import {
  FormatDateEnum,
  REGEX_COEFFICIENT,
  TabTypeEnum,
} from '@/constants/common'

const props = defineProps({
  modelValue: {
    type: Object as PropType<IFormSearchParams>,
    default: () => {},
  },
  isSearching: {
    type: Boolean,
    default: false,
  },
})

// const emit = defineEmits(['update:modelValue'])

const { currentDate, subtractDate } = useHelper()

const { $api } = useNuxtApp()

const emit = defineEmits(['searchVideo', 'update:modelValue'])

const { t } = useLang()

const route = useRoute()

const formSearchVideo = ref()

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const changeSpecification = (e: number): void => {
  if (e === PeriodSpecificationEnum.OPTION) {
    modelValue.value.periodOfTime = null
  } else if (e === PeriodSpecificationEnum.PAST_7_DAY) {
    modelValue.value.periodOfTime = [
      subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_7_DAY),
      currentDate.value,
    ]
  } else if (e === PeriodSpecificationEnum.PAST_14_DAY) {
    modelValue.value.periodOfTime = [
      subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_14_DAY),
      currentDate.value,
    ]
  } else {
    modelValue.value.periodOfTime = [
      subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_MONTH),
      currentDate.value,
    ]
  }
}

const rules: Record<string, Rule[]> = {
  keyword: [
    {
      required: true,
      message: t('common.filed_no_required', {
        field: t('pages.analysis.key_work'),
      }),
      trigger: 'change',
    },
  ],
  coefficient: [
    {
      required: true,
      message: t('common.filed_no_required', {
        field: t('components.search_video.judgment_criteria'),
      }),
      trigger: 'change',
    },
    {
      pattern: REGEX_COEFFICIENT,
      message: t('common.field_only_number', {
        field: t('components.search_video.judgment_criteria'),
      }),
      trigger: 'change',
    },
  ],
}

const handleSearch = () => {
  formSearchVideo.value
    .validate()
    .then(() => {
      emit('searchVideo')
    })
    .catch((e: any) => {
      // console.log(e)
    })
}

watch(
  modelValue,
  (newVal) => {
    if (newVal.periodOfTime && newVal.periodOfTime.length) {
      modelValue.value.date_from = dayjs(newVal.periodOfTime[0]).format(
        FormatDateEnum.FORMAT_DATE_PARAMS
      )
      modelValue.value.date_to = dayjs(newVal.periodOfTime[1]).format(
        FormatDateEnum.FORMAT_DATE_PARAMS
      )
    } else {
      modelValue.value.date_from = modelValue.value.date_to = null
    }
  },
  { deep: true }
)

onMounted(() => {
  if (route.query.keyword && route.query.type === TabTypeEnum.VIDEO) {
    modelValue.value.keyword = route.query?.keyword
    handleSearch()
  }
})
</script>

<template>
  <div v-if="modelValue" class="mt-10px">
    <a-form ref="formSearchVideo" :model="modelValue" :rules="rules">
      <div class="flex flex-wrap">
        <div class="w-380px <tablet:w-full">
          <FormLabel :label="$t('pages.analysis.key_work')">
            <Popover
              :title="$t('components.search_video.title_tooltip2')"
              :content="$t('components.search_video.msg_tooltip2')"
              :theme="`outlined`"
            />
          </FormLabel>
          <FormAutoComplete
            v-model="modelValue.keyword"
            :placeholder="$t('pages.analysis.key_work_placeholder')"
            :name="'keyword'"
            :size="'large'"
            :is-disabled="isSearching"
          >
          </FormAutoComplete>
        </div>
        <div class="w-300px ml-32px <tablet:w-full <tablet:ml-0">
          <FormLabel :label="$t('components.search_video.judgment_criteria')">
            <!-- <Tooltip
              :title="`Demo`"
              :theme="`twotone`"
              :two-tone-color="`#898989`"
            /> -->
            <Popover
              :title="$t('components.search_video.title_tooltip1')"
              :content="$t('components.search_video.msg_tooltip1')"
              :theme="`outlined`"
            />
          </FormLabel>

          <FormTextInput
            v-model="modelValue.coefficient"
            :name="'coefficient'"
            :size="`large`"
            class-name="w-120px"
            :placeholder="$t('components.search_video.placeholder_coefficient')"
            :before-sub="$t('components.search_video.coefficient')"
            :after-sub="$t('components.search_video.considered_excellent')"
            :disabled="isSearching"
            class-name-before-sub="mr-5px w-40px"
            class-name-after-sub="ml-5px w-140px"
          >
          </FormTextInput>
        </div>
      </div>

      <div class="flex items-end flex-wrap -mb-24px -mt-5px">
        <div class="w-210px <tablet:w-full">
          <FormLabel :label="$t('pages.analysis.period_specification')" />
          <FormSelect
            v-model="modelValue.specification"
            :size="`large`"
            :items="PeriodSpecificationLists"
            :disabled="isSearching"
            @change="changeSpecification"
          >
          </FormSelect>
        </div>

        <div class="w-310px ml-12px <tablet:w-full <tablet:ml-0">
          <FormDateRangePicker
            v-model="modelValue.periodOfTime"
            :format="FormatDateEnum.FORMAT_NORMAL"
            :value-format="FormatDateEnum.FORMAT_DATE"
            :disabled="modelValue.specification !== 1 || isSearching"
            :size="`large`"
            :show-time="$device.isTablet || $device.isMobile ? true : false"
          >
          </FormDateRangePicker>
        </div>

        <div class="w-200px ml-auto <tablet:w-full">
          <Button
            :label="$t('pages.analysis.search')"
            :icon="SearchOutlined"
            :disabled="isSearching"
            @click="handleSearch"
          ></Button>
        </div>
      </div>
    </a-form>
  </div>
</template>

<style lang="scss" scoped>
// :deep(.ant-form-item) {
//   @include mq-up(pc) {
//     margin-bottom: 0;
//   }
// }
</style>
