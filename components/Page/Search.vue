<script setup lang="ts">
import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'
import { IHistoryItem, IHistoryParams } from '@/interfaces/history'
import { PeriodSpecificationEnum } from '@/constants/video'
import {
  FormatDateEnum,
  PaginationEnum,
  SearchTypeEnum,
} from '@/constants/common'
import { IParamsPagination, INotification } from '@/interfaces/common'
import { HistoriesKeywordSample } from '@/constants/history'

const histories = ref<IHistoryItem[]>([])

const { t } = useLang()

const isLoading = ref<boolean>(false)

const openPaidMember = ref<boolean>(false)

const { currentDate, isPlanFree, subtractDate, formatDate, showNotification } =
  useHelper()

const params = reactive<IHistoryParams>({
  date_from: subtractDate(
    currentDate.value,
    PeriodSpecificationEnum.PAST_7_DAY
  ),
  date_to: currentDate.value,
  search_type: SearchTypeEnum.SEARCH_ALL,
  periodOfTime: [
    subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_MONTH),
    currentDate.value,
  ],
  page_no: PaginationEnum.PAGE,
  page_size: PaginationEnum.PER_PAGE,
})

const pagination = reactive<IParamsPagination>({
  page_no: PaginationEnum.PAGE,
  page_size: PaginationEnum.PER_PAGE,
  total_page: 0,
  count: 0,
})

const handleHistoryKeyword = async () => {
  if (isLoading.value) {
    return
  }

  const paramsSearch = cloneDeep(params)

  if (paramsSearch.periodOfTime && paramsSearch.periodOfTime.length) {
    paramsSearch.date_from = dayjs(paramsSearch.periodOfTime[0]).format(
      FormatDateEnum.FORMAT_DATE_PARAMS
    )
    paramsSearch.date_to = dayjs(paramsSearch.periodOfTime[1]).format(
      FormatDateEnum.FORMAT_DATE_PARAMS
    )
  } else {
    paramsSearch.date_from = paramsSearch.date_to = null
  }

  try {
    const { $api } = useNuxtApp()

    delete paramsSearch.periodOfTime

    isLoading.value = true

    const res = await $api.user.getKeywordHistory(
      omitBy(paramsSearch, isNil) as unknown as IHistoryParams
    )

    if (res && res.data) {
      // console.log(res.data)
      histories.value = res.data
      pagination.total_page = res.pages.total_page
      pagination.page_no = res.pages.page_no
      pagination.count = res.pages.count
    }
    isLoading.value = false
  } catch (e: any) {
    isLoading.value = false
    // console.log(e)

    const params = {
      description: e?._data.message,
      duration: 4.5,
      icon: true,
      status: false,
    }

    showNotification(params as INotification)
    // throw { message: error }
  }
}

const onChange = (page: number) => {
  params.page_no = page
}

const gotoSearch = (item: IHistoryItem) => {
  if (item.search_type === SearchTypeEnum.SEARCH_VIDEO) {
    return `/analysis?type=video&keyword=${item.word}`
  }

  return `/analysis?type=channel&keyword=${item.word}`
}

const searchType = (type: string) => {
  if (type === 'search_video') {
    return t('components.search_type.search_video')
  }

  return t('components.search_type.search_channel')
}

watch(
  () => params.search_type,
  () => {
    params.page_no = PaginationEnum.PAGE
    // fires only when state.someObject is replaced
  }
)

watch(
  () => params.periodOfTime,
  () => {
    params.page_no = PaginationEnum.PAGE
    // fires only when state.someObject is replaced
  },
  {
    deep: true,
  }
)

watch(
  params,
  (newVal) => {
    handleHistoryKeyword()
  },
  {
    deep: true,
  }
)

onMounted(async () => {
  if (isPlanFree.value) {
    setTimeout(() => {
      openPaidMember.value = true
    }, 50)
    return
  }
  await handleHistoryKeyword()
})
</script>

<template>
  <div class="pb-74px">
    <SearchHistory v-model="params" :count="pagination.count" />
    <template v-if="isLoading">
      <SearchLoading />
    </template>
    <template v-else>
      <template v-if="!isPlanFree">
        <div id="searchHistory" class="search-history <tablet:overflow-x-auto">
          <table
            v-if="histories.length"
            class="c-tbl"
            :class="{ blurry: isPlanFree }"
          >
            <thead>
              <tr>
                <th class="text-left">{{ $t('pages.search.keyword') }}</th>
                <th class="text-center">
                  {{ $t('pages.search.search_date') }}
                </th>
                <th class="text-center">
                  {{ $t('pages.search.search_type') }}
                </th>
                <th class="text-right"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(history, index) in histories" :key="index">
                <td class="text-left break-all whitespace-pre-line max-w-100px">
                  {{ history.word }}
                </td>
                <td class="!text-center">
                  {{
                    formatDate(
                      history.search_datetime,
                      FormatDateEnum.FORMAT_YEAR_MONTH_DAY_TIME_MINUSES
                    )
                  }}
                </td>
                <td class="!text-center">
                  {{ searchType(history.search_type) }}
                </td>
                <td class="!text-right">
                  <nuxt-link :to="gotoSearch(history)" class="c-link">{{
                    $t('pages.search.link_search')
                  }}</nuxt-link>
                </td>
              </tr>
            </tbody>
          </table>
          <NoData v-else :message="$t('others.no_data2')" />
        </div>
        <div class="flex justify-center mt-80px">
          <Pagination
            v-model="pagination.page_no"
            :total="pagination.count"
            :default-page-size="PaginationEnum.PER_PAGE"
            @onChange="onChange"
          ></Pagination>
        </div>
      </template>
      <template v-else>
        <div
          id="searchHistory"
          class="search-history relative <tablet:overflow-x-auto"
        >
          <table class="c-tbl">
            <thead>
              <tr>
                <th class="text-left">{{ $t('pages.search.keyword') }}</th>
                <th class="text-center">
                  {{ $t('pages.search.search_date') }}
                </th>
                <th class="text-center">
                  {{ $t('pages.search.search_type') }}
                </th>
                <th class="text-right"></th>
              </tr>
            </thead>
            <tbody class="blurry">
              <tr
                v-for="(history, index) in HistoriesKeywordSample"
                :key="index"
              >
                <td class="text-left break-all whitespace-pre-line max-w-100px">
                  {{ history.word }}
                </td>
                <td class="!text-center">
                  {{
                    formatDate(
                      history.search_datetime,
                      FormatDateEnum.FORMAT_YEAR_MONTH_DAY_TIME_MINUSES
                    )
                  }}
                </td>
                <td class="!text-center">
                  {{ $t('components.search_type.search_video') }}
                </td>
                <td class="!text-right">
                  <nuxt-link :to="gotoSearch(history)" class="c-link">{{
                    $t('pages.search.link_search')
                  }}</nuxt-link>
                </td>
              </tr>
            </tbody>
          </table>
          <ModalPaidMember />
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.c-tbl {
  @include mq-down(sp) {
    width: 600px;
  }
}

.c-link {
  font-size: 14px;
}

.search-history {
  position: relative;
}
</style>
