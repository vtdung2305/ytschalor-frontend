<script lang="ts" setup>
import { capitalize } from '~/utils/str'

const props = defineProps({
  error: {
    type: Object,
    default: () => {},
  },
})

// composable
// const { t } = useLang()

// compiler macro
definePageMeta({
  layout: 'page',
})
useHead(() => ({
  title: '404',
}))

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <Html :lang="locale">
    <Body
      class="antialiased duration-300 transition-colors dark:text-gray-200 bg-white dark:bg-gray-900"
    >
      <NuxtLayout>
        <NuxtLoadingIndicator :height="5" :duration="3000" :throttle="400" />
        <PageSection class="flex flex-col items-center justify-center">
          <Error :code="error.statusCode" />
        </PageSection>
      </NuxtLayout>
    </Body>
  </Html>
</template>
