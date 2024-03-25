<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import { REGEX_PASSWORD, TitleLoading } from '@/constants/common'
import { INotification } from '@/interfaces/common'

const { t } = useLang()

const { showNotification, setLoading } = useHelper()

const { $api } = useNuxtApp()

const formState = reactive({
  old_password: '',
  password: '',
  password_confirmation: '',
})

const formRef = ref()

const validatePass = (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject(
      t('common.filed_no_required', {
        field: t('pages.signup.password_placeholder'),
      })
    )
  } else {
    if (formState.password_confirmation !== '') {
      formRef.value?.validateFields('password_confirmation')
    }

    return Promise.resolve()
  }
}

const validatePass2 = (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject(
      t('common.filed_no_required', {
        field: t('pages.signup.password_confirmation'),
      })
    )
  } else if (value !== formState.password) {
    return Promise.reject(
      t('pages.change_password.validate.password_confirmation')
    )
  } else {
    return Promise.resolve()
  }
}

const rules: Record<string, Rule[]> = {
  old_password: [
    {
      required: true,
      message: t('common.filed_no_required', {
        field: t('pages.change_password.current_password'),
      }),
    },
    {
      pattern: REGEX_PASSWORD,
      message: t('pages.signup.validate.password_regex'),
    },
  ],
  password: [
    {
      pattern: REGEX_PASSWORD,
      message: t('pages.signup.validate.password_regex'),
    },
    {
      validator: validatePass,
    },
  ],
  password_confirmation: [
    {
      validator: validatePass2,
    },
  ],
}

const onFinish = () => {
  formRef.value
    .validate()
    .then(async () => {
      await setLoading(true, TitleLoading.LoadingRegistration)

      $api.user
        .changePassword(formState)
        .then(async (e: any) => {
          formRef.value.resetFields()

          const params = {
            description: t('pages.change_password.message_success'),
            duration: 4.5,
            icon: true,
            status: true,
          }

          showNotification(params as INotification)

          await setLoading(false)
        })
        .catch(async (e: any) => {
          const params = {
            description: e?._data?.old_password[0]
              ? e?._data?.old_password[0]
              : t('common.serve_error'),
            duration: 4.5,
            icon: true,
            status: false,
          }

          showNotification(params as INotification)

          await setLoading(false)
        })
    })
    .catch(() => {})
}
</script>

<template>
  <a-form ref="formRef" :model="formState" :rules="rules">
    <FormTextInput
      v-model="formState.old_password"
      :placeholder="$t('pages.change_password.current_password_placeholder')"
      :label="$t('pages.change_password.current_password')"
      :type-input="'password'"
      :name="'old_password'"
      :is-required="true"
      :is-show-required="true"
      class="w-400px <laptop:w-full"
    ></FormTextInput>

    <FormTextInput
      v-model="formState.password"
      :placeholder="$t('pages.signup.password_placeholder')"
      :label="$t('pages.change_password.password')"
      :type-input="'password'"
      :name="'password'"
      :is-required="true"
      :is-show-required="true"
      class="w-400px <laptop:w-full"
    ></FormTextInput>

    <FormTextInput
      v-model="formState.password_confirmation"
      :placeholder="$t('pages.signup.password_confirmation_placeholder')"
      :label="$t('pages.change_password.password_confirmation')"
      :type-input="'password'"
      :name="'password_confirmation'"
      :is-required="true"
      :is-show-required="true"
      class="w-400px <laptop:w-full"
    ></FormTextInput>

    <Button
      class="w-250px mb-224px <laptop:w-full"
      :label="$t('pages.user_setting.submit')"
      @click="onFinish"
    ></Button>
  </a-form>
</template>

<style lang="scss" scoped>
.suggestions {
  &__note {
    font-size: 16px;
    line-height: 180%;
  }
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 2px;
}
</style>
