<script setup lang="ts">
import { PropType } from 'vue'
import { IVideoInfo, IKeywordAnalysis } from '@/interfaces/video'

const props = defineProps({
  videoInfo: {
    type: Object as PropType<IVideoInfo | null>,
    default: () => {},
  },
  items: {
    type: Array as PropType<IKeywordAnalysis[]>,
    default: () => [],
  },
  isError: {
    type: Boolean,
    default: false,
  },
})

const isLimit = ref<boolean>(true)

const emit = defineEmits(['callback'])

const callbackAnalysis = () => {
  emit('callback', props.videoInfo)
}

const heightDesc = ref<number>(0)

onMounted(() => {
  heightDesc.value = document.getElementById('c-desc')?.clientHeight || 0
})
</script>

<template>
  <div>
    <div
      v-if="videoInfo"
      id="c-desc"
      class="c-desc text-16px leading-normal mb-24px whitespace-pre-line <tablet:my-20px"
      :class="{ limitText: isLimit }"
    >
      {{ videoInfo.description }}
    </div>
    <div
      v-if="videoInfo && heightDesc > 70"
      class="flex justify-end mb-48px <tablet:mb-24px"
    >
      <p class="c-link" @click="isLimit = !isLimit">
        {{ isLimit ? $t('common.more') : $t('common.close') }}
      </p>
    </div>
    <FrequentWords
      :items="items"
      :is-error="isError"
      @callback="callbackAnalysis"
    ></FrequentWords>
  </div>
</template>

<style lang="scss" scoped>
.c-desc {
  max-height: 10000px;
  transition: max-height 0.5s ease-in-out;
  overflow: hidden;
}

.limitText {
  max-height: 72px;
}
</style>
