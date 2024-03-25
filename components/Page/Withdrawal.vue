<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'
import { MailOutlined } from '@ant-design/icons-vue'
import { MasterSite, REGEX_PASSWORD } from '@/constants/common'
import { INotification } from '@/interfaces/common'
import { useUser } from '@/stores/user'
import { CookieKeyEnum } from '@/constants/cookie'
import { PlanEnum } from '@/constants/plan'
import { useVideo } from '@/stores/video'
import { useChannel } from '@/stores/channel'

const { t } = useLang()

const { $api } = useNuxtApp()

const { showNotification, isPlanFree, childAccountNumber } = useHelper()

const userStore = useUser()

const videoStore = useVideo()

const channelStore = useChannel()

const open = ref<boolean>(false)

const openChangePlanToFree = ref<boolean>(false)

const loadingCancelAccount = ref<boolean>(false)

const loadingChangePlanToFree = ref<boolean>(false)

const formState = reactive({
  password: '',
})

const rules: Record<string, Rule[]> = {
  password: [
    {
      pattern: REGEX_PASSWORD,
      message: t('pages.signup.validate.password_regex'),
    },
    {
      required: true,
      message: t('common.filed_no_required', {
        field: t('pages.signup.password_placeholder'),
      }),
    },
  ],
}

const hideModalCancelAccount = () => {
  open.value = false
}

const handleModalCancelAccount = () => {
  open.value = true
}

const cancelAccount = () => {
  loadingCancelAccount.value = true
  formRef.value
    .validate()
    .then(() => {
      $api.user
        .confirmPassword(formState)
        .then((e: any) => {
          $api.user
            .cancelAccount(1)
            .then(async (e: any) => {
              open.value = false
              loadingCancelAccount.value = false

              const params = {
                message: t('pages.withdrawal.modal_withdrawal.title'),
                description: t('pages.withdrawal.msg_success'),
                btn: t('common.close'),
              }

              const confirm = await showNotification(params as INotification)

              if (confirm || !confirm) await userStore.logout()
            })
            .catch((e: any) => {
              const params = {
                description: t('common.serve_error'),
                duration: 4.5,
                icon: true,
                status: false,
              }

              showNotification(params as INotification)
              open.value = false
              loadingCancelAccount.value = false
            })
        })
        .catch((e: any) => {
          const params = {
            description: e?._data?.message,
            duration: 4.5,
            icon: true,
            status: false,
          }

          showNotification(params as INotification)
          open.value = false
          loadingCancelAccount.value = false
        })
    })
    .catch(() => {
      loadingCancelAccount.value = false
    })
}

const hideModalChangePlanToFree = () => {
  openChangePlanToFree.value = false
}

const handleModalChangePlanToFree = () => {
  openChangePlanToFree.value = true
}

const formRef = ref()

const handleChangePlanToFree = () => {
  loadingChangePlanToFree.value = true
  formRef.value
    .validate()
    .then(() => {
      $api.user
        .confirmPassword(formState)
        .then((e: any) => {
          $api.user
            .cancelAccount(0)
            .then(async (e: any) => {
              const userData = localStorage.getItem(CookieKeyEnum.USER_DATA)

              if (userData) {
                const data = JSON.parse(userData)

                data.plan.name = PlanEnum.FREE
                data.plan.plan_type = PlanEnum.FREE
                data.child_account_number = 0

                localStorage.setItem(
                  CookieKeyEnum.USER_DATA,
                  JSON.stringify(data)
                )

                userStore.setUser(data)
              }

              const params = {
                description: e?.message,
                duration: 4.5,
                icon: true,
                status: true,
              }

              showNotification(params as INotification)
              loadingChangePlanToFree.value = false
              openChangePlanToFree.value = false

              await videoStore.$reset()
              await channelStore.$reset()
            })
            .catch((e: any) => {
              const params = {
                description: t('common.serve_error'),
                duration: 4.5,
                icon: true,
                status: false,
              }

              showNotification(params as INotification)
              open.value = false
              loadingCancelAccount.value = false
            })
          loadingChangePlanToFree.value = false
          openChangePlanToFree.value = false
        })
        .catch((e: any) => {
          const params = {
            description: e?._data?.message,
            duration: 4.5,
            icon: true,
            status: false,
          }

          showNotification(params as INotification)
          loadingChangePlanToFree.value = false
          openChangePlanToFree.value = false
        })
    })
    .catch(() => {
      loadingChangePlanToFree.value = false
    })
}

watch(
  () => openChangePlanToFree.value,
  () => {
    if (!openChangePlanToFree.value) {
      formState.password = ''
      formRef.value.resetFields()
    }
  },
  { flush: 'post' }
)

watch(
  () => open.value,
  () => {
    if (!open.value) {
      formState.password = ''
      formRef.value.resetFields()
    }
  },
  { flush: 'post' }
)
</script>

