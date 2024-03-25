<script setup lang="ts">
import { PropType } from 'vue'
import { IVideoItem } from '@/interfaces/video'
import { comma } from '@/helper/number'

const props = defineProps({
  itemVideo: {
    type: Object as PropType<IVideoItem>,
    default: () => {},
  },
  coefficient: {
    type: [Number, String],
    default: 0,
  },
  isBlurry: {
    type: Boolean,
    default: false,
  },
})

const bgCoefficient = computed(
  (): boolean => props.itemVideo.coefficient >= props.coefficient
)

const emit = defineEmits(['analyze-video'])

const { formatDate } = useHelper()
</script>

<template>
  <div
    class="flex gap-x-38px video-item <tablet:flex-wrap"
    :class="{ blurry: isBlurry }"
  >
    <div class="video-item_thumb w-320px <tablet:w-full <tablet:mb-20px">
      <nuxt-link :to="`/`">
        <div class="relative">
          <ImageVideo
            :src-thumb="itemVideo.thumbnail.medium"
            :src-preview="itemVideo.thumbnail.high"
            :width="$device.isTablet || $device.isMobile ? '100%' : 320"
          />
          <div class="video-coefficient" :class="{ hight: bgCoefficient }">
            {{ $t('components.search_video.coefficient') }}
            {{ itemVideo.coefficient }}
          </div>
        </div>
      </nuxt-link>
      <div class="text-center">
        <nuxt-link
          :to="`https://www.youtube.com/watch?v=${itemVideo.videoId}`"
          :target="`_blank`"
          class="video-item_watch text-center"
        >
          {{ $t('components.item_video.watch_video') }}
        </nuxt-link>
      </div>
    </div>

    <div class="video-item_info">
      <h2
        class="video-item_title text-20px leading-24px"
        v-html="itemVideo.title"
      ></h2>
      <div class="video-item_meta">
        <div class="meta-item flex gap-x-20px">
          <div class="meta-block">
            <span class="meta-item_ttl">{{
              $t('components.item_video.number_of_views')
            }}</span>
            <span class="meta-item_value"
              >{{ comma(itemVideo.video_detail.viewCount)
              }}{{ $t('components.units.view_time') }}</span
            >
          </div>
          <div class="meta-block">
            <span class="meta-item_ttl">{{
              $t('components.item_video.post_date')
            }}</span>
            <span class="meta-item_value">{{
              formatDate(itemVideo.video_detail.publishedAt)
            }}</span>
          </div>
        </div>

        <div class="meta-item flex gap-x-20px">
          <div class="meta-block">
            <span class="meta-item_ttl">{{
              $t('components.item_video.high_rating')
            }}</span>
            <span class="meta-item_value">{{
              comma(itemVideo.video_detail.likeCount)
            }}</span>
          </div>
          <div class="meta-block">
            <span class="meta-item_ttl">{{
              $t('components.item_video.number_of_comments')
            }}</span>
            <span class="meta-item_value"
              >{{ comma(itemVideo.video_detail.commentCount)
              }}{{ $t('components.units.pieces') }}</span
            >
          </div>
        </div>

        <div class="meta-item flex gap-x-20px">
          <div class="meta-block">
            <span class="meta-item_ttl">{{
              $t('components.item_video.channel_name')
            }}</span>
            <span class="meta-item_value"
              ><nuxt-link
                :to="`https://www.youtube.com/channel/${itemVideo.channelId}`"
                :target="`_blank`"
                >{{ itemVideo.channelTitle
                }}<i class="c-icon-vector"></i></nuxt-link
            ></span>
          </div>
        </div>

        <div class="meta-item flex gap-x-20px">
          <div class="meta-block">
            <span class="meta-item_ttl">{{
              $t('components.item_video.number_of_registrants')
            }}</span>
            <span class="meta-item_value"
              >{{ comma(itemVideo.channel_detail.subscriberCount)
              }}{{ $t('components.units.people') }}</span
            >
          </div>
          <div class="meta-block">
            <span class="meta-item_ttl">{{
              $t('components.item_video.number_of_videos')
            }}</span>
            <span class="meta-item_value"
              >{{ comma(itemVideo.channel_detail.videoCount)
              }}{{ $t('components.units.book') }}</span
            >
          </div>
        </div>

        <div class="meta-item flex gap-x-20px">
          <div class="meta-block">
            <span class="meta-item_ttl">{{
              $t('components.item_video.total_number_of_views')
            }}</span>
            <span class="meta-item_value"
              >{{ comma(itemVideo.channel_detail.viewCount)
              }}{{ $t('components.units.view_time') }}</span
            >
          </div>
          <div class="meta-block">
            <span class="meta-item_ttl">{{
              $t('components.item_video.oppening_date')
            }}</span>
            <span class="meta-item_value">{{
              formatDate(itemVideo.channel_detail.publishedAt)
            }}</span>
          </div>
        </div>
      </div>
      <span
        class="inline-block video-item_analyze cursor-pointer"
        @click="$emit('analyze-video', itemVideo)"
      >
        {{ $t('components.item_video.analyze_video') }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video {
  &-item {
    padding: 32px 0;
    border-top: 1px solid $color_gray1;

    &_title {
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &_meta {
      padding-top: 18px;
    }

    &_analyze {
      margin-top: 15px;
      line-height: 22px;
      color: $color_blue;
      border-bottom: 2px solid $color_blue;

      transition: opacity 0.3s ease-in-out;

      &:hover {
        opacity: 0.6;
      }
    }

    &_watch {
      font-size: 12px;
      line-height: 22px;
      border-bottom: 1px solid $color_black2;

      &:after {
        display: inline-block;
        vertical-align: -1px;
        content: '';
        background: url('/images/icons/icon_vector.svg') no-repeat left center;
        background-size: contain;
        width: 12px;
        height: 12px;
        margin-left: 4px;
      }
    }
  }

  &-coefficient {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    color: $color_white;
    font-size: 16px;
    padding: 3px 14px;
    background-color: $color_black1;

    &.hight {
      color: $color_black2;
      background-color: $color_yellow;
    }
  }
}

.meta {
  &-item {
    &:not(:last-child) {
      margin-bottom: 6px;
    }
  }
  &-block {
    line-height: 24px;
  }
}

a {
  &:hover {
    color: $color_black2;
  }
}
</style>
