<script lang="ts" setup></script>

<template>
  <div class="page-section">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.page-section {
  background-color: $color_white;
  padding: 24px;
  margin-bottom: 27px;

  @include mq-down(sp) {
    padding: 15px;
  }
}
</style>
