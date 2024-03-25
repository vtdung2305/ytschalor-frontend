<script lang="ts" setup>
const props = defineProps({
  message: {
    type: String,
    default: undefined,
  },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-500px">
    <a-empty :description="message ? message : $t('others.no_data')" />
  </div>
</template>
