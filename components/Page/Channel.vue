<script lang="ts" setup>
import {
  SearchOutlined,
  DownloadOutlined,
  LockOutlined,
} from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import dayjs from 'dayjs'
import CountUp from 'vue-countup-v3'
import { INotification, IModalParams } from '@/interfaces/common'
import { IFilterSearchChannel, IChannel } from '@/interfaces/channel'
import { useChannel } from '@/stores/channel'
import { ITab } from '@/interfaces/tabs'
import {
  FormatDateEnum,
  TitleLoading,
  TabTypeEnum,
  REGEX_COEFFICIENT,
  GoogleTypeEnum,
} from '@/constants/common'
import { useUser } from '@/stores/user'
import { PlanEnum } from '@/constants/plan'
import { comma } from '@/helper/number'
import { ChannelDataSample } from '@/constants/channel'
import {
  PeriodSpecificationEnum,
  ErrorCode,
  ErrorCodeEnum,
} from '@/constants/video'
import { CookieKeyEnum } from '@/constants/cookie'
import { useVideo } from '@/stores/video'

const router = useRouter()

const channelStore = useChannel()

const videoStore = useVideo()

const { $api } = useNuxtApp()

const {
  setLoadingDrawer,
  showNotification,
  formatDate,
  convertKeyword,
  subtractDate,
  currentDate,
} = useHelper()

const { t } = useLang()

const formStateSearch = reactive({
  periodOfTime: null,
  coefficient: 3,
  coefficient_view: 30000,
} as IFilterSearchChannel)

const isLoading = ref<boolean>(false)

const searchConditionsList = [
  {
    label: t('pages.analysis.channel.relevance'),
    value: t('pages.analysis.channel.relevance_value'),
  },
  {
    label: t('pages.analysis.channel.number_of_views'),
    value: t('pages.analysis.channel.number_of_views_value'),
  },
]

const periodSpecificationList = [
  {
    label: t('pages.analysis.channel.custom'),
    value: t('pages.analysis.channel.custom'),
  },
  {
    label: t('pages.analysis.channel.7_days'),
    value: t('pages.analysis.channel.7_days'),
  },
  {
    label: t('pages.analysis.channel.14_days'),
    value: t('pages.analysis.channel.14_days'),
  },
  {
    label: t('pages.analysis.channel.1_month'),
    value: t('pages.analysis.channel.1_month'),
  },
]

const periodSpecification = ref<string>(t('pages.analysis.channel.custom'))

const filterChanelList = [
  {
    label: t('pages.analysis.channel.playback_times'),
    value: t('pages.analysis.channel.playback_times_value'),
  },
  {
    label: t('pages.analysis.channel.channel_open_day'),
    value: t('pages.analysis.channel.channel_open_day_value'),
  },
  {
    label: t('pages.analysis.channel.number_of_channels_registered'),
    value: t('pages.analysis.channel.number_of_channels_registered_value'),
  },
]

const filterChanel = ref<string>(
  t('pages.analysis.channel.playback_times_value')
)

const sortList = [
  {
    label: t('pages.analysis.channel.ascending_order'),
    value: t('pages.analysis.channel.ascending_value'),
  },
  {
    label: t('pages.analysis.channel.descending_order'),
    value: t('pages.analysis.channel.descending_value'),
  },
]

const sort = ref<string>(t('pages.analysis.channel.descending_value'))

const checked = ref<Boolean>(false)

const analyze = ref<Boolean>(false)

const descItemChannel = ref<string>()

const formStateSearchVideoChannel = reactive({
  channel_id: '',
  coefficient: 3,
  date_from: '',
  date_to: '',
})

const periodSpecificationSearchVideoChannel = ref<string>(
  t('pages.analysis.channel.custom')
)

const periodOfTime = ref()

