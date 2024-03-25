<script lang="ts" setup>
// meta
definePageMeta({
  layout: 'page',
})

const activeKey = ref('1')
</script>

<template>
  <PageContainer>
    <PageHead :title="$t('pages.account-setting.title')">
      <a-tabs v-model:activeKey="activeKey" :size="'large'">
        <a-tab-pane
          key="1"
          :tab="$t('pages.account-setting.tab_plan')"
        ></a-tab-pane>
        <a-tab-pane
          key="2"
          :tab="$t('pages.account-setting.tab_withdrawal')"
        ></a-tab-pane>
      </a-tabs>
    </PageHead>
    <PageBody>
      <PagePayment v-if="activeKey === '1'"></PagePayment>
      <PageWithdrawal v-else></PageWithdrawal>
    </PageBody>
  </PageContainer>
</template>

<style lang="scss" scoped>
:deep(.ant-tabs-top > .ant-tabs-nav) {
  margin: unset;
}

:deep(.ant-tabs-large > .ant-tabs-nav .ant-tabs-tab) {
  color: $color_black2;
}
</style>
