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
})

const { analysisKeyword } = useAnalysis()

const emit = defineEmits(['callback'])

const callbackAnalysis = () => {
  emit('callback', props.videoInfo)
}
</script>

<template>
  <div v-if="videoInfo">
    <div class="text-16px leading-normal leading-24px mb-48px">
      {{ videoInfo.title }}
    </div>
    <FrequentWords :items="items" @callback="callbackAnalysis"></FrequentWords>
  </div>
</template>

<style lang="sass" scoped></style>