<template>
  <div class="withdrawal pb-74px">
    <p class="text-16px pt-9px">{{ $t('pages.withdrawal.title') }}</p>

    <p class="text-14px mt-15px mb-8px">
      {{ $t('pages.withdrawal.sub_title_1') }}
    </p>
    <div class="withdrawal__list">
      <div class="withdrawal__row">
        <div class="withdrawal__column">{{ $t('pages.withdrawal.name') }}</div>
        <div class="withdrawal__column">
          {{ userStore.userData?.last_name }}
          {{ userStore.userData?.first_name }}
        </div>
      </div>
      <div class="withdrawal__row">
        <div class="withdrawal__column">{{ $t('pages.withdrawal.email') }}</div>
        <div class="withdrawal__column">{{ userStore.userData?.email }}</div>
      </div>
      <div class="withdrawal__row">
        <div class="withdrawal__column">
          {{ $t('pages.withdrawal.child_count') }}
        </div>
        <div class="withdrawal__column">
          {{ childAccountNumber }}
        </div>
      </div>
    </div>
    <p class="text-14px">{{ $t('pages.withdrawal.sub_title_2') }}</p>

    <div class="withdrawal__note w-650px <tablet:w-full">
      <div class="withdrawal__note-icon">
        <img :src="MasterSite.icon_note_withdrawal" alt="" />
        <span>{{ $t('pages.withdrawal.title_note') }}</span>
      </div>
      <div class="withdrawal__note-item">
        {{ $t('pages.withdrawal.note_1') }}
      </div>
      <div class="withdrawal__note-item">
        {{ $t('pages.withdrawal.note_2') }}
      </div>
      <div class="withdrawal__note-item">
        {{ $t('pages.withdrawal.note_3') }}
      </div>
    </div>

    <Button
      :size="`large`"
      :label="$t('pages.withdrawal.button_withdrawal')"
      :icon="MailOutlined"
      class="w-400px <tablet:w-full"
      @click="handleModalCancelAccount"
    ></Button>

    <div v-if="!isPlanFree" class="c-link" @click="handleModalChangePlanToFree">
      {{ $t('pages.withdrawal.button_change_plan_to_free') }}
    </div>

    <a-modal v-model:open="open" class="modal">
      <template #title>
        <div class="flex items-center">
          <img :src="MasterSite.icon_note_modal" alt="" />
          <span class="modal-title ml-4px">
            {{ $t('pages.withdrawal.modal_withdrawal.title') }}
          </span>
        </div>
      </template>
      <div class="modal-body">
        <span class="mb-24px block">
          {{ $t('pages.withdrawal.modal_withdrawal.body') }}
        </span>
        <a-form ref="formRef" :model="formState" :rules="rules">
          <FormTextInput
            v-model="formState.password"
            :name="'password'"
            :placeholder="
              $t('pages.withdrawal.modal_change_plan_to_free.password')
            "
            :label="$t('pages.withdrawal.modal_change_plan_to_free.password')"
            :type-input="'password'"
          ></FormTextInput>
        </a-form>
      </div>
      <template #footer>
        <div class="flex justify-center">
          <a-button @click="hideModalCancelAccount">{{
            $t('pages.withdrawal.modal_withdrawal.button_close')
          }}</a-button>
          <a-button
            type="primary"
            :loading="loadingCancelAccount"
            @click="cancelAccount"
          >
            {{ $t('pages.withdrawal.modal_withdrawal.button_submit') }}
          </a-button>
        </div>
      </template>
    </a-modal>

    <a-modal v-model:open="openChangePlanToFree" class="modal">
      <template #title>
        <div class="flex items-center">
          <img :src="MasterSite.icon_note_modal" alt="" />
          <span class="modal-title ml-4px">
            {{ $t('pages.withdrawal.modal_change_plan_to_free.title') }}
          </span>
        </div>
      </template>
      <div class="modal-body">
        <span class="mb-24px block">
          {{ $t('pages.withdrawal.modal_change_plan_to_free.body') }}
        </span>
        <a-form ref="formRef" :model="formState" :rules="rules">
          <FormTextInput
            v-model="formState.password"
            :name="'password'"
            :placeholder="
              $t('pages.withdrawal.modal_change_plan_to_free.password')
            "
            :label="$t('pages.withdrawal.modal_change_plan_to_free.password')"
            :type-input="'password'"
          ></FormTextInput>
        </a-form>
      </div>
      <template #footer>
        <div class="flex justify-center">
          <a-button @click="hideModalChangePlanToFree">{{
            $t('pages.withdrawal.modal_change_plan_to_free.button_close')
          }}</a-button>
          <a-button
            type="primary"
            :loading="loadingChangePlanToFree"
            @click="handleChangePlanToFree"
          >
            {{ $t('pages.withdrawal.modal_change_plan_to_free.button_submit') }}
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
.withdrawal {
  &__list {
    position: relative;
    padding-left: 12px;

    &::before {
      content: '';
      width: 4px;
      height: 100%;
      background-color: $color_black2;
      left: 0;
      top: 0;
      position: absolute;
      display: block;
    }
  }

  &__row {
    display: flex;
    margin-bottom: 8px;
  }

  &__column {
    font-size: 16px;
    line-height: 24px;
    min-width: 112px;
    margin-right: 20px;
  }

  &__note {
    padding: 16px 24px;
    border: 1px solid $color_gray1;
    background: $color_gray6;
    margin-top: 48px;
    margin-bottom: 48px;

    &-item {
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: unset;
      }
    }

    &-icon {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      span {
        margin-left: 7px;
        color: $color_orange;
        font-size: 16px;
        line-height: 24px;
      }
    }
  }
}

.c-link {
  display: inline;
  border-bottom: 1px solid $color_blue;
}

:deep(.ant-modal-footer) {
  text-align: center;
}

:deep(.ant-btn) {
  border-radius: 2px;
}

.modal {
  &-title {
    font-size: 16px;
    font-weight: 400;
  }

  &-body {
    font-size: 16px;
  }
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 2px;
}
</style>
