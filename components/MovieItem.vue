<script lang="ts" setup>
import { PropType } from 'vue'
import { IVideoItem } from '@/interfaces/video'

const props = defineProps({
  item: {
    type: Object as PropType<IVideoItem>,
    default: () => {},
  },
  coefficient: {
    type: Number,
    default: null,
  },
})

const bgCoefficient = computed(
  (): boolean => props.item.coefficient >= props.coefficient
)

const thumbnail = computed(() => {
  if (props.item?.thumbnail?.high) {
    return props.item?.thumbnail?.high
  } else if (props.item?.thumbnail?.medium) {
    return props.item?.thumbnail?.medium
  } else {
    return props.item?.thumbnail?.default
  }
})

const toVideoDetail = (id: string) => {
  window.open(`https://www.youtube.com/watch?v=${id}`, '_blank')
}
</script>

<template>
  <div class="movie-item flex pt-20px pb-20px">
    <ImageVideo :width="180" :src-thumb="thumbnail" :src-preview="thumbnail" />

    <div
      class="ml-20px <tablet:ml-0 <tablet:mt-32px w-[calc(100%-160px)] <tablet:w-full"
    >
      <div class="flex flex-col items-baseline">
        <p
          class="movie-item__count text-16px mb-10px"
          :class="{ hight: bgCoefficient }"
        >
          {{ $t('pages.analysis.channel_item.coefficient') }}
          {{ item.coefficient }}
        </p>
        <div
          class="flex items-center cursor-pointer"
          @click="toVideoDetail(item.videoId as string)"
        >
          <p class="movie-item__title mr-8px">
            {{ item.title }}
          </p>
          <span class="c-icon-vector"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.movie-item {
  border-bottom: 1px solid $color_gray1;

  &__count {
    border-radius: 5px;
    border: 1px solid #d7d7d7;
    background: #d7d7d7;
    padding: 3px 12px;
    line-height: 24px;

    &.hight {
      background: $color_yellow;
    }
  }

  &__title {
    cursor: pointer;
    padding-bottom: 4px;
    font-size: 18px;
    line-height: 24px;
    width: calc(100% - 20px);
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    &:hover {
      text-decoration: underline;
      text-underline-position: auto;
      text-underline-offset: 4px;
    }
  }
}
</style>