const rulesSearchVideoChannel: Record<string, Rule[]> = {
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

const formSearchVideoChannel = ref()

const loadingSearchVideoChannel = ref<Boolean>(false)

const handelSearchVideoChannel = () => {
  formSearchVideoChannel.value
    .validate()
    .then(async () => {
      loadingSearchVideoChannel.value = true

      const params = {
        channel_id: channelStore?.channelDetail?.id as string,
        coefficient: formStateSearchVideoChannel.coefficient,
        date_from: periodOfTime.value ? periodOfTime.value[0] : '',
        date_to: periodOfTime.value ? periodOfTime.value[1] : '',
      }

      await channelStore.getListVideoChannel(params)

      if (channelStore.listVideoChannel.length > 0) {
        const keyword = channelStore.listVideoChannel
          .map((item) => `${item.title} ${item.description}`)
          .join('')

        await analysisKeywordVideoChannel([keyword] as string[])
      } else {
        analysisVideoChannelLists.value = []
      }

      loadingSearchVideoChannel.value = false
    })
    .catch((e: any) => {
      // console.log(e)
    })
}

const {
  analysisTitleLists,
  analysisKeyword,
  analysisKeywordVideoChannel,
  analysisVideoChannelLists,
} = useAnalysis()

const analyzeChannel = async (itemChannel: IChannel) => {
  analyze.value = true
  descItemChannel.value = itemChannel.description

  setLoadingDrawer(true, TitleLoading.LoadingList)
  await channelStore.getChannelDetail(itemChannel.id)
  setLoadingDrawer(false)
}

const thumbnail = computed(() => {
  if (channelStore.channelDetail?.thumbnail?.high) {
    return channelStore.channelDetail?.thumbnail?.high
  } else if (channelStore.channelDetail?.thumbnail?.medium) {
    return channelStore.channelDetail?.thumbnail?.medium
  } else {
    return channelStore.channelDetail?.thumbnail?.default
  }
})

const thumbnailBranding = computed(() => {
  if (channelStore.channelDetail?.branding?.image) {
    return channelStore.channelDetail?.branding?.image
  }
})

const currentTab = ref(1)

const tabs = reactive<ITab[]>([
  {
    key: 1,
    name: t('pages.analysis.channel.tab_basic_information'),
  },
  {
    key: 2,
    name: t('pages.analysis.channel.tab_channel_overview_analysis'),
  },
  {
    key: 3,
    name: t('pages.analysis.channel.tab_video_title_analysis'),
  },
])

const formSearch = ref()

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
  coefficient_view: [
    {
      required: true,
      message: t('common.filed_no_required', {
        field: t('pages.analysis.channel_item.average_number'),
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
  // periodOfTime: [
  //   {
  //     type: 'array' as const,
  //     required: true,
  //     message: t('common.filed_no_required', {
  //       field: '',
  //     }),
  //   },
  // ],
}

const userStore = useUser()

const route = useRoute()

const isPlanFree = computed((): boolean => userStore.planType === PlanEnum.FREE)

const setIsLoading = (val: boolean) => {
  isLoading.value = val
}

const openChannel = (url: string) => {
  window.open(`https://www.youtube.com/${url}`, '_blank')
}

const handelSearch = () => {
  formSearch.value
    .validate()
    .then(async () => {
      await setIsLoading(true)
      await channelStore.setFilterSearch({
        ...formStateSearch,
        periodSpecification: periodSpecification.value as string,
      })
      const params = {
        keyword: formStateSearch.keyword,
        order: formStateSearch.order,
        date_from: formStateSearch.periodOfTime
          ? formStateSearch.periodOfTime[0]
          : '',
        date_to: formStateSearch.periodOfTime
          ? formStateSearch.periodOfTime[1]
          : '',
        coefficient: formStateSearch.coefficient,
        coefficient_view: formStateSearch.coefficient_view,
      }

      await channelStore
        .getSearchChannel(params)
        .then(async () => {
          await channelStore.sortFilterSearch('viewCount', 'desc', false)
          await channelStore.resetFilterSort()
          filterChanel.value = t('pages.analysis.channel.playback_times_value')
          sort.value = t('pages.analysis.channel.descending_value')
          checked.value = false
        })
        .catch(async (e) => {
          if (e?.status === 400) {
            if (ErrorCode.includes(e?._data?.error_code)) {
              const params = {
                description: e?._data?.message,
                duration: 4.5,
                icon: true,
                status: false,
              }

              showNotification(params as INotification)

              if (
                e?._data?.error_code ===
                ErrorCodeEnum.RATE_SEARCH_LIMIT_EXCEEDED
              ) {
                await videoStore.$reset()
                await channelStore.$reset()
              }
            } else if (e?._data?.error_code === ErrorCodeEnum.API_KEY_INVALID) {
              const userData = localStorage.getItem(CookieKeyEnum.USER_DATA)

              if (userData) {
                const data = JSON.parse(userData)

                data.google_api_key_configured = false

                localStorage.setItem(
                  CookieKeyEnum.USER_DATA,
                  JSON.stringify(data)
                )

                userStore.setUser(data)
              }

              // $api.user
              //   .settingKey({ handle_action: GoogleTypeEnum.DELETE })
              //   .then(async () => {})
              //   .catch(async (e: any) => {})

              await setIsLoading(false)
              const params = {
                message: t('components.notification.message_warning'),
                description: t('pages.login.msg_google_api_key'),
                btn: t('components.notification.btn_setting'),
              }

              const confirm = await showNotification(params as INotification)

              if (confirm) router.push('/user-settings')
            } else {
              await setIsLoading(false)
              const params = {
                message: t('components.notification.message_warning'),
                description: t('pages.login.msg_google_api_key'),
                btn: t('components.notification.btn_setting'),
              }

              const confirm = await showNotification(params as INotification)

              if (confirm) router.push('/user-settings')
            }
          }
        })
      await setIsLoading(false)
    })
    .catch(() => {})
}

const handelDownLoadCsv = async () => {
  const { $modalConfirm } = useNuxtApp()

  const params: IModalParams = {
    title: t('components.modal_export_csv.title'),
    content: t('components.modal_export_csv.content'),
    okText: t('components.modal_export_csv.okText'),
    okType: 'primary',
    cancelText: t('components.modal_export_csv.cancelText'),
  }

  const confirm = await $modalConfirm(params)

  if (!confirm) {
    return false
  }
  try {
    $api.channel
      .exportChannel({
        data: channelStore.channelList,
        keyword: channelStore.filterSearch?.keyword,
      })
      .then((e: any) => {
        window.location.href = e?.data?.url
      })
      .catch((e: any) => {
        const params = {
          description: t('common.serve_error'),
          duration: 4.5,
          icon: true,
          status: false,
        }

        showNotification(params as INotification)
      })
  } catch (error) {}
}

const callbackAnalysis = async () => {
  setLoadingDrawer(true, TitleLoading.LoadingList)
  if (descItemChannel.value) {
    await analysisKeyword([descItemChannel.value] as string[])
  }
  setLoadingDrawer(false)
}

onMounted(() => {
  formStateSearch.order = t('pages.analysis.channel.relevance_value')

  if (channelStore.filterSearch) {
    formStateSearch.keyword = channelStore.filterSearch.keyword
    formStateSearch.order = channelStore.filterSearch.order
    formStateSearch.periodOfTime = channelStore.filterSearch.periodOfTime
    periodSpecification.value = channelStore.filterSearch
      .periodSpecification as string
    formStateSearch.coefficient = channelStore.filterSearch.coefficient
    formStateSearch.coefficient_view =
      channelStore.filterSearch.coefficient_view
  }

  if (channelStore.filterSort) {
    filterChanel.value = channelStore.filterSort.key
    sort.value = channelStore.filterSort.order
    checked.value = channelStore.filterSort.checked
  }

  if (route.query.keyword && route.query.type === TabTypeEnum.CHANNEL) {
    formStateSearch.keyword = route.query.keyword as string
    handelSearch()
  }
})

watch(
  () => periodSpecification.value,
  () => {
    if (periodSpecification.value === t('pages.analysis.channel.custom')) {
      delete formStateSearch.periodOfTime
      formSearch.value.validateFields('periodOfTime')
    }

    if (periodSpecification.value === t('pages.analysis.channel.7_days')) {
      const dateFrom = dayjs().subtract(7, 'day').format('YYYY/MM/DD')

      const dateTo = dayjs().format('YYYY/MM/DD')

      formStateSearch.periodOfTime = [dateFrom, dateTo]
      formSearch.value.validateFields('periodOfTime')
    }

    if (periodSpecification.value === t('pages.analysis.channel.14_days')) {
      const dateFrom = dayjs().subtract(14, 'day').format('YYYY/MM/DD')

      const dateTo = dayjs().format('YYYY/MM/DD')

      formStateSearch.periodOfTime = [dateFrom, dateTo]
      formSearch.value.validateFields('periodOfTime')
    }

    if (periodSpecification.value === t('pages.analysis.channel.1_month')) {
      const dateFrom = dayjs().subtract(30, 'day').format('YYYY/MM/DD')

      const dateTo = dayjs().format('YYYY/MM/DD')

      formStateSearch.periodOfTime = [dateFrom, dateTo]
      formSearch.value.validateFields('periodOfTime')
    }
  },
  { flush: 'post' }
)

watch(
  () => sort.value,
  () => {
    channelStore.sortFilterSearch(
      filterChanel.value,
      sort.value,
      checked.value as boolean
    )
    channelStore.setFilterSort({
      key: filterChanel.value,
      order: sort?.value,
      checked: checked?.value as boolean,
    })
  },
  { flush: 'post' }
)

watch(
  () => filterChanel.value,
  () => {
    channelStore.sortFilterSearch(
      filterChanel.value,
      sort.value,
      checked.value as boolean
    )
    channelStore.setFilterSort({
      key: filterChanel.value,
      order: sort?.value,
      checked: checked?.value as boolean,
    })
  },
  { flush: 'post' }
)

watch(
  () => checked.value,
  () => {
    channelStore.sortFilterSearch(
      filterChanel.value,
      sort.value,
      checked.value as boolean
    )
    channelStore.setFilterSort({
      key: filterChanel.value,
      order: sort?.value,
      checked: checked?.value as boolean,
    })
  },
  { flush: 'post' }
)

watch(
  () => analyze.value,
  () => {
    if (!analyze.value) {
      currentTab.value = 1
      periodOfTime.value = []
      periodSpecificationSearchVideoChannel.value = t(
        'pages.analysis.channel.custom'
      )
      formStateSearchVideoChannel.coefficient = 3
      formStateSearchVideoChannel.date_from = ''
      formStateSearchVideoChannel.date_to = ''
      analysisTitleLists.value = []
      analysisVideoChannelLists.value = []
      channelStore.listVideoChannel = []
    }
  }
)

watch(
  () => currentTab.value,
  async () => {
    if (currentTab.value === 2 && analysisTitleLists.value.length === 0) {
      setLoadingDrawer(true, TitleLoading.LoadingList)
      if (descItemChannel.value) {
        await analysisKeyword([descItemChannel.value] as string[])
      }
      setLoadingDrawer(false)
    }
    // if (
    //   currentTab.value === 3 &&
    //   analysisVideoChannelLists.value.length === 0
    // ) {
    //   formStateSearchVideoChannel.channel_id = channelStore.channelDetail
    //     ?.id as string
    //   setLoadingDrawer(true, TitleLoading.LoadingList)
    //   await channelStore.getListVideoChannel(formStateSearchVideoChannel)

    //   const keyword = channelStore.listVideoChannel
    //     .map((item) => `${item.title} ${item.description}`)
    //     .join('')

    //   await analysisKeywordVideoChannel([keyword] as string[])
    //   setLoadingDrawer(false)
    // }
  }
)

watch(
  () => periodSpecificationSearchVideoChannel.value,
  () => {
    if (
      periodSpecificationSearchVideoChannel.value ===
      t('pages.analysis.channel.custom')
    ) {
      periodOfTime.value = []
    }

    if (
      periodSpecificationSearchVideoChannel.value ===
      t('pages.analysis.channel.7_days')
    ) {
      formStateSearchVideoChannel.date_from = dayjs(
        subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_7_DAY)
      ).format(FormatDateEnum.FORMAT_DATE_PARAMS)
      formStateSearchVideoChannel.date_to = dayjs(currentDate.value).format(
        FormatDateEnum.FORMAT_DATE_PARAMS
      )

      periodOfTime.value = [
        subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_7_DAY),
        currentDate.value,
      ]
    }

    if (
      periodSpecificationSearchVideoChannel.value ===
      t('pages.analysis.channel.14_days')
    ) {
      formStateSearchVideoChannel.date_from = dayjs(
        subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_14_DAY)
      ).format(FormatDateEnum.FORMAT_DATE_PARAMS)
      formStateSearchVideoChannel.date_to = dayjs(currentDate.value).format(
        FormatDateEnum.FORMAT_DATE_PARAMS
      )

      periodOfTime.value = [
        subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_14_DAY),
        currentDate.value,
      ]
    }

    if (
      periodSpecificationSearchVideoChannel.value ===
      t('pages.analysis.channel.1_month')
    ) {
      formStateSearchVideoChannel.date_from = dayjs(
        subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_MONTH)
      ).format(FormatDateEnum.FORMAT_DATE_PARAMS)
      formStateSearchVideoChannel.date_to = dayjs(currentDate.value).format(
        FormatDateEnum.FORMAT_DATE_PARAMS
      )

      periodOfTime.value = [
        subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_MONTH),
        currentDate.value,
      ]
    }
  },
  { flush: 'post' }
)

