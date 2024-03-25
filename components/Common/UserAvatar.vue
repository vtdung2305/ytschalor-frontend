<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  avatarUrl: {
    type: String,
    default: null,
  },
})

// const username = ref<string | null>()
</script>

<template>
  <div class="user-avatar">
    <template v-if="avatarUrl">
      <img :src="avatarUrl" class="rounded-1/2 w-24px h-24px" alt="avatar" />
    </template>
    <template v-else>
      <div class="user-avatar_inner rounded-1/2">
        <user-outlined :style="{ fontSize: '12px', color: '#fff' }" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.user-avatar {
  &_inner {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
    background-color: $color_gray1;
  }
}
</style>
