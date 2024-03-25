<script lang="ts" setup>
// meta
definePageMeta({
  layout: 'page',
})

const route = useRoute()

const router = useRouter()

const activeKey = ref('suggestions')

const changeTab = () => {
  router.push(`/search?tab=${activeKey.value}`)
}

onMounted(() => {
  if (route.query.tab === 'history') {
    activeKey.value = 'history'
  } else {
    activeKey.value = 'suggestions'
  }
})
</script>

<template>
  <PageContainer>
    <PageHead :title="$t('pages.search.title')">
      <a-tabs v-model:activeKey="activeKey" :size="'large'" @change="changeTab">
        <a-tab-pane
          key="suggestions"
          :tab="$t('pages.search.tab_suggestions')"
        ></a-tab-pane>
        <a-tab-pane
          key="history"
          :tab="$t('pages.search.tab_history')"
        ></a-tab-pane>
      </a-tabs>
    </PageHead>

    <PageSuggestions v-if="activeKey === 'suggestions'"></PageSuggestions>
    <PageBody v-else>
      <PageSearch></PageSearch>
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
