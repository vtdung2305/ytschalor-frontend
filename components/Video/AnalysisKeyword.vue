<script setup lang="ts">
import { PropType } from 'vue'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import { IItemObject, INotification } from '@/interfaces/common'
import { PeriodLists, ErrorCodeEnum } from '@/constants/video'
import { ILineChart } from '@/interfaces/chart'
import { ColorEnum } from '@/constants/color'
import { IVideoInfo, IKeywordAnalysis } from '@/interfaces/video'
import { FormatDateEnum } from '@/constants/common'
import { copyClipboard } from '@/helper/common'

const props = defineProps({
  videoInfo: {
    type: Object as PropType<IVideoInfo | null>,
    default: () => {},
  },
})

const { t } = useLang()

const { isPlanFree, showNotification } = useHelper()

const isLimitSearch = ref<boolean>(false)

const options = computed(() => {
  if (!props.videoInfo || !props.videoInfo?.tags.length) return []
  return props.videoInfo.tags.map((e) => {
    return {
      label: e,
      value: e,
    }
  })
})

const selectKeyword = ref<string[]>([])

const keywordOptions = computed(() => {
  return options.value.map((e) => {
    return {
      ...e,
      disabled: !!(
        selectKeyword.value.length === 5 &&
        !selectKeyword.value.includes(e.value)
      ),
    }
  })
})

const keywordParams = computed(() => selectKeyword.value.join(','))

const period = ref<string | null>(null)

const optionChart = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'start',
      maxWidth: 50,
      labels: {
        color: '#7C7C7C',
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
      title: {
        padding: 10,
      },
    },
    tooltip: {
      enabled: true,
      usePointStyle: true,
      callbacks: {
        title: function (context: any) {
          const label = context[0].label || ''

          return label ? dayjs(label).format(FormatDateEnum.FORMAT_NORMAL) : ''
        },
        label: function (context: any) {
          let label = context.dataset.label || ''

          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y
          }

          return ` ${label}`
        },
        labelColor: function (context: any) {
          return {
            borderColor: context.dataset.borderColor,
            backgroundColor: context.dataset.backgroundColor,
            borderWidth: 1,
            borderRadius: 2,
          }
        },
      },
    },
  },
  scales: {
    x: {
      max: 300,
      min: 0,
      time: {
        unit: 'quarter',
      },
      ticks: {
        autoSkip: false,
        callback: function (val: any, index: number): any {
          const _this = this as any

          const month: string = dayjs(_this.getLabelForValue(val)).format('M')

          const day: string = dayjs(_this.getLabelForValue(val)).format('D')

          if (period.value === '1y') {
            return Number(month) % 3 === 0 &&
              Number(day) > 23 &&
              Number(day) !== 31
              ? dayjs(_this.getLabelForValue(val)).format(
                  FormatDateEnum.FORMAT_YEAR_MONTH
                )
              : null
          } else {
            return Number(month) % 6 === 0 &&
              Number(day) > 23 &&
              Number(day) !== 31
              ? dayjs(_this.getLabelForValue(val)).format(
                  FormatDateEnum.FORMAT_YEAR_MONTH
                )
              : null
          }
        },
      },
    },
  },
  adapters: {
    date: {
      locale: 'ja',
    },
  },
})

const isLoading = ref<boolean>(false)

const chartStorage = ref<ILineChart>({
  labels: [],
  datasets: [
    {
      label: '',
      backgroundColor: '#fff',
      fillColor: '#fff',
      data: [],
      borderWidth: 2,
      borderColor: ColorEnum.COLOR_ONE,
      pointBorderColor: ColorEnum.COLOR_ONE,
      pointRadius: 1,
      fill: false,
      pointStyle: 'line',
    },
    {
      label: '',
      backgroundColor: '#fff',
      data: [],
      borderWidth: 2,
      borderColor: ColorEnum.COLOR_TWO,
      pointRadius: 1,
      pointBorderColor: ColorEnum.COLOR_TWO,
      fill: false,
      pointStyle: 'line',
    },
    {
      label: '',
      backgroundColor: '#fff',
      data: [],
      borderWidth: 2,
      borderColor: ColorEnum.COLOR_THREE,
      pointRadius: 1,
      pointBorderColor: ColorEnum.COLOR_THREE,
      fill: false,
      pointStyle: 'line',
    },
    {
      label: '',
      backgroundColor: '#fff',
      data: [],
      borderWidth: 2,
      borderColor: ColorEnum.COLOR_FOUR,
      pointRadius: 1,
      pointBorderColor: ColorEnum.COLOR_FOUR,
      fill: false,
      pointStyle: 'line',
    },
    {
      label: '',
      backgroundColor: '#fff',
      data: [],
      borderWidth: 2,
      borderColor: ColorEnum.COLOR_FIVE,
      pointRadius: 1,
      pointBorderColor: ColorEnum.COLOR_FIVE,
      fill: false,
      pointStyle: 'line',
    },
  ],
})

