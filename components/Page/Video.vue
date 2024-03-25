<script setup lang="ts">
import { $Fetch } from 'ohmyfetch'
import cloneDeep from 'lodash/cloneDeep'
import { LockOutlined } from '@ant-design/icons-vue'
import { ITab } from '@/interfaces/tabs'
import { MasterSite, TitleLoading, GoogleTypeEnum } from '@/constants/common'
import {
  IFormSearchParams,
  IVideoParams,
  IVideoItem,
  IVideoInfo,
  IFormSortVideo,
} from '@/interfaces/video'
import { comma } from '@/helper/number'
import { useCompare } from '@/stores/compare'
import { INotification } from '@/interfaces/common'
import {
  VideoDataSample,
  PeriodSpecificationLists,
  PeriodSpecificationEnum,
  ErrorCode,
  ErrorCodeEnum,
} from '@/constants/video'
import { useVideo } from '@/stores/video'
import { useUser } from '@/stores/user'
import { CookieKeyEnum } from '@/constants/cookie'
import { useChannel } from '@/stores/channel'

const { t } = useLang()

const { $api } = useNuxtApp()

const route = useRoute()

const router = useRouter()

const videoStore = useVideo()

const channelStore = useChannel()

const userStore = useUser()

const options = ref({
  autoplay: false,
  muted: false,
  controls: [
    'play-large',
    'play',
    'progress',
    'current-time',
    'mute',
    'volume',
    'captions',
    'settings',
    'pip',
    'airplay',
    'fullscreen',
  ],
})

const analyze = ref<Boolean>(false)

const { formatDate, setLoadingDrawer, showNotification, isPlanFree } =
  useHelper()

const { searchVideo, getVideoDetail } = useVideoInfo()

const videoDetail = ref<IVideoInfo>()

const { analysisTitleLists, analysisDescriptionLists, analysisKeyword } =
  useAnalysis()

const selectVideoItem = ref<IVideoItem | null>()

const registrants = ref<number | null>(null)

const videoStorageLists = computed(() => videoStore.videoStorageLists)

const analyzeVideo = async (itemVideo: IVideoItem) => {
  currentTab.value = 1
  analyze.value = true
  selectVideoItem.value = itemVideo
  const keywords = [itemVideo.title]

  registrants.value = itemVideo?.channel_detail?.subscriberCount

  await setLoadingDrawer(true, TitleLoading.LoadingList)
  // await getVideoDetail(itemVideo.videoId as string)
  videoDetail.value = itemVideo.details
  videoDetail.value.title = itemVideo.title
  if (videoDetail.value && videoDetail.value.description) {
    keywords.push(videoDetail.value.description)
  }
  await analysisKeyword(keywords as string[])
  await setLoadingDrawer(false)
}

const currentTab = ref(1)

const modelParams = ref<IVideoParams>()

const { isSearching, isLoading, videoLists } = useVideoInfo()

const compareStore = useCompare()

const params = reactive<IFormSearchParams>(cloneDeep(videoStore.searchParams))

const formSort = reactive<IFormSortVideo>(cloneDeep(videoStore.filterParams))

