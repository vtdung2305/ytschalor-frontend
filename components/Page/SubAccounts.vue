<script setup lang="ts">
import { UserAddOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import {
  MasterSite,
  FormatDateEnum,
  TitleLoading,
  PaginationEnum,
  SearchTypeEnum,
} from '@/constants/common'
import { useUser } from '@/stores/user'
import { StatusAccountEnum } from '@/constants/role'
import { PlanEnum } from '@/constants/plan'
import { IDetailAccountParams } from '@/interfaces/user'
import { PeriodSpecificationEnum } from '@/constants/video'
import { comma } from '@/helper/number'
import { CookieKeyEnum } from '@/constants/cookie'

const router = useRouter()

const { t } = useLang()

const { subtractDate, currentDate, formatDate, setLoading, setLoadingDrawer } =
  useHelper()

const { $api } = useNuxtApp()

const config = useRuntimeConfig()

const userStore = useUser()

const current = ref<number>(1)

const isLoading = ref<boolean>(false)

const isLoadingHistory = ref<boolean>(false)

const isLoadingChangeStatus = ref<boolean>(false)

const isFilterHistory = ref<boolean>(false)

const handleCreateAccount = () => {
  router.push('/create-subaccount')
}

const className = (num: number): Object => {
  if (num === StatusAccountEnum.ACTIVE) {
    return {
      class: 'valid',
      text: t('components.status.valid'),
    }
  } else if (num === StatusAccountEnum.INACTIVE) {
    return {
      class: 'invalid',
      text: t('components.status.invalid'),
    }
  } else {
    return {
      class: 'lock',
      text: t('components.status.lock'),
    }
  }
}

const videoSearchHistory = reactive<IDetailAccountParams>({
  date_from: dayjs(
    subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_7_DAY)
  ).format(FormatDateEnum.FORMAT_DATE_PARAMS),
  date_to: dayjs(currentDate.value).format(FormatDateEnum.FORMAT_DATE_PARAMS),
  search_type: SearchTypeEnum.SEARCH_ALL,
  page_no: PaginationEnum.PAGE,
  page_size: PaginationEnum.PER_PAGE,
})

const periodOfTime = ref([
  subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_7_DAY),
  currentDate.value,
])

const isSearching = ref<boolean>(false)

const analyze = ref<Boolean>(false)

const lableButton = (num: number): Object => {
  if (num === StatusAccountEnum.ACTIVE) {
    return {
      text: t('pages.subaccounts_detail.status.valid'),
    }
  } else if (num === StatusAccountEnum.INACTIVE) {
    return {
      text: t('pages.subaccounts_detail.status.invalid'),
    }
  } else {
    return {
      text: t('pages.subaccounts_detail.status.lock'),
    }
  }
}

const analyzeDetailUser = async (id: string | number) => {
  analyze.value = true

  setLoadingDrawer(true, TitleLoading.LoadingList)
  await userStore.getDetaillSubAccount(id as string, videoSearchHistory)
  setLoadingDrawer(false)
}

const getListSubAccount = async () => {
  isLoading.value = true
  await userStore.getListSubAccount(current.value, PaginationEnum.PER_PAGE)
  isLoading.value = false
}

const onChange = (page: number) => {
  current.value = page
  getListSubAccount()
}

const onChangeHistory = async (page: number) => {
  videoSearchHistory.page_no = page
  isLoadingHistory.value = true
  await userStore.getDetaillSubAccount(
    userStore.detailSubAccount?.id as string,
    videoSearchHistory
  )
  isLoadingHistory.value = false
}

