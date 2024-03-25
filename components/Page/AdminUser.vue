<script setup lang="ts">
import {
  MasterSite,
  TitleLoading,
  PaginationEnum,
  FormatDateEnum,
} from '@/constants/common'
import { useUser } from '@/stores/user'
import { PlanEnumStatus } from '@/constants/plan'

const { t } = useLang()

const { formatDate, setLoading } = useHelper()

const config = useRuntimeConfig()

const userStore = useUser()

const current = ref(1)

const isLoading = ref<boolean>(false)

const planList = [
  {
    label: t('pages.admin_user.filter.all'),
    value: 0,
  },
  {
    label: t('pages.admin_user.filter.free'),
    value: PlanEnumStatus.FREE,
  },
  {
    label: t('pages.admin_user.filter.personal'),
    value: PlanEnumStatus.PERSONAL,
  },
  {
    label: t('pages.admin_user.filter.team'),
    value: PlanEnumStatus.TEAM,
  },
]

const planFilter = ref(0)

const analyze = ref<Boolean>(false)

const userDetail = ref<any>({})

const plan = (num: number): Object => {
  if (num === PlanEnumStatus.FREE) {
    return {
      class: 'free',
      text: t('pages.admin_user.plan.free'),
    }
  } else if (num === PlanEnumStatus.PERSONAL) {
    return {
      class: 'personal',
      text: t('pages.admin_user.plan.personal'),
    }
  } else {
    return {
      class: 'team',
      text: t('pages.admin_user.plan.team'),
    }
  }
}

const analyzeDetailUser = (id: string | number) => {
  analyze.value = true

  userDetail.value = userStore.listAdminUser.find((x) => x.id === id)
}

const getListAdminUsers = async () => {
  isLoading.value = true
  await userStore.getListAdminUsers(current.value, 10, planFilter.value)
  isLoading.value = false
}

onMounted(() => {
  getListAdminUsers()
})

const onChange = (page: number) => {
  current.value = page
  getListAdminUsers()
}

watch(planFilter, () => {
  current.value = 1
  getListAdminUsers()
})
</script>

