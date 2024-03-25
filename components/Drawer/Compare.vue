<script setup lang="ts">
import { MasterSite } from '@/constants/common'
import { useCompare } from '@/stores/compare'

const props = defineProps({
  modelValue: {
    type: [Boolean],
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'on-enter'])

const modelValue = useSyncProps<Boolean>(props, 'modelValue', emit)

const router = useRouter()

const compareStore = useCompare()

const removeItem = (id: string) => {
  compareStore.removeItem(id)
}

const toPageCompare = () => {
  router.push(`/compare`)
}

const confirm = (e: MouseEvent) => {
  compareStore.removeAllItem()
}

const cancel = (e: MouseEvent) => {
  console.log(e)
}

const getContainer = () => {
  return document.getElementById('popconfirm')
}
</script>

<template>
  <div class="compare" :class="{ open: modelValue }">
    <div class="flex items-center justify-between h-150px">
      <div class="compare__left mr-30px overflow-x-auto">
        <div class="compare__list flex">
          <div
            v-for="(item, index) in compareStore.listVideoCompare"
            :key="index"
            class="compare__item"
          >
            <div class="relative">
              <img
                class="w-110px h-62px"
                :src="item?.thumbnail?.high ? item?.thumbnail?.high : ''"
                alt=""
              />
              <div
                class="compare__delete"
                @click="removeItem(item.id as string)"
              >
                <img
                  class="w-16px h-16px"
                  :src="MasterSite.icon_delete_item"
                  alt=""
                />
              </div>
            </div>

            <p class="compare__title mt-5px text-16px">{{ item.title }}</p>
          </div>
        </div>
      </div>
      <div class="compare__right">
        <div class="compare__right-count text-16px mb-4px">
          {{ $t('components.drawer_compare.total') }}
          {{ compareStore.listVideoCompare.length
          }}{{ $t('components.drawer_compare.book') }}
        </div>
        <Button
          :label="$t('components.drawer_compare.button')"
          class="w-113px"
          @click="toPageCompare()"
        ></Button>
        <a-popconfirm
          :placement="'leftBottom'"
          :ok-text="$t('common.yes')"
          :cancel-text="$t('common.no')"
          :get-popup-container="getContainer"
          @confirm="confirm"
          @cancel="cancel"
        >
          <template #title>
            <p>{{ $t('pages.compare.popconfirm.title') }}</p>
            <p>{{ $t('pages.compare.popconfirm.text') }}</p>
          </template>
          <a class="c-link" href="#">{{
            $t('components.drawer_compare.empty')
          }}</a>
        </a-popconfirm>
      </div>
    </div>
    <div id="popconfirm"></div>
  </div>
</template>

<style lang="scss" scoped>
.compare {
  width: 100%;
  height: 150px;
  background-color: $color_white;
  position: fixed;
  bottom: 0;
  left: 0;
  margin: 0 0 -150px 0;
  transition: all 400ms;
  transition-delay: 300ms;
  z-index: 2000;

  &.open {
    margin: 0;
  }

  ::-webkit-scrollbar {
    display: block;
    height: 8px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #c8c8c8;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #898989;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &__left {
    margin: 24px 30px 10px 56px;

    @include mq-down(sp) {
      margin: 24px 30px 10px 30px;
    }
  }

  &__right {
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 56px;
    position: relative;

    @include mq-down(sp) {
      padding: 0 20px;
    }

    &::before {
      content: '';
      display: block;
      width: 1px;
      background-color: $color_gray1;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }

    &-count {
      line-height: 28.8px;
    }
  }

  &__list {
    padding: 8px 0 8px 8px;
  }

  &__item {
    width: 120px;
    min-width: 120px;
    margin-right: 24px;

    &:last-child {
      margin-right: unset;
    }
  }

  &__title {
    line-height: 24px;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  &__delete {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    cursor: pointer;
    z-index: 9999;
  }
}

:deep(.ant-form-item) {
  margin-bottom: 9px;
}
</style>
