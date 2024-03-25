<script lang="ts" setup></script>

<template>
  <div class="page-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  max-width: $container_width;
  margin: 0 auto;
}
</style>
