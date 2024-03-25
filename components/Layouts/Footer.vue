<script lang="ts" setup>
import { IMenuItem } from '@/interfaces/menu'

const config = useRuntimeConfig()

const { t } = useLang()

const footerItems = ref<IMenuItem[]>([
  {
    name: t('components.footer.term'),
    link: `${config.public.homeUrl}/terms.html`,
  },
  {
    name: t('components.footer.privary'),
    link: `${config.public.homeUrl}/privacy.html`,
  },
  {
    name: t('components.footer.transactions'),
    link: `${config.public.homeUrl}/specified-commercial-transactions.html`,
  },
])
</script>

<template>
  <a-layout-footer :style="{ textAlign: 'center', padding: '25px 0' }">
    <div
      class="flex justify-between px-66px <tablet:flex-col <tablet:mx-auto <tablet:px-6px"
    >
      <ul
        class="footer-menu inline-flex <tablet:pb-10px <tablet:justify-center"
      >
        <li v-for="(footer, index) in footerItems" :key="index">
          <nuxt-link :to="footer.link" target="_blank">
            {{ footer.name }}
          </nuxt-link>
        </li>
      </ul>
      <div class="copyright">
        <p>{{ $t('components.footer.copyright') }}</p>
      </div>
    </div>
  </a-layout-footer>
</template>

<style lang="scss" scoped>
.ant-layout .ant-layout-footer {
  margin-top: 40px;
}

.footer-menu {
  li {
    &::before,
    &:last-child::after {
      content: '';
      display: inline-block;
      vertical-align: middle;
      height: 20px;
      width: 1px;
      background-color: $color_gray1;

      @include mq_down(sp) {
        font-size: 17px;
      }
    }

    a {
      padding: 0 16px;
      color: $color_gray5;
      font-family: $font_roboto;

      @include mq_down(sp) {
        padding: 0 6px;
        font-size: 12px;
      }
    }
  }
}

.copyright {
  font-family: $font_roboto;
  color: $color_gray5;
  font-weight: bold;

  @include mq_down(sp) {
    font-size: 13px;
  }
}
</style>
