<script lang="ts" setup>
const props = defineProps({
  message: {
    type: String,
    default: undefined,
  },
})
</script>

<template>
  <div class="h-200px flex items-center justify-center">
    <p>{{ message ? message : $t('others.no_data') }}</p>
  </div>
</template>

<style lang="scss" scoped></style>
