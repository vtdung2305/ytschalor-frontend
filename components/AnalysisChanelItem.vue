<script lang="ts" setup>
import { PropType } from 'vue'
import { IChannel } from '@/interfaces/channel'
import { comma } from '@/helper/number'

const props = defineProps({
  item: {
    type: Object as PropType<IChannel>,
    default: () => {},
  },
  isBlurry: {
    type: Boolean,
    default: false,
  },
  coefficient: {
    type: Number,
    default: null,
  },
  view: {
    type: Number,
    default: null,
  },
})

const { formatDate } = useHelper()

const thumbnail = computed(() => {
  if (props.item?.thumbnail?.high) {
    return props.item?.thumbnail?.high
  } else if (props.item?.thumbnail?.medium) {
    return props.item?.thumbnail?.medium
  } else {
    return props.item?.thumbnail?.default
  }
})

const bgCoefficient = computed(
  (): boolean => props.item.coefficient > props.coefficient
)

const bgView = computed(
  (): boolean => props.item?.viewCount / props.item?.videoCount > props.view
)

const emit = defineEmits(['analyzeChannel'])

const handelDetailChannel = (item: IChannel) => {
  emit('analyzeChannel', item)
}
</script>

<template>
  <div
    v-if="item"
    class="chanel-item pt-32px pb-37px flex <tablet:flex-col"
    :class="{ blurry: isBlurry }"
  >
    <div class="<tablet:flex <tablet:justify-center">
      <div class="relative rounded-full overflow-hidden h-128px">
        <ImageVideo
          :width="128"
          :src-thumb="thumbnail"
          :src-preview="thumbnail"
        />
        <div class="coefficient" :class="{ hight: bgCoefficient }">
          {{ $t('pages.analysis.channel_item.coefficient') }}
          {{ comma(formatTwoDecimal(item?.coefficient)) }}
        </div>
      </div>
    </div>

    <div
      class="ml-32px <tablet:ml-0 <tablet:mt-32px w-[calc(100%-160px)] <tablet:w-full"
    >
      <div class="flex items-center mb-12px">
        <p class="chanel-item__count text-16px" :class="{ hight: bgView }">
          {{ $t('pages.analysis.channel_item.average_number') }}
          {{
            comma(
              formatTwoDecimal(
                Number(item?.viewCount) / Number(item?.videoCount)
              )
            ) || 0
          }}
        </p>
        <p class="text-20px ml-10px">{{ item?.title || $t('others.empty') }}</p>
      </div>
      <div>
        <p class="chanel-item__desc text-14px leading-24px mb-6px">
          {{ $t('pages.analysis.channel_item.overview_of_channel') }}
          {{ item?.description || $t('others.empty') }}
        </p>
      </div>
      <div class="flex mb-6px">
        <p class="text-14px leading-24px">
          {{ $t('pages.analysis.channel_item.registrants') }}
          {{ comma(item.subscriberCount) }}
          {{ $t('pages.analysis.channel_item.people') }}
        </p>
        <p class="ml-20px text-14px leading-24px">
          {{ $t('pages.analysis.channel_item.video_count') }}
          {{ comma(item.videoCount) }}
          {{ $t('pages.analysis.channel_item.book') }}
        </p>
      </div>
      <div class="flex mb-13px">
        <p class="text-14px leading-24px">
          {{ $t('pages.analysis.channel_item.summary_view') }}
          {{ comma(item?.viewCount) }}
          {{ $t('pages.analysis.channel_item.viewed_times') }}
        </p>
        <p class="ml-20px text-14px leading-24px">
          {{ $t('pages.analysis.channel_item.opening_date') }}
          {{ formatDate(item?.publishedAt) }}
        </p>
      </div>
      <nuxt-link
        class="chanel-item__analyze"
        @click="handelDetailChannel(item)"
      >
        {{ $t('pages.analysis.channel_item.analyze') }}
      </nuxt-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chanel-item {
  border-top: 1px solid $color_gray1;

  &__count {
    border-radius: 5px;
    border: 1px solid #d7d7d7;
    background: #d7d7d7;
    padding: 3px 12px;
    line-height: 24px;
    flex: 0 0 auto;

    &.hight {
      background: $color_yellow;
      border: unset;
    }
  }

  &__analyze {
    color: $color_blue;
    padding-bottom: 4px;
    border-bottom: 1px solid $color_blue;
  }

  &__desc {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}

:deep(.ant-image-mask) {
  border-radius: 9999px;
}

:deep(.ant-image) {
  img {
    border-radius: 50% 50%;
  }
}

.coefficient {
  position: absolute;
  width: 114px;
  height: 35px;
  background-color: $color_gray1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding-bottom: 5px;

  &.hight {
    background: $color_yellow;
  }
}
</style>
