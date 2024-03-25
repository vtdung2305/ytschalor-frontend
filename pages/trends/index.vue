<script lang="ts" setup>
definePageMeta({
  layout: 'page',
})
</script>

<template>
  <PageContainer>
    <PageHead :title="$t('pages.trends.title')"> </PageHead>
    <PageBody>
      <Development></Development>
    </PageBody>
  </PageContainer>
</template>

<style lang="scss" scoped>
.page-section {
  padding-bottom: 24px;
}
</style>