<template>
  <div class="subaccounts pb-74px">
    <div class="flex flex-col">
      <span class="subaccounts-title text-20px pb-26px">{{
        $t('common.list')
      }}</span>
      <div class="flex items-center pt-20px">
        <div class="text-14px mr-8px">
          {{ $t('pages.admin_user.plan_label') }}
        </div>
        <div class="w-210px <tablet:w-150px">
          <FormSelect v-model="planFilter" :size="`large`" :items="planList">
          </FormSelect>
        </div>
        <div class="text-20px ml-32px">
          {{ userStore.adminUserPage?.count }}
          {{ $t('pages.admin_user.pieces') }}
        </div>
      </div>
    </div>

    <template v-if="!isLoading">
      <div
        v-if="userStore.listAdminUser.length > 0"
        class="subaccounts-list mt-25px"
      >
        <div class="table-responsive tbl">
          <table class="c-tbl bordered">
            <thead>
              <tr>
                <th class="w-40px"></th>
                <th class="w-160px">{{ $t('pages.subaccounts.name') }}</th>
                <th>{{ $t('pages.admin_user.company') }}</th>
                <th>{{ $t('pages.admin_user.phone') }}</th>
                <th>{{ $t('pages.admin_user.email') }}</th>
                <th>{{ $t('pages.admin_user.plan_label') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in userStore.listAdminUser" :key="index">
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
                <td class="text-center w-180px">
                  <template v-if="user.company">
                    <a-popover
                      :title="``"
                      :get-popup-container="
                        (triggerNode) => triggerNode.parentNode
                      "
                    >
                      <template #content>
                        {{ user.company }}
                      </template>
                      <span class="subaccounts-company mx-10px">
                        {{ user.company }}
                      </span>
                    </a-popover>
                  </template>
                  <template v-else>
                    {{ $t('others.empty') }}
                  </template>
                </td>
                <td class="text-center">
                  {{ user.phone_number || $t('others.empty') }}
                </td>
                <td class="text-center">
                  {{ user.email }}
                </td>
                <td class="text-center w-115px">
                  <span class="c-plan" :class="plan(user.plan_id).class">
                    {{ plan(user.plan_id).text }}
                  </span>
                </td>
                <td class="text-right w-50px">
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
      v-if="userStore.adminUserPage?.count as number > PaginationEnum.PER_PAGE"
      class="flex justify-center mt-80px"
    >
      <Pagination
        v-model="current"
        :total="userStore.adminUserPage?.count"
        :default-page-size="PaginationEnum.PER_PAGE"
        @onChange="onChange"
      ></Pagination>
    </div>

    <DrawerVideo
      v-model="analyze"
      :width="$device.isTablet || $device.isMobile ? '100%' : 720"
    >
      <template #custom-head>
        <div class="flex items-center">
          <ImageVideo
            :width="32"
            :src-thumb="
              !userDetail.avatar
                ? MasterSite.default_avatar
                : `${config.public.apiCloud}/${userDetail.avatar}`
            "
            :src-preview="
              !userDetail.avatar
                ? MasterSite.default_avatar
                : `${config.public.apiCloud}/${userDetail.avatar}`
            "
            :height="32"
            :class-name="`rounded-1/2`"
            :show-text-preview="false"
          />
          <div class="custom-title ml-16px">
            {{ userDetail.full_name }}
          </div>
        </div>
      </template>

      <div class="subaccounts-detail <tablet:overflow-x-auto">
        <div class="<tablet:min-w-500px">
          <div class="subaccounts-detail__row">
            <div class="subaccounts-detail__column">
              {{ $t('pages.admin_user.company') }}
            </div>
            <div class="subaccounts-detail__column">
              {{ userDetail.company || $t('others.empty') }}
            </div>
          </div>
          <div class="subaccounts-detail__row">
            <div class="subaccounts-detail__column">
              {{ $t('pages.admin_user.mobile_number') }}
            </div>
            <div class="subaccounts-detail__column">
              {{ userDetail.phone_number || $t('others.empty') }}
            </div>
          </div>
          <div class="subaccounts-detail__row">
            <div class="subaccounts-detail__column">
              {{ $t('pages.admin_user.registration_date') }}
            </div>
            <div class="subaccounts-detail__column">
              {{
                formatDate(
                  userDetail.registration_date,
                  FormatDateEnum.FORMAT_YEAR_MONTH_DAY_TIME
                ) || $t('others.empty')
              }}
            </div>
          </div>
          <div class="subaccounts-detail__row">
            <div class="subaccounts-detail__column">
              {{ $t('pages.admin_user.plan_under_contract') }}
            </div>
            <div class="subaccounts-detail__column">
              <td class="text-center">
                <span class="c-plan" :class="plan(userDetail.plan_id).class">
                  {{ plan(userDetail.plan_id).text }}
                </span>
              </td>
            </div>
          </div>
          <div class="subaccounts-detail__row">
            <div class="subaccounts-detail__column">
              {{ $t('pages.admin_user.expiry_date') }}
            </div>
            <div class="subaccounts-detail__column">
              {{
                userDetail.expiry_date
                  ? formatDate(
                      userDetail.expiry_date,
                      FormatDateEnum.FORMAT_YEAR_MONTH_DAY_TIME
                    )
                  : $t('others.empty')
              }}
            </div>
          </div>
          <div class="subaccounts-detail__row">
            <div class="subaccounts-detail__column">
              {{ $t('pages.admin_user.childe') }}
            </div>
            <div class="subaccounts-detail__column">
              {{ userDetail.childe || $t('others.empty') }}
            </div>
          </div>
          <div class="subaccounts-detail__row">
            <div class="subaccounts-detail__column">
              {{ $t('pages.admin_user.last_login_datetime') }}
            </div>
            <div class="subaccounts-detail__column">
              {{
                userDetail.last_login_datetime
                  ? formatDate(
                      userDetail.last_login_datetime,
                      FormatDateEnum.FORMAT_YEAR_MONTH_DAY_TIME
                    )
                  : $t('others.empty')
              }}
            </div>
          </div>
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
    width: 896px;
  }

  th,
  td {
    background-color: $color_white;
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

  &__row {
    display: flex;
  }

  &__column {
    padding: 16px 0;
    border-bottom: 1px solid $color_gray1;
    width: calc(100% - 170px);
    font-size: 16px;

    &:first-child {
      width: 170px;
    }
  }
}

.subaccounts-title {
  border-bottom: 1px solid $color_gray1;
  border-style: dotted;
}

.subaccounts-company {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.search-history {
  .c-tbl {
    @include mq-down(sp) {
      width: 500px;
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

:deep(.ant-form-item) {
  margin-bottom: unset;
}
</style>
