<script lang="ts" setup>
import { capitalize } from '~/utils/str'

// composable
const { t } = useLang()

// compiler macro
definePageMeta({
  layout: 'empty',
})
useHead(() => ({
  title: capitalize(t('pages.404.title')),
}))
</script>

<template>
  <PageWrapper class="flex flex-col items-center justify-center h-100vh">
    <Error :code="404" />
  </PageWrapper>
</template>