const handelChangeStatus = (id: number, status: number) => {
  let params: any

  if (status === StatusAccountEnum.ACTIVE) {
    params = {
      status: StatusAccountEnum.INACTIVE,
    }
  }

  if (status === StatusAccountEnum.INACTIVE) {
    params = {
      status: StatusAccountEnum.ACTIVE,
    }
  }

  if (status === StatusAccountEnum.LOCK) {
    params = {
      status: StatusAccountEnum.ACTIVE,
    }
  }

  isLoadingChangeStatus.value = true

  $api.user
    .changeStatusAccount(id, params)
    .then(async (e: any) => {
      const userData = localStorage.getItem(CookieKeyEnum.USER_DATA)

      if (userData) {
        const data = JSON.parse(userData)

        data.child_account_number = e?.data?.child_account_number

        localStorage.setItem(CookieKeyEnum.USER_DATA, JSON.stringify(data))

        userStore.setUser(data)
      }

      await userStore.setStatusAddNewAccout(e.data.is_can_add_new_member)
      await userStore.setStatusListSubAccount(id, params.status)
      await userStore.getDetaillSubAccount(id, videoSearchHistory)
      isLoadingChangeStatus.value = false
    })
    .catch(async (e: any) => {})
}

onMounted(() => {
  getListSubAccount()
})

watch(
  () => analyze.value,
  () => {
    if (!analyze.value) {
      videoSearchHistory.page_no = PaginationEnum.PAGE
      videoSearchHistory.date_from = subtractDate(
        currentDate.value,
        PeriodSpecificationEnum.PAST_7_DAY
      )
      videoSearchHistory.date_to = currentDate.value
      userStore.removedetailSubAccount()
      isFilterHistory.value = false
      periodOfTime.value = [
        subtractDate(currentDate.value, PeriodSpecificationEnum.PAST_7_DAY),
        currentDate.value,
      ]
    } else {
      isFilterHistory.value = true
    }
  }
)

watch(
  () => periodOfTime.value,
  () => {
    if (
      periodOfTime.value &&
      periodOfTime.value.length &&
      isFilterHistory.value
    ) {
      videoSearchHistory.date_from = dayjs(periodOfTime.value[0]).format(
        FormatDateEnum.FORMAT_DATE_PARAMS
      )
      videoSearchHistory.date_to = dayjs(periodOfTime.value[1]).format(
        FormatDateEnum.FORMAT_DATE_PARAMS
      )

      onChangeHistory(PaginationEnum.PAGE)
    }
  }
)
</script>

