<script lang="ts" setup>
// meta
definePageMeta({ layout: 'page' })

const { t } = useLang()

const activeKey = ref('1')
</script>

<template>
  <PageContainer>
    <PageHead title="キーワード分析">
      <a-tabs v-model:activeKey="activeKey" :size="'large'">
        <a-tab-pane key="1" :tab="`動画検索`"></a-tab-pane>
        <a-tab-pane
          key="2"
          :tab="$t('pages.user_setting.account_info')"
        ></a-tab-pane>
        <a-tab-pane
          key="3"
          :tab="$t('pages.user_setting.password_setting')"
        ></a-tab-pane>
      </a-tabs>
    </PageHead>

    <PageBody>
      <p>Demo</p>
    </PageBody>
  </PageContainer>
</template>

<style lang="scss" scoped>
:deep(.ant-tabs-top > .ant-tabs-nav) {
  margin-bottom: 0;
}
</style>
