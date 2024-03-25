<script lang="ts" setup>
import { AppConfigInput } from '@nuxt/schema'
import { useRecaptchaProvider } from 'vue-recaptcha'
import { useI18n } from 'vue-i18n'
import { AppSetup } from './utils/app'
AppSetup()
const locale = useState<string>('locale.setting')

const app = useAppConfig() as AppConfigInput

const { t } = useI18n()

useRecaptchaProvider()

useHead({
  title: app.name,
  titleTemplate: 'YT-Scholar',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: t('others.description'),
    },
  ],
  link: [
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    // {
    //   rel: 'mask-icon',
    //   href: '/safari-pinned-tab.svg',
    //   color: '#5bbad5',
    // },
  ],
})

const { collapsed } = useSideBar()
</script>

<template>
  <Html :lang="locale">
    <Body
      class="antialiased duration-300 transition-colors dark:text-gray-200 dark:bg-gray-900 overscroll-y-none"
      :class="{ openMenu: !collapsed }"
    >
      <NuxtLayout>
        <NuxtLoadingIndicator :height="5" :duration="3000" :throttle="400" />
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>