const handelSearch = async () => {
  const paramsSearch = cloneDeep(params)

  isLoading.value = true
  // reset filter panel when search
  formSort.sort_type = 'video_detail.viewCount'
  formSort.order = 'desc'
  formSort.checked = false
  formSort.filter = []

  await videoStore.resetFilter(formSort as IFormSortVideo)

  await searchVideo(paramsSearch as IFormSearchParams)
    .then((e: any) => {})
    .catch(async (e: any) => {
      if (e?.message?.status === 400) {
        if (ErrorCode.includes(e?.message?._data?.error_code)) {
          const params = {
            description: e?.message?._data?.message,
            duration: 4.5,
            icon: true,
            status: false,
          }

          showNotification(params as INotification)

          if (
            e?.message?._data?.error_code ===
            ErrorCodeEnum.RATE_SEARCH_LIMIT_EXCEEDED
          ) {
            await videoStore.$reset()
            await channelStore.$reset()
          }
        } else if (
          e?.message?._data?.error_code === ErrorCodeEnum.API_KEY_INVALID
        ) {
          const userData = localStorage.getItem(CookieKeyEnum.USER_DATA)

          if (userData) {
            const data = JSON.parse(userData)

            data.google_api_key_configured = false

            localStorage.setItem(CookieKeyEnum.USER_DATA, JSON.stringify(data))

            userStore.setUser(data)
          }

          // $api.user
          //   .settingKey({ handle_action: GoogleTypeEnum.DELETE })
          //   .then(async () => {})
          //   .catch(async (e: any) => {})

          isLoading.value = false
          const params = {
            message: t('components.notification.message_warning'),
            description: t('pages.login.msg_google_api_key'),
            btn: t('components.notification.btn_setting'),
          }

          const confirm = await showNotification(params as INotification)

          if (confirm) router.push('/user-settings')
        } else {
          isLoading.value = false
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
  isLoading.value = false
}

const addVideoCompare = () => {
  document.getElementsByTagName('body')[0].style.overflow = 'unset'

  const titleArrLists = analysisTitleLists.value.map((item) => {
    const temp = analysisDescriptionLists.value.find(
      (element) => element.keyword === item.keyword
    )

    return {
      keyword: item.keyword,
      type: item.type,
      count: temp ? item.count + temp.count : item.count,
    }
  })

  const videoInfo = {
    ...videoDetail.value,
    titleLists: titleArrLists,
    descriptionLists: analysisDescriptionLists.value,
    registrants: registrants.value,
  }

  const found = compareStore.listVideoCompare.some(
    (el) => el.id === videoInfo.id
  )

  if (found) {
    const params = {
      description: t('components.search_video.msg_error_add_list_compare'),
      duration: 4.5,
      icon: true,
      status: false,
    }

    showNotification(params as INotification)
  }

  compareStore.addItem(videoInfo as IVideoInfo)
}

const tabs = reactive<ITab[]>([
  {
    key: 1,
    name: t('components.search_video.basic_info'),
  },
  {
    key: 2,
    name: t('components.search_video.title_analysis'),
  },
  {
    key: 3,
    name: t('components.search_video.summary_analysis'),
  },
  {
    key: 4,
    name: t('components.search_video.keyword_analysis'),
  },
])

const callback = async (videoInfo: IVideoInfo) => {
  const keywords = [videoInfo.title]

  await setLoadingDrawer(true, TitleLoading.LoadingList)
  if (videoDetail.value && videoDetail.value.description) {
    keywords.push(videoDetail.value.description)
  }
  await analysisKeyword(keywords as string[])
  await setLoadingDrawer(false)
}

const videoCompareCount = computed(() => {
  if (!userStore?.userData) return null
  return userStore?.userData.plan?.plan_detail.compareable_videos_count
})

watch(analyze, (newVal) => {
  if (!newVal) {
    selectVideoItem.value = null
  }
})

watch(currentTab, (newVal) => {
  if (newVal) {
    const elm: HTMLCollection | any =
      window.document.getElementsByClassName('ant-drawer-body')[0]

    if (elm) {
      setTimeout(() => {
        elm.scrollTop = 0
        document.getElementsByTagName('body')[0].style.overflow = 'hidden'
      }, 20)
    }
  }
})
</script>

<template>
  <div>
    <PageBody>
      <SearchVideo
        v-model="params"
        :is-searching="isSearching"
        @search-video="handelSearch"
      ></SearchVideo>
    </PageBody>

    <PageBody>
      <SearchPanel
        v-if="videoStorageLists.length && !isSearching"
        v-model="formSort"
        :coefficient="params.coefficient"
        :is-searching="isSearching"
      ></SearchPanel>
      <template v-if="!isSearching">
        <template v-if="!videoLists.length">
          <NoData />
        </template>
        <template v-else>
          <div class="videoList">
            <VideoItem
              v-for="(video, index) in videoLists"
              :key="index"
              :item-video="video"
              :coefficient="params.coefficient"
              @analyze-video="analyzeVideo"
            />
          </div>
          <template v-if="isPlanFree">
            <div class="relative">
              <VideoItem
                v-for="(video, index) in videoLists.slice(0, 2)"
                :key="index"
                :item-video="video"
                :is-blurry="true"
                :coefficient="params.coefficient"
                @analyze-video="analyzeVideo"
              />
              <ModalPaidMember />
            </div>
          </template>
        </template>
      </template>
      <template v-else>
        <SearchLoading />
      </template>
    </PageBody>

    <DrawerVideo
      v-model="analyze"
      :width="$device.isTablet || $device.isMobile ? '100%' : 720"
      :title="$t('components.drawer_video.heading')"
    >
      <template #custom-head>
        <Tabs v-model="currentTab" :items="tabs" />
      </template>
      <div v-if="videoDetail" class="video-info">
        <div class="video-tabContent">
          <div v-if="currentTab === 1" class="video-tabContent_item">
            <div class="video-thumbnail w-656px <tablet:w-full">
              <!-- <ImageVideo
                :width="$device.isTablet || $device.isMobile ? '100%' : 560"
                :src="selectVideoItem.thumbnail.high"
              /> -->
              <vue-plyr
                ref="player"
                :key="`${videoDetail.id}-youtube`"
                :options="options"
              >
                <div class="plyr__video-embed">
                  <iframe
                    :width="$device.isTablet || $device.isMobile ? '100%' : 656"
                    :src="`https://www.youtube.com/watch?v=${videoDetail.id}`"
                    allowfullscreen
                    allowtransparency
                    :data-poster="videoDetail.thumbnail.high"
                  ></iframe>
                </div>
              </vue-plyr>
            </div>

            <div
              class="video-action mt-16px flex items-center gap-x-12px flex-wrap"
            >
              <Button
                class="btn-compare <tablet:w-full mb-0"
                :label="$t('components.search_video.btn_compare_video')"
                :disabled="
                  isPlanFree || compareStore.listVideoCompare.length >= 10
                "
                :icon="isPlanFree ? LockOutlined : null"
                @click="addVideoCompare"
              />
              <span
                class="video-count <tablet:pt-10px"
                :class="{ disabled: isPlanFree }"
              >
                <template v-if="!isPlanFree">
                  {{
                    $t('components.search_video.count_video', {
                      count: videoCompareCount,
                    })
                  }}
                </template>
                <template v-else>
                  {{ $t('pages.analysis.note_limit') }}
                </template>
              </span>
            </div>

            <p class="video-ttl">
              <nuxt-link
                class="border-b border-solid"
                :to="`https://www.youtube.com/watch?v=${videoDetail.id}`"
                :target="`_blank`"
              >
                <span>
                  {{ videoDetail.title }}<span class="c-icon-vector"></span>
                </span>
              </nuxt-link>
            </p>

            <div class="video-tbl mt-24px">
              <table class="c-tbl bordered">
                <tbody>
                  <tr>
                    <td>{{ $t('components.search_video.channel_name') }}</td>
                    <td>
                      <template v-if="videoDetail.channelTitle">
                        <nuxt-link
                          class="channel-name border-b border-solid"
                          :to="`https://www.youtube.com/channel/${videoDetail.channelId}`"
                          :target="`_blank`"
                          >{{ videoDetail.channelTitle
                          }}<span class="c-icon-vector"></span
                        ></nuxt-link>
                      </template>
                      <template v-else>{{ $t('others.empty') }}</template>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('components.search_video.coefficient') }}</td>
                    <td>
                      <template v-if="selectVideoItem">
                        {{ selectVideoItem.coefficient || $t('others.empty') }}
                      </template>
                      <template v-else>
                        {{ $t('others.empty') }}
                      </template>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('components.search_video.number_of_views') }}</td>
                    <td>
                      {{ comma(videoDetail.viewCount) }}
                      {{ $t('components.units.view_time') }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('components.search_video.post_date') }}</td>
                    <td>
                      <template v-if="videoDetail?.publishedAt">
                        {{
                          formatDate(videoDetail?.publishedAt) ||
                          $t('others.empty')
                        }}
                      </template>
                      <template v-else>{{ $t('others.empty') }}</template>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('components.search_video.high_rating') }}</td>
                    <td>
                      {{ comma(videoDetail.likeCount) || $t('others.empty') }}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {{ $t('components.search_video.number_of_comments') }}
                    </td>
                    <td>
                      <template v-if="videoDetail?.commentCount">
                        {{ comma(videoDetail.commentCount) }}
                        {{ $t('components.units.pieces') }}
                      </template>
                      <template v-else>{{ $t('others.empty') }}</template>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('components.search_video.category') }}</td>
                    <td>
                      {{ videoDetail.category_title || $t('others.empty') }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('components.search_video.language') }}</td>
                    <td>
                      {{
                        videoDetail.defaultAudioLanguage || $t('others.empty')
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('components.search_video.overview') }}</td>
                    <td>
                      <template v-if="videoDetail?.description">
                        <p
                          class="whitespace-pre-line"
                          v-html="videoDetail.description"
                        ></p>
                      </template>
                      <template v-else>{{ $t('others.empty') }}</template>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('components.search_video.topics') }}</td>
                    <td>
                      <template v-if="videoDetail?.topicDetails.length">
                        <div class="flex flex-col">
                          <div
                            v-for="(topic, index) in videoDetail.topicDetails"
                            :key="index"
                          >
                            <nuxt-link
                              class="channel-name border-b border-solid"
                              :to="topic"
                              :target="`_blank`"
                              >{{ topic }}<span class="c-icon-vector"></span
                            ></nuxt-link>
                          </div>
                        </div>
                      </template>
                      <template v-else>{{ $t('others.empty') }}</template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else-if="currentTab === 2" class="video-tabContent_item">
            <video-analysis-title
              :video-info="videoDetail"
              :items="analysisTitleLists"
              @callback="callback"
            ></video-analysis-title>
          </div>
          <div v-else-if="currentTab === 3" class="video-tabContent_item">
            <template v-if="!videoDetail.description">
              <p class="desc-keyword -mt-8px pb-30px">
                {{ $t('pages.analysis.no_overview') }}
              </p>
            </template>
            <video-analysis-description
              v-else
              :video-info="videoDetail"
              :items="analysisDescriptionLists"
              @callback="callback"
            ></video-analysis-description>
          </div>
          <div v-else class="video-tabContent_item -mt-8px">
            <video-analysis-keyword
              :video-info="videoDetail"
            ></video-analysis-keyword>
          </div>
          <!-- <div v-else>
            <Development></Development>
          </div> -->
        </div>
      </div>
    </DrawerVideo>
  </div>
</template>

<style lang="scss" scoped>
.video {
  &-ttl {
    display: inline-block;
    padding-top: 20px;
    font-size: 18px;
    line-height: 26px;

    > a {
      border-color: transparent;

      &:hover {
        color: $color_black2;
        border-color: rgba($color: $color_black2, $alpha: 0.6);
      }
    }

    > span {
      border-bottom: 1px solid;
      display: inline-flex;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      align-items: center;
    }
  }
}

.c-tbl {
  tbody {
    tr {
      td {
        &:first-child {
          width: 170px;

          @include mq_down(sp) {
            width: 110px;
          }
        }
      }
    }
  }
}

.channel-name {
  border-color: transparent;

  &:hover {
    color: $color_black2;
    border-color: $color_black2;
    // text-decoration: underline;
  }
}

:deep(.plyr__poster) {
  background-size: cover;
}

.video-count {
  &.disabled {
    color: $color_gray5;
  }
}

.btn-compare {
  :deep(.ant-btn:disabled) {
    color: $color_white;
  }
}

:deep(.ant-drawer-header) {
  flex-direction: column;
  align-items: flex-start;
}
</style>
