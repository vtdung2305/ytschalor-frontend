<script lang="ts" setup>
import { MasterSite } from '@/constants/common'

const getImageUrlDevelopment = computed(() => {
  return MasterSite.img_development
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-500px">
    <img class="w-200px h-200px" :src="getImageUrlDevelopment" alt="" />
    <div class="mt-10px">
      {{ $t('others.development1') }} <br />
      {{ $t('others.development2') }}
    </div>
  </div>
</template>
