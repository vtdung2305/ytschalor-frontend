<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <PageSection>
    <div class="page-body">
      <slot />
    </div>
  </PageSection>
</template>

<style lang="scss">
.page-body {
  // code here
}
</style>
