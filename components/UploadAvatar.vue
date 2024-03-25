<script lang="ts" setup>
import { MasterSite } from '@/constants/common'

const props = defineProps({
  modelValue: {
    type: [File, String],
    default: null,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const { t } = useLang()

const fileInput = ref()

const message = ref('')

const handleUpdateValue = () => {
  fileInput.value.click()
}

const handleClickIcon = () => {
  if (!previewImage.value) {
    handleUpdateValue()
  } else {
    previewImage.value = ''
    emit('update:modelValue', null)
  }
}

const previewImage = ref('')

const avatarDisplay = computed(() => {
  return previewImage.value || MasterSite.avatar_default
})

const handleChangeImage = ($event: any) => {
  if ($event.target.files[0]) {
    const image = $event.target.files[0]

    if (!image.type.includes('image/')) {
      message.value = t('components.upload_avatar.invalid_type')
      return
    }
    if (image.size > 1024 * 1024 * 10) {
      message.value = t('components.upload_avatar.max_size')
      return
    }
    message.value = ''
    emit('update:modelValue', image)
  }
}

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      if (typeof props.modelValue === 'string') {
        previewImage.value = props.modelValue
      } else {
        previewImage.value = URL.createObjectURL(props.modelValue)
      }
    }
  }
)

onMounted(() => {
  if (props.modelValue) {
    if (typeof props.modelValue === 'string') {
      previewImage.value = props.modelValue
    } else {
      previewImage.value = URL.createObjectURL(props.modelValue)
    }
  }
})
</script>

<template>
  <div class="flex flex-col <tablet:items-center">
    <div
      class="upload-avatar cursor-pointer relative"
      :class="{
        'pointer-events-none touch-none': isDisabled,
      }"
    >
      <div
        class="upload-avatar__image w-full h-full rounded-full overflow-hidden"
        @click="handleUpdateValue()"
      >
        <img
          alt="画像"
          :src="avatarDisplay"
          class="w-full h-full object-contain"
        />
      </div>
      <div
        class="upload-avatar__icon absolute bottom-0 right-0"
        @click="handleClickIcon"
      >
        <img
          v-if="!previewImage"
          class="w-36px h-36px"
          :src="MasterSite.icon_edit"
          alt=""
        />
        <img
          v-else
          class="w-36px h-36px"
          :src="MasterSite.icon_delete_item"
          alt=""
        />
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleChangeImage($event)"
      />
    </div>
    <div v-if="message" class="error-text">
      {{ message }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.upload-avatar {
  width: 128px;
  height: 128px;

  &__image {
    background: $color_gray1;
  }
}

.error-text {
  line-height: 14px;
  color: $color_red1;
  font-size: 14px;
  margin-top: 8px;
}

.hidden {
  display: none !important;
}
</style>
