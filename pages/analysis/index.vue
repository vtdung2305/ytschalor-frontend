<script lang="ts" setup>
import { TitleLoading } from '@/constants/common'
import { IModalParams, INotification } from '@/interfaces/common'

// meta
definePageMeta({
  layout: 'page',
})

const router = useRouter()

const route = useRoute()

const activeKey = ref('video')

const { t } = useLang()

const changeTab = () => {
  router.push(`/analysis?type=${activeKey.value}`)
}

const { hasApiKey, setLoading, showNotification, isAdmin } = useHelper()

// const { $modalWarning } = useNuxtApp()

onMounted(async () => {
  if (isAdmin.value) {
    router.push('/404')
    return
  }

  // setLoading(true, TitleLoading.LoadingList)
  if (route.query.type === 'channel') {
    activeKey.value = 'channel'
  } else {
    activeKey.value = 'video'
  }
  // setTimeout(() => {
  //   setLoading(false)
  // }, 1500)

  const params = {
    message: t('components.notification.message_warning'),
    description: t('pages.login.msg_google_api_key'),
    btn: t('components.notification.btn_setting'),
  }

  if (!hasApiKey.value) {
    const confirm = await showNotification(params as INotification)

    if (confirm) router.push('/user-settings')
  }
})
</script>

<template>
  <PageContainer>
    <PageHead :title="$t('pages.analysis.title')">
      <a-tabs v-model:activeKey="activeKey" :size="'large'" @change="changeTab">
        <a-tab-pane
          key="video"
          :tab="$t('pages.analysis.tab_video')"
        ></a-tab-pane>
        <a-tab-pane
          key="channel"
          :tab="$t('pages.analysis.tab_channel')"
        ></a-tab-pane>
      </a-tabs>
    </PageHead>

    <div v-if="activeKey === 'channel'">
      <PageChannel></PageChannel>
    </div>

    <div v-if="activeKey === 'video'">
      <PageVideo></PageVideo>
    </div>
  </PageContainer>
</template>

<style lang="scss" scoped>
:deep(.ant-tabs-top > .ant-tabs-nav) {
  margin-bottom: 0;
}

.ant-tabs-large > .ant-tabs-nav .ant-tabs-tab {
  color: $color_black2;
}

.analysis-page {
  &__filter {
    border-bottom: 1px solid $color_gray1;
  }
}
</style>
