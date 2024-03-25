<script setup lang="ts">
import { MasterSite } from '@/constants/common'

const props = defineProps({
  width: {
    type: [Number, String],
    default: '',
  },
  height: {
    type: [Number, String],
    default: '',
  },
  srcThumb: {
    type: String,
    default: MasterSite.NoImageMiddle,
  },
  srcPreview: {
    type: String,
    default: MasterSite.NoImageLarge,
  },
  className: {
    type: String,
    default: '',
  },
  showTextPreview: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <a-image
    :width="width"
    :height="height"
    :src="srcThumb"
    :preview="{
      src: srcPreview,
    }"
    :class="className"
  >
    <template #previewMask>
      <EyeOutlined />
      <template v-if="showTextPreview">
        {{ $t('others.preview') }}
      </template>
    </template>
  </a-image>
</template>

<style lang="scss" scoped></style>
