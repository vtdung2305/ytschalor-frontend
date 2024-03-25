<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <PageSection>
    <h2 class="page-title pb-5px">{{ title }}</h2>
    <div class="page-head">
      <slot />
    </div>
  </PageSection>
</template>

<style lang="scss" scoped>
.page-title {
  font-size: 20px;
  line-height: 28px;
  font-weight: bold;
  color: $color_black2;
}

.page-section {
  padding-bottom: 0;
}
</style>