const chartSample = ref<ILineChart>({
  labels: ['Test 01', 'Test 02', 'Test 03', 'Test 04', 'Test 05'],
  datasets: [
    {
      label: 'Test 01',
      backgroundColor: '#fff',
      fillColor: '#fff',
      data: [1, 2, 4, 50, 20],
      borderWidth: 2,
      borderColor: ColorEnum.COLOR_ONE,
      pointBorderColor: ColorEnum.COLOR_ONE,
      pointRadius: 1,
      fill: false,
      pointStyle: 'line',
    },
    {
      label: '',
      backgroundColor: '#fff',
      data: [50, 2, 4, 50, 30],
      borderWidth: 2,
      borderColor: ColorEnum.COLOR_TWO,
      pointRadius: 1,
      pointBorderColor: ColorEnum.COLOR_TWO,
      fill: false,
      pointStyle: 'line',
    },
    {
      label: '',
      backgroundColor: '#fff',
      data: [1, 2, 4, 50, 20],
      borderWidth: 2,
      borderColor: ColorEnum.COLOR_THREE,
      pointRadius: 1,
      pointBorderColor: ColorEnum.COLOR_THREE,
      fill: false,
      pointStyle: 'line',
    },
    {
      label: '',
      backgroundColor: '#fff',
      data: [1, 2, 4, 50, 20],
      borderWidth: 2,
      borderColor: ColorEnum.COLOR_FOUR,
      pointRadius: 1,
      pointBorderColor: ColorEnum.COLOR_FOUR,
      fill: false,
      pointStyle: 'line',
    },
    {
      label: '',
      backgroundColor: '#fff',
      data: [1, 2, 4, 50, 20],
      borderWidth: 2,
      borderColor: ColorEnum.COLOR_FIVE,
      pointRadius: 1,
      pointBorderColor: ColorEnum.COLOR_FIVE,
      fill: false,
      pointStyle: 'line',
    },
  ],
})

const chartData = ref<ILineChart>({
  labels: [],
  datasets: [],
})

const analysisData = ref<number[]>([])

const handleInterestOverTime = async () => {
  isLoading.value = true
  try {
    const params = {
      keywords: toRaw(selectKeyword.value),
      period: toRaw(period.value),
      data: props.videoInfo?.tags,
    }

    const { $api } = useNuxtApp()

    const res = await $api.video.interestOverTime(params)

    if (res && res.data) {
      isLimitSearch.value = false
      if (Array.isArray(res.data) && !res.data.length) {
        isLoading.value = false
        chartData.value.labels = []
        chartData.value.datasets = []
        return false
      }

      const analysisData = res.data.data

      const labels = analysisData.map((e: any) => e[e.length - 1])

      const chartValue = selectKeyword.value.map((val: any, index: number) => {
        const data = analysisData.map((e: any) => e[index])

        return data
      })

      chartStorage.value.labels = labels
      selectKeyword.value.forEach((val, index) => {
        chartStorage.value.datasets[index].label = val
        chartStorage.value.datasets[index].data = chartValue[index]
      })
      const count = selectKeyword.value.length

      chartData.value = cloneDeep(toRaw(chartStorage.value))
      if (count < 5) {
        // chartData.value.labels.splice(count - 5)
        chartData.value.datasets.splice(count - 5)
      }

      isLoading.value = false
    }
  } catch (error: any) {
    isLoading.value = false
    chartData.value.labels = []
    chartData.value.datasets = []
    if (
      error?._data?.error_code === ErrorCodeEnum.TRENDS_REQUEST_LIMIT_EXCEEDED
    ) {
      isLimitSearch.value = true
    }
    throw { message: error }
  }
}

const handleCopyKeywords = async () => {
  if (!options.value.length) return
  const keywords = options.value.map((e) => e.label).join(', ')

  await copyClipboard(keywords)

  const params = {
    description: t('components.analysis_keyword.msg_copied'),
    duration: 4.5,
    icon: true,
    status: true,
  }

  showNotification(params as INotification)
}