<template>
  <div class="subaccounts pb-74px">
    <div class="flex items-center justify-between">
      <span class="text-20px">{{ $t('common.list') }}</span>
      <div class="subaccounts-action flex items-center">
        <Button
          class="w-178px mb-0 mr-12px <laptop:w-full"
          :label="$t('pages.subaccounts.btn_add_member')"
          :icon="UserAddOutlined"
          :disabled="
            userStore.planType !== PlanEnum.TEAM ||
            !userStore.statusAddNewAccout
          "
          @click="handleCreateAccount"
        ></Button>
        <Popover
          :title="$t('pages.subaccounts.pop_title')"
          :content="`${$t('pages.subaccounts.pop_desc_one')}<br>${$t(
            'pages.subaccounts.pop_desc_two'
          )}`"
          :theme="`outlined`"
          :placement="`topLeft`"
        />
      </div>
    </div>

    <template v-if="!isLoading">
      <div
        v-if="userStore.listSubAccount.length > 0"
        class="subaccounts-list mt-25px"
      >
        <div class="table-responsive tbl">
          <table class="c-tbl bordered">
            <thead>
              <tr>
                <th class="w-40px"></th>
                <th class="w-160px">{{ $t('pages.subaccounts.name') }}</th>
                <th>{{ $t('pages.subaccounts.last_login') }}</th>
                <th>{{ $t('pages.subaccounts.number_search') }}</th>
                <th>{{ $t('pages.subaccounts.status') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(user, index) in userStore.listSubAccount"
                :key="index"
                :class="{ disabled: user.status === 0 }"
              >
                <td>
                  <ImageVideo
                    :width="40"
                    :src-thumb="
                      !user.avatar
                        ? MasterSite.default_avatar
                        : `${config.public.apiCloud}/${user.avatar}`
                    "
                    :src-preview="
                      !user.avatar
                        ? MasterSite.default_avatar
                        : `${config.public.apiCloud}/${user.avatar}`
                    "
                    :height="40"
                    :class-name="`rounded-1/2`"
                    :show-text-preview="false"
                  />
                </td>
                <td class="text-center">
                  <p>{{ user.full_name }}</p>
                </td>
                <td class="text-center">
                  {{
                    user.last_login_datetime
                      ? formatDate(user.last_login_datetime)
                      : $t('others.empty')
                  }}
                </td>
                <td class="text-center">
                  {{ comma(user.search_count)
                  }}{{ $t('components.units.time') }}
                </td>
                <td class="text-center">
                  <span class="c-status" :class="className(user.status).class">
                    {{ className(user.status).text }}
                  </span>
                </td>
                <td class="text-right">
                  <div
                    class="c-link inline"
                    @click="analyzeDetailUser(user.id)"
                  >
                    {{ $t('pages.subaccounts.btn_detail') }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <NoData v-else :message="$t('pages.subaccounts.no_data')" />
    </template>
    <template v-else>
      <SearchLoading />
    </template>

    <div
      v-if="userStore.subAccountPage?.count as number > PaginationEnum.PER_PAGE"
      class="flex justify-center mt-80px"
    >
      <Pagination
        v-model="current"
        :total="userStore.subAccountPage?.count"
        :default-page-size="PaginationEnum.PER_PAGE"
        @onChange="onChange"
      ></Pagination>
    </div>

    <DrawerVideo
      v-model="analyze"
      :width="$device.isTablet || $device.isMobile ? '100%' : 720"
    >
      <template v-if="userStore.detailSubAccount" #custom-head>
        <div class="flex items-center">
          <ImageVideo
            :width="32"
            :src-thumb="
              !userStore.detailSubAccount?.avatar
                ? MasterSite.default_avatar
                : `${config.public.apiCloud}/${userStore.detailSubAccount.avatar}`
            "
            :src-preview="
              !userStore.detailSubAccount?.avatar
                ? MasterSite.default_avatar
                : `${config.public.apiCloud}/${userStore.detailSubAccount.avatar}`
            "
            :height="32"
            :class-name="`rounded-1/2`"
            :show-text-preview="false"
          />
          <div class="custom-title ml-16px">
            {{ userStore.detailSubAccount?.full_name }}
          </div>
        </div>
      </template>

      <div
        v-if="!isLoadingChangeStatus"
        class="subaccounts-detail <tablet:overflow-x-auto"
      >
        <div class="<tablet:min-w-500px">
          <div class="subaccounts-detail__row">
            <div class="subaccounts-detail__column">
              {{ $t('pages.subaccounts_detail.email_address') }}
            </div>
            <div class="subaccounts-detail__column">
              {{ userStore.detailSubAccount?.email }}
            </div>
          </div>
          <div class="subaccounts-detail__row">
            <div class="subaccounts-detail__column">
              {{ $t('pages.subaccounts_detail.last_login') }}
            </div>
            <div class="subaccounts-detail__column">
              {{
                userStore.detailSubAccount?.last_login_datetime
                  ? formatDate(
                      userStore.detailSubAccount?.last_login_datetime,
                      FormatDateEnum.FORMAT_YEAR_MONTH_DAY_TIME
                    )
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div class="subaccounts-detail__row">
            <div class="subaccounts-detail__column flex">
              <div class="mr-4px">
                {{ $t('pages.subaccounts_detail.status_label') }}
              </div>
              <Popover
                :title="$t('pages.subaccounts_detail.tooltip_title')"
                :content="
                  $t('pages.subaccounts_detail.tooltip_desc1') +
                  '\n' +
                  $t('pages.subaccounts_detail.tooltip_desc2') +
                  '\n' +
                  $t('pages.subaccounts_detail.tooltip_desc3') +
                  '\n' +
                  $t('pages.subaccounts_detail.tooltip_desc4')
                "
                :theme="`outlined`"
                :two-tone-color="`#898989`"
              />
            </div>
            <div class="subaccounts-detail__column flex items-center">
              <td class="text-center">
                <span
                  class="c-status"
                  :class="className(userStore.detailSubAccount?.status!).class"
                >
                  {{ className(userStore.detailSubAccount?.status!).text }}
                </span>
              </td>

              <div
                v-if="
                  userStore.detailSubAccount?.status ===
                    StatusAccountEnum.INACTIVE && !userStore.statusAddNewAccout
                "
                class="text-10px ml-12px note"
              >
                {{
                  $t('pages.subaccounts_detail.note_add_new_accout_1', {
                    field: userStore.userData?.plan?.plan_detail?.max_members,
                  })
                }}
                <br />
                {{ $t('pages.subaccounts_detail.note_add_new_accout_2') }}
              </div>
              <div
                v-else
                class="c-link inline ml-20px"
                @click="
                  handelChangeStatus(
                    userStore.detailSubAccount?.id as number,
                    userStore.detailSubAccount?.status as number
                  )
                "
              >
                {{ lableButton(userStore.detailSubAccount?.status!).text }}
              </div>
            </div>
          </div>
          <div class="subaccounts-detail__row">
            <div class="subaccounts-detail__column">
              {{ $t('pages.subaccounts_detail.phone') }}
            </div>
            <div class="subaccounts-detail__column">
              {{
                userStore.detailSubAccount?.phone_number || $t('others.empty')
              }}
            </div>
          </div>
          <div
            v-if="userStore.detailSubAccount?.status === StatusAccountEnum.LOCK"
            class="subaccounts-detail__row"
          >
            <div class="subaccounts-detail__column">
              {{ $t('pages.subaccounts_detail.lock_time') }}
            </div>
            <div class="subaccounts-detail__column">
              {{
                userStore.detailSubAccount?.block_time
                  ? `${userStore.detailSubAccount?.block_time}分`
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div
            v-if="userStore.detailSubAccount?.status === StatusAccountEnum.LOCK"
            class="subaccounts-detail__row"
          >
            <div class="subaccounts-detail__column">
              {{ $t('pages.subaccounts_detail.lock_data') }}
            </div>
            <div class="subaccounts-detail__column">
              {{
                userStore.detailSubAccount?.block_datetime
                  ? formatDate(
                      userStore.detailSubAccount?.block_datetime,
                      FormatDateEnum.FORMAT_YEAR_MONTH_DAY_TIME
                    )
                  : $t('others.empty')
              }}
            </div>
          </div>
        </div>
      </div>
      <SearchLoading v-else class="h-235px" />

      <div class="pb-74px">
        <div class="mt-48px">
          <a-form
            ref="formSearchHistory"
            :model="videoSearchHistory"
            :rules="rules"
          >
            <div class="flex flex-wrap justify-between">
              <div
                class="w-320px mr-20px <tablet:w-full <tablet:ml-0 <tablet:mr-0"
              >
                <FormLabel
                  :label="$t('pages.subaccounts_detail.target_period')"
                />
                <FormDateRangePicker
                  v-model="periodOfTime"
                  :format="FormatDateEnum.FORMAT_NORMAL"
                  :value-format="FormatDateEnum.FORMAT_DATE"
                  :disabled="isSearching"
                  :size="`large`"
                  :show-time="
                    $device.isTablet || $device.isMobile ? true : false
                  "
                >
                </FormDateRangePicker>
              </div>
              <div
                class="flex items-center pl-20px text-16px <tablet:pl-0 <tablet:mb-15px"
              >
                <span>{{ $t('pages.subaccounts_detail.complete') }}</span>
                <span>{{ comma(userStore.historyPage?.count as number) }}</span>
                <span>{{ $t('pages.subaccounts_detail.pieces') }}</span>
              </div>
            </div>
          </a-form>
        </div>
        <template v-if="!isLoadingHistory">
          <div
            v-if="userStore.listHistory.length > 0"
            class="search-history <tablet:overflow-x-auto"
          >
            <table class="c-tbl">
              <thead>
                <tr>
                  <th class="text-center">
                    {{ $t('pages.subaccounts_detail.date_time') }}
                  </th>
                  <th class="text-center">
                    {{ $t('pages.subaccounts_detail.keyword') }}
                  </th>
                  <th class="text-right">
                    {{ $t('pages.subaccounts_detail.func') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(history, index) in userStore.listHistory"
                  :key="index"
                >
                  <td class="!text-left w-250px <tablet:w-300px">
                    {{
                      (userStore.historyPage?.page_no! - 1) *
                        userStore.historyPage?.page_size! +
                      (index + 1)
                    }}.
                    {{
                      history.search_datetime
                        ? formatDate(
                            history.search_datetime,
                            FormatDateEnum.FORMAT_YEAR_MONTH_DAY_TIME
                          )
                        : $t('others.empty')
                    }}
                  </td>
                  <td class="!text-center w-250px <tablet:w-300px">
                    {{ history.word }}
                  </td>
                  <td class="!text-right">
                    <span
                      v-if="history.search_type === SearchTypeEnum.SEARCH_VIDEO"
                      class="c-status search"
                    >
                      {{ $t('components.search_type.search_video') }}
                    </span>
                    <span v-else class="c-status search">
                      {{ $t('components.search_type.search_channel') }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <NoData
            v-else
            :message="$t('pages.subaccounts.no_data')"
            class="h-300px"
          />
        </template>
        <template v-else>
          <SearchLoading />
        </template>

        <div
          v-if="userStore.historyPage?.count as number > PaginationEnum.PER_PAGE"
          class="flex justify-center mt-80px"
        >
          <Pagination
            v-model="videoSearchHistory.page_no"
            :total="userStore.historyPage?.count"
            :default-page-size="PaginationEnum.PER_PAGE"
            @onChange="onChangeHistory"
          ></Pagination>
        </div>
      </div>
    </DrawerVideo>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-image-mask) {
  border-radius: 9999px;
}

:deep(.ant-image) {
  img {
    border-radius: 50% 50%;
  }
}

.c-tbl {
  tbody {
    tr {
      td {
        font-size: 14px;

        &:first-child,
        &:last-child {
          padding-left: 0;
          padding-right: 0;
        }
      }

      &.disabled {
        color: $color_gray5;
      }
    }
  }

  @include mq-down(sp) {
    table-layout: fixed;
    width: 750px;
  }

  th,
  td {
    background-color: $color_white;

    // &:first-child,
    // &:nth-child(2) {
    //   @include mq-down(sp) {
    //     position: sticky;
    //   }
    // }

    // &:first-child {
    //   left: 0;
    // }

    // &:nth-child(2) {
    //   left: 40px;
    // }
  }
}

.custom-title {
  font-size: 24px;
  color: $color_black2;
  font-weight: bold;
}

:deep(.ant-drawer-header-title) {
  flex: 0;
}

:deep(.ant-drawer-extra) {
  @include mq-down(sp) {
    margin-left: 28px;
  }
}

.subaccounts-detail {
  border-top: 1px solid $color_gray1;
  font-size: 16px;

  &__row {
    display: flex;
  }

  &__column {
    padding: 16px 0;
    border-bottom: 1px solid $color_gray1;
    width: calc(100% - 170px);

    &:first-child {
      width: 170px;
    }
  }
}

.search-history {
  .c-tbl {
    @include mq-down(sp) {
      width: 700px;
    }
  }

  th,
  td {
    background-color: $color_white;

    &:first-child,
    &:nth-child(2) {
      @include mq-down(sp) {
        position: unset;
      }
    }

    &:first-child {
      left: unset;
    }

    &:nth-child(2) {
      left: unset;
    }
  }
}

.note {
  color: $color_gray5;
  line-height: 160%;
}

:deep(.c-label_txt) {
  font-size: 18px;
}

.c-tbl tbody tr td {
  font-size: 16px;
}
</style>
