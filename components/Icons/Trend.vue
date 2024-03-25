<script lang="ts">
import Icon from '@ant-design/icons-vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    Icon,
  },

  setup() {},
})
</script>

<template>
  <icon>
    <template #component>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="16"
        viewBox="0 0 22 16"
        fill="currentColor"
      >
        <path
          d="M21.0829 0.667114L13.6263 2.66499L15.5774 4.61611L12.0079 8.18699L9.25788 5.43699L0.91713 13.7764L2.47363 15.3329L9.25788 8.54724L12.0079 11.2972L17.1339 6.17124L19.085 8.12374L21.0829 0.667114Z"
          fill="currentColor"
        />
      </svg>
    </template>
  </icon>
</template>

<style scoped lang="scss"></style>