watch(currentTab, (newVal) => {
  if (newVal) {
    const elm: HTMLCollection | any =
      window.document.getElementsByClassName('ant-drawer-body')[0]

    if (elm) {
      setTimeout(() => {
        elm.scrollTop = 0
      }, 20)
    }
  }
})
</script>

<template>
  <div>
    <PageBody>
      <a-form ref="formSearch" :model="formStateSearch" :rules="rules">
        <div class="mt-10px -mb-5px flex <laptop:flex-col">
          <div class="w-380px <laptop:w-full">
            <FormLabel :label="$t('pages.analysis.key_work')">
              <Popover
                :title="$t('components.search_video.title_tooltip2')"
                :content="$t('components.search_video.msg_tooltip2')"
                :theme="`outlined`"
              />
            </FormLabel>
            <FormAutoComplete
              v-model="formStateSearch.keyword"
              :placeholder="$t('pages.analysis.key_work_placeholder')"
              :name="'keyword'"
              :size="'large'"
              class="w-380px <laptop:w-full"
              :is-disabled="isLoading"
            >
            </FormAutoComplete>
          </div>
          <div class="ml-32px <laptop:ml-0">
            <FormLabel :label="$t('components.search_video.judgment_criteria')">
              <Popover
                :title="$t('components.search_video.title_tooltip1')"
                :content="$t('components.search_video.msg_tooltip1')"
                :theme="`outlined`"
              />
            </FormLabel>

            <FormTextInput
              v-model="formStateSearch.coefficient"
              :name="'coefficient'"
              :size="`large`"
              class-name="w-120px <laptop:w-full"
              :placeholder="
                $t('components.search_video.placeholder_coefficient')
              "
              :before-sub="$t('components.search_video.coefficient')"
              :disabled="isLoading"
              class-name-before-sub="mr-3px w-40px"
              class-name-after-sub="ml-10px"
            >
            </FormTextInput>
          </div>
          <div class="w-full ml-15px <laptop:ml-0">
            <FormLabel :label="'hidden'" class="c-hidden"> </FormLabel>
            <FormTextInput
              v-model="formStateSearch.coefficient_view"
              :name="'coefficient_view'"
              :size="`large`"
              :placeholder="
                $t('pages.analysis.channel.coefficient_view_placeholder')
              "
              :before-sub="t('pages.analysis.channel_item.average_number')"
              class-name-before-sub="mr-3px w-200px <laptop:w-160px"
              :disabled="isLoading"
            >
            </FormTextInput>
          </div>
        </div>

        <div
          class="-mb-24px -mt-3px flex items-end justify-between <laptop:flex-col <laptop:items-stretch"
        >
          <div class="flex items-end <laptop:flex-col">
            <FormSelect
              v-model="periodSpecification"
              class="w-180px <laptop:w-full"
              :label="$t('pages.analysis.period_specification')"
              :size="`large`"
              :items="periodSpecificationList"
              :is-disabled="isLoading"
            >
            </FormSelect>

            <FormDatePicker
              v-model="formStateSearch.periodOfTime"
              class="ml-8px w-310px <laptop:w-full"
              :size="`large`"
              :format="FormatDateEnum.FORMAT_NORMAL"
              :value-format="FormatDateEnum.FORMAT_DATE"
              :name="'periodOfTime'"
              :is-disabled="
                periodSpecification !== t('pages.analysis.channel.custom') ||
                isLoading
              "
              :show-time="$device.isTablet || $device.isMobile ? true : false"
            >
            </FormDatePicker>
            <div class="ml-22px w-160px <laptop:w-full <laptop:ml-0">
              <FormSelect
                v-model="formStateSearch.order"
                :label="$t('pages.analysis.search_conditions')"
                :size="`large`"
                :items="searchConditionsList"
                :is-disabled="isLoading"
              >
              </FormSelect>
            </div>
          </div>

          <Button
            class="ml-22px w-200px <laptop:w-full <laptop:ml-0"
            :label="$t('pages.analysis.search')"
            :icon="SearchOutlined"
            :disabled="isLoading"
            @click="handelSearch"
          ></Button>
        </div>
      </a-form>
    </PageBody>

    <template v-if="!isLoading">
      <PageBody v-if="channelStore.channelList.length > 0">
        <div class="text-20px">
          {{ $t('pages.analysis.search_results') }}
          {{ channelStore.channelList.length }}
          {{ $t('pages.analysis.pieces') }}
        </div>
        <div class="search-panel pb-16px">
          <div class="flex items-center gap-x-24px flex-wrap <tablet:gap-12px">
            <div class="item">
              <span class="item-index">{{
                $t('components.search_panel.good_number')
              }}</span>
              <span class="item-value">
                <template v-if="!isLoading">
                  <count-up
                    :start-val="0"
                    :end-val="
                      channelStore.channelListIncludes
                        ?.number_channel_have_greater_than_coefficient || 0
                    "
                  >
                    <template #suffix>
                      {{ $t('components.units.pieces') }}
                    </template>
                  </count-up>
                </template>
                <template v-else>
                  ー {{ $t('components.units.pieces') }}
                </template>
              </span>
            </div>
            <div class="item">
              <span class="item-index">{{
                $t('components.search_panel.average_number')
              }}</span>
              <span class="item-value">
                <template v-if="!isLoading">
                  <count-up
                    :start-val="0"
                    :end-val="
                      channelStore.channelListIncludes
                        ?.average_number_of_views || 0
                    "
                  >
                    <template #suffix>
                      {{ $t('components.units.time') }}
                    </template>
                  </count-up>
                </template>
                <template v-else>
                  ー {{ $t('components.units.time') }}
                </template>
              </span>
            </div>
            <div class="item">
              <span class="item-index">{{
                $t('components.search_panel.average_coefficient')
              }}</span>
              <template v-if="!isLoading">
                <count-up
                  :start-val="0"
                  :end-val="
                    channelStore.channelListIncludes
                      ?.average_number_of_coefficient || 0
                  "
                >
                </count-up>
              </template>
              <template v-else> ー </template>
            </div>

            <div class="item ml-auto custom-margin-bottom <tablet:mr-auto">
              <Button
                class="w-109px <laptop:w-full"
                :label="$t('pages.analysis.dowload_csv')"
                :icon="isPlanFree ? LockOutlined : DownloadOutlined"
                :disabled="isPlanFree"
                @click="handelDownLoadCsv"
              ></Button>
            </div>
          </div>
        </div>
        <div
          class="analysis-page__filter flex items-end justify-between <laptop:flex-col <laptop:items-stretch mt-24px"
        >
          <div
            class="flex items-baseline <laptop:flex-col <laptop:items-stretch"
          >
            <FormSelect
              v-model="filterChanel"
              class="w-210px <laptop:w-full"
              :items="filterChanelList"
              :size="`small`"
            >
            </FormSelect>

            <FormSelect
              v-model="sort"
              class="ml-5px w-210px <laptop:w-full <laptop:ml-0"
              :items="sortList"
              :size="`small`"
            >
            </FormSelect>

            <FormCheckbox
              v-model="checked"
              class="ml-42px w-210px <laptop:w-full <laptop:ml-0"
              :label="$t('components.sort_video.show_excellent_quality')"
            ></FormCheckbox>
          </div>
        </div>

        <div v-for="(item, index) in channelStore.channelList" :key="index">
          <AnalysisChanelItem
            :item="item"
            :coefficient="formStateSearch.coefficient"
            :view="formStateSearch.coefficient_view"
            @analyze-channel="analyzeChannel"
          ></AnalysisChanelItem>
        </div>
        <template v-if="isPlanFree">
          <div class="relative">
            <AnalysisChanelItem
              v-for="(item, index) in channelStore.channelList.slice(0, 2)"
              :key="index"
              :item="item"
              :is-blurry="true"
              @analyze-channel="analyzeChannel"
            ></AnalysisChanelItem>
            <ModalPaidMember />
          </div>
        </template>
      </PageBody>
      <PageBody v-else>
        <NoData />
      </PageBody>
    </template>
    <template v-else>
      <PageBody>
        <SearchLoading />
      </PageBody>
    </template>

    <DrawerVideo
      v-model="analyze"
      :width="$device.isTablet || $device.isMobile ? '100%' : 720"
      :title="$t('pages.analysis.channel.channel_analysis')"
    >
      <template #custom-head>
        <Tabs v-model="currentTab" :items="tabs" />
      </template>
      <div class="video-info">
        <div>
          <div v-if="currentTab === 1">
            <div
              class="flex items-center <tablet:flex-col <tablet:items-baseline"
            >
              <div
                class="video-img mr-40px w-128px <tablet:w-full <tablet:mr-0 <tablet:flex <tablet:justify-center"
              >
                <ImageVideo
                  :width="128"
                  :src-thumb="thumbnail"
                  :src-preview="thumbnail"
                />
              </div>

              <div class="flex flex-col items-baseline <tablet:mt-20px">
                <p class="video-count text-16px">
                  {{ $t('pages.analysis.channel_item.coefficient') }}
                  {{
                    formatTwoDecimal(
                      channelStore.channelDetail?.coefficient as number
                    )
                  }}
                </p>
                <p
                  class="video-ttl"
                  @click="
                    openChannel(channelStore.channelDetail?.customUrl as string)
                  "
                >
                  <span class="video-ttl_title">
                    {{ channelStore.channelDetail?.title }}
                  </span>
                  <span class="c-icon-vector"></span>
                </p>
              </div>
            </div>

            <div class="video-tbl mt-24px">
              <table class="c-tbl bordered">
                <tbody>
                  <tr>
                    <td>{{ $t('pages.analysis.channel.overview_channel') }}</td>
                    <td v-if="channelStore.channelDetail?.description">
                      <p
                        class="channel-desc"
                        v-html="channelStore.channelDetail?.description"
                      ></p>
                    </td>
                    <td v-else>
                      {{ $t('others.empty') }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('pages.analysis.channel.url') }}</td>
                    <td v-if="channelStore.channelDetail?.customUrl">
                      {{
                        `https://www.youtube.com/${channelStore.channelDetail?.customUrl}`
                      }}
                    </td>
                    <td v-else>
                      {{ $t('others.empty') }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('pages.analysis.channel.opening_date') }}</td>
                    <td>
                      {{
                        formatDate(
                          channelStore.channelDetail?.publishedAt as string
                        ) || $t('others.empty')
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('pages.analysis.channel.summary_view') }}</td>
                    <td>
                      {{
                        comma(channelStore.channelDetail?.viewCount as number)
                      }}
                      {{ $t('pages.analysis.channel_item.viewed_times') }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('pages.analysis.channel.registrants') }}</td>
                    <td>
                      {{
                        comma(
                          channelStore.channelDetail?.subscriberCount as number
                        )
                      }}
                      {{ $t('pages.analysis.channel_item.people') }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('pages.analysis.channel.video_count') }}</td>
                    <td>
                      {{
                        comma(channelStore.channelDetail?.videoCount as number)
                      }}
                      {{ $t('pages.analysis.channel_item.book') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <template v-if="channelStore.channelDetail?.branding">
              <p class="text-18px mt-85px mb-12px">
                {{ $t('pages.analysis.channel.brand_information') }}
              </p>
              <div
                v-if="channelStore.channelDetail?.branding?.image"
                class="w-full"
              >
                <ImageVideo
                  class="object-cover"
                  :width="'100%'"
                  :height="$device.isTablet || $device.isMobile ? '100%' : 187"
                  :src-thumb="thumbnailBranding"
                  :src-preview="thumbnailBranding"
                />
              </div>

              <div class="video-tbl mt-24px">
                <table class="c-tbl bordered">
                  <tbody>
                    <tr>
                      <td>{{ $t('pages.analysis.channel.brand_overview') }}</td>
                      <td
                        v-if="channelStore.channelDetail?.branding?.description"
                      >
                        <p
                          class="channel-desc"
                          v-html="
                            channelStore.channelDetail?.branding?.description
                          "
                        ></p>
                      </td>
                      <td v-else>
                        {{ $t('others.empty') }}
                      </td>
                    </tr>
                    <tr>
                      <td>{{ $t('pages.analysis.channel.keyword') }}</td>
                      <td>
                        {{
                          convertKeyword(
                            channelStore.channelDetail?.branding?.keywords
                          ) || $t('others.empty')
                        }}
                      </td>
                    </tr>
                    <tr>
                      <td>{{ $t('pages.analysis.channel.country') }}</td>
                      <td>
                        {{
                          channelStore.channelDetail?.branding?.country ||
                          $t('others.empty')
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
          <div v-else-if="currentTab === 2">
            <video-analysis-description
              v-if="descItemChannel"
              :video-info="channelStore.channelDetail"
              :items="analysisTitleLists"
              @callback="callbackAnalysis"
            ></video-analysis-description>
            <NoData v-else :message="$t('others.no_data2')"></NoData>
          </div>
          <div v-else-if="currentTab === 3">
            <a-form
              ref="formSearchVideoChannel"
              :model="formStateSearchVideoChannel"
              :rules="rulesSearchVideoChannel"
            >
              <div class="video-title">
                <span class="text-18px">
                  {{ $t('pages.analysis.channel.analysis_conditions') }}
                </span>
                <span class="ml-24px text-14px">
                  {{ $t('pages.analysis.channel.analysis_conditions_note') }}
                </span>
              </div>
              <div class="w-290px mt-20px -mb-6px <tablet:w-full <tablet:ml-0">
                <FormLabel
                  :label="$t('components.search_video.judgment_criteria')"
                >
                  <Popover
                    :title="$t('components.search_video.title_tooltip1')"
                    :content="$t('components.search_video.msg_tooltip1')"
                    :theme="`outlined`"
                  />
                </FormLabel>

                <FormTextInput
                  v-model="formStateSearchVideoChannel.coefficient"
                  :name="'coefficient'"
                  :size="`large`"
                  class-name="w-120px"
                  :placeholder="
                    $t('components.search_video.placeholder_coefficient')
                  "
                  :before-sub="$t('components.search_video.coefficient')"
                  :after-sub="
                    $t('components.search_video.considered_excellent')
                  "
                  class-name-before-sub="mr-5px w-40px"
                  class-name-after-sub="ml-5px w-140px"
                >
                </FormTextInput>
              </div>

              <div class="flex items-end flex-wrap -mb-24px -mt-5px">
                <div class="w-210px <tablet:w-full">
                  <FormLabel
                    :label="$t('pages.analysis.period_specification')"
                  />
                  <FormSelect
                    v-model="periodSpecificationSearchVideoChannel"
                    :size="`large`"
                    :items="periodSpecificationList"
                  >
                  </FormSelect>
                </div>

                <div class="w-310px ml-12px <tablet:w-full <tablet:ml-0">
                  <FormDatePicker
                    v-model="periodOfTime"
                    class="ml-12px w-310px <laptop:w-full"
                    :size="`large`"
                    :format="FormatDateEnum.FORMAT_NORMAL"
                    :value-format="FormatDateEnum.FORMAT_DATE"
                    :name="'periodOfTime'"
                    :show-time="
                      $device.isTablet || $device.isMobile ? true : false
                    "
                    :is-disabled="
                      periodSpecificationSearchVideoChannel !==
                      t('pages.analysis.channel.custom')
                    "
                  >
                  </FormDatePicker>
                </div>
              </div>
              <div class="w-200px mt-20px <tablet:w-full">
                <Button
                  :label="$t('pages.analysis.channel.under_conditions')"
                  :icon="SearchOutlined"
                  @click="handelSearchVideoChannel"
                ></Button>
              </div>
            </a-form>

            <template v-if="!loadingSearchVideoChannel">
              <div class="mt-64px">
                <video-analysis-description
                  :items="analysisVideoChannelLists"
                  :is-error="true"
                ></video-analysis-description>
              </div>

              <div class="mt-80px">
                <div class="movie-title text-18px pb-8px">
                  {{ $t('pages.analysis.channel.movie') }}
                </div>
                <template v-if="channelStore.listVideoChannel.length > 0">
                  <div
                    v-for="(item, index) in channelStore.listVideoChannel"
                    :key="index"
                  >
                    <MovieItem
                      :item="item"
                      :coefficient="formStateSearchVideoChannel.coefficient"
                    ></MovieItem>
                  </div>
                </template>
                <template v-else>
                  <NoData :message="$t('others.no_data2')"></NoData>
                </template>
              </div>
            </template>
            <template v-else>
              <SearchLoading />
            </template>
          </div>
        </div>
      </div>
    </DrawerVideo>
  </div>
</template>

<style lang="scss" scoped>
.video {
  &-ttl {
    display: flex;
    align-items: center;
    padding-top: 16px;
    font-size: 24px;
    cursor: pointer;

    &_title {
      margin-right: 8px;
      width: calc(100% - 20px);

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &-img {
    :deep(.ant-image-mask) {
      border-radius: 9999px;
    }

    :deep(.ant-image) {
      img {
        border-radius: 50% 50%;
      }
    }
  }

  &-count {
    border-radius: 5px;
    border: 1px solid #d7d7d7;
    background: #d7d7d7;
    padding: 3px 12px;
    line-height: 24px;
  }

  &-title {
    line-height: 24px;
    padding-bottom: 7px;
    border-bottom: 1px solid $color_gray1;
  }
}

.c-tbl {
  tbody {
    tr {
      td {
        &:first-child {
          width: 170px;
        }
      }
    }
  }
}

.channel-name {
  border-color: $color_black2;
}

.channel-desc {
  white-space: break-spaces;
  text-align: justify;
}

.movie-title {
  line-height: 24px;
  border-bottom: 1px solid $color_gray1;
}

:deep(.ant-drawer-header) {
  flex-direction: column;
  align-items: flex-start;
}

.c-hidden {
  visibility: hidden;

  @media (max-width: 1024px) {
    display: none;
  }
}

.search {
  &-panel {
    border-bottom: 1px dashed $color_gray1;
  }
}

.custom-margin-bottom {
  :deep(.ant-form-item) {
    margin-bottom: 0;
  }
}

:deep(.countup-wrap span) {
  padding-right: 5px;
}

.item {
  display: flex;
  align-items: center;
}
</style>