watch(
  selectKeyword,
  (newVal) => {
    if (newVal.length) {
      // await handleInterestOverTime()
    } else {
      chartData.value.labels = []
      chartData.value.datasets = []
    }
  },
  {
    deep: true,
  }
)
</script>

<template>
  <div class="relative">
    <template v-if="!options.length">
      <p class="desc-keyword pb-30px">
        {{ $t('components.analysis_keyword.notify') }}
      </p>
    </template>
    <template v-else>
      <p class="desc-keyword pb-30px">
        {{
          $t('components.analysis_keyword.desc_keyword', {
            max: 100,
          })
        }}
      </p>
      <div class="note-keyword">
        <p class="text-16px leading-26px">
          {{
            $t('components.analysis_keyword.note_keyword', {
              max: 100,
            })
          }}
        </p>
      </div>
      <div class="checkbox-keyword mt-10px">
        <FormCheckboxGroup
          v-model="selectKeyword"
          :options="keywordOptions"
          :disabled="isLoading || isPlanFree"
        ></FormCheckboxGroup>
      </div>
      <div class="copy-keyword mt-28px">
        <span
          class="copy <tablet:text-13px cursor-pointer"
          @click="handleCopyKeywords"
          >{{ $t('components.analysis_keyword.copy_keyword') }}</span
        >
      </div>
      <div class="form-keyword mt-48px <tablet:mt-30px">
        <div
          class="head-form flex justify-between items-center <tablet:flex-wrap"
        >
          <p class="text-16px leading-26px">
            {{ $t('components.analysis_keyword.trend_keyword') }}
          </p>
          <div class="form-select w-210px <tablet:w-full <tablet:mt-10px">
            <FormSelect
              v-model="period"
              :size="`small`"
              :placeholder="$t('pages.analysis.key_work_placeholder')"
              :items="PeriodLists"
              :disabled="isLoading || isPlanFree"
            ></FormSelect>
          </div>
        </div>

        <div class="action-form mt-25px">
          <Button
            :label="$t('components.analysis_keyword.btn_submit')"
            class="w-150px <tablet:w-full"
            :disabled="!selectKeyword.length || !period || isLoading"
            @click="handleInterestOverTime"
          ></Button>
        </div>

        <div class="body-form mt-26px">
          <div id="lineChart" class="relative">
            <template v-if="isPlanFree">
              <div :class="{ blurry: isPlanFree }">
                <LineChart
                  :chart-data="chartSample"
                  :option-chart="optionChart"
                  :year="period"
                />
              </div>
              <ModalPaidMember v-if="isPlanFree" />
            </template>

            <template v-else>
              <template v-if="!isLimitSearch">
                <LineChart
                  v-if="!isLoading && chartData.labels.length"
                  :chart-data="chartData"
                  :option-chart="optionChart"
                  :year="period"
                />
                <NoData
                  v-if="!chartData.labels.length && !isLoading"
                  :message="$t('others.no_data2')"
                  class="!h-350px"
                />
              </template>
              <template v-else>
                <p class="text-16px leading-normal pb-18px">
                  {{ $t('components.analysis_keyword.limit_search_one') }}<br />
                  {{ $t('components.analysis_keyword.limit_search_two') }}
                </p>
                <nuxt-link
                  :to="`https://trends.google.com/trends/explore?date=today%205-y&geo=JP&q=${keywordParams}&hl=ja`"
                  class="c-link text-16px"
                  target="_blank"
                  >{{ $t('components.analysis_keyword.google_link')
                  }}<span class="c-icon-vector"></span
                ></nuxt-link>
              </template>
            </template>
          </div>
        </div>
        <SearchLoading v-if="isLoading" class="!h-350px" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-checkbox-group) {
  display: flex;
  column-gap: 16px;
  row-gap: 8px;
}

.copy {
  cursor: pointer;
  color: $color_blue;
  padding-bottom: 4px;
  border-bottom: 2px solid $color_blue;
}

:deep(.ant-form-item) {
  margin-bottom: 0;
}

.head-form {
  padding-bottom: 3px;
  border-bottom: 1px solid $color_gray1;
}

.form-select {
  :deep(.ant-select.ant-select-in-form-item) {
    height: 24px;
  }

  :deep(.ant-select-single.ant-select-sm .ant-select-selector) {
    height: 24px;
  }

  :deep(
      .ant-select-single.ant-select-sm
        .ant-select-selector
        .ant-select-selection-item
    ) {
    line-height: 24px;
  }
}

.c-link {
  color: $color_black2;
  border-bottom: 1px solid $color_black2;
}
</style>
