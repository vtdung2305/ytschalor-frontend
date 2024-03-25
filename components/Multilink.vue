<script lang="ts" setup></script>

<template>
  <!-- <span v-if="!to">
    <slot />
  </span>
  <a
    v-else-if="isExternal"
    v-bind="$attrs"
    :href="to"
    :rel="rel"
    :target="externalTarget"
    class="u-nonepopup"
  >
    <slot />
  </a> -->
  <nuxt-link :to="to" v-bind="$attrs">
    <slot />
  </nuxt-link>
</template>
