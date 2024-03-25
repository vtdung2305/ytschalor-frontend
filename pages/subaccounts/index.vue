<script setup lang="ts">
// meta
definePageMeta({
  layout: 'page',
})
</script>

<template>
  <PageContainer>
    <PageHead
      class="!pb-24px <tablet:!pb-10px"
      :title="$t('pages.subaccounts.title')"
    ></PageHead>

    <PageBody>
      <PageSubAccounts></PageSubAccounts>
    </PageBody>
  </PageContainer>
</template>

<style lang="scss" scoped></style>
