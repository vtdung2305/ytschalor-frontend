<script setup lang="ts">
import { MasterSite } from '@/constants/common'

const config = useRuntimeConfig()

const open = ref<boolean>(false)

const hideModal = () => {
  open.value = false
}

const showModal = () => {
  open.value = true
}
</script>

<template>
  <div class="help">
    <div class="help-icon flex flex-col items-center">
      <img
        class="w-40px h-40px"
        :src="MasterSite.icon_help"
        alt=""
        @click="showModal()"
      />
      <span class="help-text"> {{ $t('components.help.text') }}</span>
    </div>
    <div class="help-noti" :class="{ show: open }">
      <div class="flex items-center mb-8px">
        <div class="help-noti__title">{{ $t('components.help.title') }}</div>
        <img :src="MasterSite.icon_close" alt="" @click="hideModal()" />
      </div>
      <div class="help-noti__body">
        <a :href="config.public.supportSiteUrl" target="_blank" class="c-link">
          {{ $t('components.help.support_site_url') }}
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.help {
  &-icon {
    position: fixed;
    right: 44px;
    bottom: 50px;

    @include mq_down(sp) {
      position: fixed;
      right: 10px;
      bottom: 38px;
    }
  }

  img {
    cursor: pointer;
  }

  &-text {
    font-size: 14px;
    color: $color_orange;
  }

  &-noti {
    position: fixed;
    right: 44px;
    bottom: 124px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: $color_white;
    box-shadow: 0px 9px 28px 0px #0000000d;
    box-shadow: 0px 6px 16px 0px #00000014;
    box-shadow: 0px 3px 6px 0px #0000001f;
    padding: 32px;
    display: none;
    transition: opacity 1s ease-out;
    opacity: 0;
    height: 0;

    &__title {
      font-size: 14px;
    }

    &__body {
      font-size: 14px;
    }

    &.show {
      opacity: 1;
      display: block;
      height: auto;
    }
  }
}
</style>
