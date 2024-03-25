<script lang="ts" setup>
definePageMeta({ layout: 'empty' })
</script>

<template>
  <div class="h-screen">
    <div class="w-full h-full login-page flex justify-center items-center">
      <FormLogin> </FormLogin>
    </div>
    <div class="notify-bottom fixed w-full bottom-0 text-center">
      <p
        class="text-16px leading-normal <tablet:text-13px <tablet:leading-20px"
      >
        {{ $t('pages.login.msg_admin') }}
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.notify-bottom {
  background-color: $color_blue4;
  color: $color_white;
  font-weight: 400;
  padding: 12px 8px;

  @include mq_down(sp) {
    padding: 7px;
  }
}
</style>
