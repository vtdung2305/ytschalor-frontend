<script setup lang="ts">
import { DownloadOutlined, LockOutlined } from '@ant-design/icons-vue'
import CountUp from 'vue-countup-v3'
import { PropType } from 'vue'
import {
  CoefficientLists,
  FilterConstChannelVideo,
  FilterTabEnum,
} from '@/constants/video'
import { SortOrders } from '@/constants/common'
import { IFormSortVideo } from '@/interfaces/video'
import { comma } from '@/helper/number'
import { useUser } from '@/stores/user'
import { PlanEnum } from '@/constants/plan'
import { INotification, IModalParams } from '@/interfaces/common'
import { useVideo } from '@/stores/video'

const props = defineProps({
  modelValue: {
    type: Object as PropType<IFormSortVideo>,
    default: () => {},
  },
  isSearching: {
    type: Boolean,
    default: false,
  },
})

const { notificationDeveloping, showNotification } = useHelper()

const { $api } = useNuxtApp()

const { t } = useLang()

const videoStore = useVideo()

const emit = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const currentFilter = ref<number>(0)

const { videoIncludes, countFilter, countVideos, handleFilterVideo } =
  useVideoInfo()

const exportCSV = async () => {
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
    $api.video
      .exportVideo({
        data: videoStore.videoLists,
        keyword: videoStore.searchParams?.keyword,
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

// const formSort = reactive<IFormSortVideo>({
//   sort_type: 'video_detail.viewCount',
//   order: 'desc',
//   checked: false,
//   filter: [],
//   coefficient: props.coefficient,
// })

const userStore = useUser()

const isPlanFree = computed((): boolean => userStore.planType === PlanEnum.FREE)

const changeFilter = (params: number[], num: number): void => {
  currentFilter.value = num
  modelValue.value.filter = params
}

watch(
  [modelValue],
  ([newVal]) => {
    if (newVal) {
      handleFilterVideo(modelValue.value as IFormSortVideo)
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="search">
    <p class="text-20px <tablet:mb-12px">
      {{ $t('pages.analysis.search_results') }}
    </p>
    <div class="search-panel pb-16px">
      <div class="flex items-center gap-x-24px flex-wrap <tablet:gap-12px">
        <div class="item">
          <span class="item-index">{{
            $t('components.search_panel.good_number')
          }}</span>
          <span class="item-value flex">
            <template v-if="!isSearching">
              <count-up
                :start-val="0"
                :end-val="
                  videoIncludes?.number_video_have_greater_tha_coefficient || 0
                "
              >
                <template #suffix>
                  {{ $t('components.units.pieces') }}
                </template>
              </count-up>
            </template>
            <template v-else> ー {{ $t('components.units.pieces') }} </template>
          </span>
        </div>
        <div class="item">
          <span class="item-index">{{
            $t('components.search_panel.average_number')
          }}</span>
          <span class="item-value">
            <template v-if="!isSearching">
              <count-up
                :start-val="0"
                :end-val="videoIncludes?.average_number_of_views || 0"
              >
                <template #suffix>
                  {{ $t('components.units.time') }}
                </template>
              </count-up>
            </template>

            <template v-else> ー {{ $t('components.units.time') }} </template>
          </span>
        </div>
        <div class="item">
          <span class="item-index">{{
            $t('components.search_panel.average_coefficient')
          }}</span>
          <template v-if="!isSearching">
            <count-up
              :start-val="0"
              :end-val="videoIncludes?.average_number_of_coefficient || 0"
              :decimal-places="2"
            >
            </count-up>
          </template>
          <template v-else> ー </template>
        </div>

        <div class="item ml-auto <tablet:mr-auto">
          <Button
            class="w-107px <tablet:w-full"
            :label="$t('components.search_panel.btn_csv')"
            :icon="isPlanFree ? LockOutlined : DownloadOutlined"
            :disabled="isPlanFree || isSearching"
            @click="exportCSV"
          ></Button>
        </div>
      </div>
    </div>
    <div class="search-form">
      <div class="flex gap-x-5px flex-wrap gap-12px">
        <div class="w-210px <tablet:w-full search-form_item">
          <FormSelect
            v-model="modelValue.sort_type"
            :size="`small`"
            :placeholder="$t('pages.analysis.key_work_placeholder')"
            :items="CoefficientLists"
            :disabled="isSearching"
          ></FormSelect>
        </div>

        <div class="w-210px <tablet:w-full search-form_item">
          <FormSelect
            v-model="modelValue.order"
            :size="`small`"
            :placeholder="$t('pages.analysis.key_work_placeholder')"
            :items="SortOrders"
            :disabled="isSearching"
          ></FormSelect>
        </div>

        <div
          class="flex <tablet:w-full items-center search-form_item ml-30px <tablet:ml-0"
        >
          <FormCheckbox
            v-model="modelValue.checked"
            :label="$t('components.sort_video.show_excellent_quality')"
            :disabled="isSearching"
          ></FormCheckbox>
        </div>
      </div>
    </div>
    <div class="search-label flex flex-wrap">
      <div class="search-subscribers">
        {{ $t('components.search_panel.number_of_subscribers') }}
      </div>

      <div
        class="search-labelList flex flex-wrap gap-x-16px <tablet:gap-y-8px <tablet:justify-between"
      >
        <div
          class="search-labelList_item"
          :class="{ current: currentFilter === FilterTabEnum.FILTER_ZERO }"
          @click="
            changeFilter(
              FilterConstChannelVideo.ALL_CHANNEL,
              FilterTabEnum.FILTER_ZERO
            )
          "
        >
          <p>{{ $t('components.search_panel.all') }}</p>
        </div>

        <div
          class="search-labelList_item"
          :class="{ current: currentFilter === FilterTabEnum.FILTER_ONE }"
          @click="
            changeFilter(
              FilterConstChannelVideo.ONE_CHANNEL,
              FilterTabEnum.FILTER_ONE
            )
          "
        >
          <p>{{ $t('components.search_panel.channel_option_one') }}</p>
          <span>
            <template v-if="!isSearching">
              {{
                $t('components.search_panel.chanel_value', {
                  count: countVideos?.one_channel,
                })
              }}
            </template>
            <template v-else>
              {{ $t('components.units.status_searching') }}
            </template>
          </span>
        </div>

        <div
          class="search-labelList_item"
          :class="{ current: currentFilter === FilterTabEnum.FILTER_TWO }"
          @click="
            changeFilter(
              FilterConstChannelVideo.TWO_CHANNEL,
              FilterTabEnum.FILTER_TWO
            )
          "
        >
          <p>{{ $t('components.search_panel.channel_option_two') }}</p>
          <span>
            <template v-if="!isSearching">
              {{
                $t('components.search_panel.chanel_value', {
                  count: countVideos?.two_channel,
                })
              }}
            </template>
            <template v-else>
              {{ $t('components.units.status_searching') }}
            </template>
          </span>
        </div>

        <div
          class="search-labelList_item"
          :class="{ current: currentFilter === FilterTabEnum.FILTER_THREE }"
          @click="
            changeFilter(
              FilterConstChannelVideo.THREE_CHANNEL,
              FilterTabEnum.FILTER_THREE
            )
          "
        >
          <p>{{ $t('components.search_panel.channel_option_three') }}</p>
          <span>
            <template v-if="!isSearching">
              {{
                $t('components.search_panel.chanel_value', {
                  count: countVideos?.three_channel,
                })
              }}
            </template>
            <template v-else>
              {{ $t('components.units.status_searching') }}
            </template>
          </span>
        </div>

        <div
          class="search-labelList_item"
          :class="{ current: currentFilter === FilterTabEnum.FILTER_FOUR }"
          @click="
            changeFilter(
              FilterConstChannelVideo.FOUR_CHANNEL,
              FilterTabEnum.FILTER_FOUR
            )
          "
        >
          <p>{{ $t('components.search_panel.channel_option_four') }}</p>
          <span>
            <template v-if="!isSearching">
              {{
                $t('components.search_panel.chanel_value', {
                  count: countVideos?.four_channel,
                })
              }}
            </template>
            <template v-else>
              {{ $t('components.units.status_searching') }}
            </template>
          </span>
        </div>

        <div
          class="search-labelList_item"
          :class="{ current: currentFilter === FilterTabEnum.FILTER_FIVE }"
          @click="
            changeFilter(
              FilterConstChannelVideo.FIVE_CHANNEL,
              FilterTabEnum.FILTER_FIVE
            )
          "
        >
          <p>{{ $t('components.search_panel.channel_option_five') }}</p>
          <span>
            <template v-if="!isSearching">
              {{
                $t('components.search_panel.chanel_value', {
                  count: countVideos?.five_channel,
                })
              }}
            </template>
            <template v-else>
              {{ $t('components.units.status_searching') }}
            </template>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search {
  &-panel {
    border-bottom: 1px dashed $color_gray1;
  }

  &-form {
    padding: 24px 0;
  }

  &-subscribers {
    padding: 12px 0;
  }

  &-label {
    padding-bottom: 10px;
    // border-bottom: 1px solid $color_gray1;
  }

  &-labelList {
    padding-left: 8px;
    &_item {
      cursor: pointer;
      padding: 12px 0;
      text-align: center;
      border-bottom: 2px solid transparent;

      &.current {
        color: $color_orange;
        border-bottom: 2px solid $color_orange;
      }
    }
  }
}

.item {
  display: flex;
  align-items: center;
}

:deep(.ant-form-item) {
  margin-bottom: 0;
}

:deep(.countup-wrap span) {
  padding-right: 5px;
}
</style>
