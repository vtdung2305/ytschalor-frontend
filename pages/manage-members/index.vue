<script lang="ts" setup>
// meta
definePageMeta({
  layout: 'page',
})
</script>

<template>
  <PageContainer>
    <PageHead :title="$t('pages.manage-members.title')"> </PageHead>
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
