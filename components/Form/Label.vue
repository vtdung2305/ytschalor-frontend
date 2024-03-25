<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="flex items-center c-label">
    <label class="c-label_txt">{{ label }}</label>
    <div class="c-label_slot">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.c-label {
  &_txt {
    font-size: 16px;
    display: flex;
    align-items: center;
    padding-bottom: 3px;
    color: #333333;
    // line-height: 24px;
  }

  &_slot {
    margin-left: 4px;
  }
}
</style>
