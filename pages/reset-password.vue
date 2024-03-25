<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import { useI18n } from 'vue-i18n'
import { MasterSite, REGEX_PASSWORD, TitleLoading } from '@/constants/common'
import { IFormResetPassword } from '@/interfaces/login'
import { INotification } from '@/interfaces/common'

definePageMeta({ layout: 'empty' })

const { showNotification, setLoading } = useHelper()

const { t } = useI18n()

const { $api } = useNuxtApp()

const router = useRouter()

const route = useRoute()

const isLoading = ref<boolean>(false)

const formResetPassword = ref()

const formStateResetPassword = reactive<IFormResetPassword>({
  email: '',
  password: '',
  password_confirmation: '',
})

const config = useRuntimeConfig()

const getImageUrlLogo = computed(() => {
  return MasterSite.logo_src
})

const onResetPassword = () => {
  const { token } = route.query

  const params = {
    password: formStateResetPassword.password,
    password_confirmation: formStateResetPassword.password_confirmation,
  }

  formResetPassword.value
    .validate()
    .then(async () => {
      await setLoading(true, TitleLoading.LoadingRegistration)
      $api.auth
        .resetPassword(token, params)
        .then(async (res: any) => {
          isLoading.value = true
          await setLoading(false)

          const params = {
            description: res?.message,
            duration: 4.5,
            icon: true,
            status: true,
          }

          showNotification(params as INotification)
          if (res?.includes?.role_admin) {
            router.push('/admin/login')
          } else {
            router.push('/login')
          }
        })
        .catch(async (e: any) => {
          isLoading.value = true
          await setLoading(false)

          const params = {
            description: t('common.serve_error'),
            duration: 4.5,
            icon: true,
            status: false,
          }

          showNotification(params as INotification)
        })
    })
    .catch(async () => {})
}

const validatePass = (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject(
      t('common.filed_no_required', {
        field: t('pages.signup.password_placeholder'),
      })
    )
  } else {
    if (formStateResetPassword.password_confirmation !== '') {
      formResetPassword.value?.validateFields('password_confirmation')
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
  } else if (value !== formStateResetPassword.password) {
    return Promise.reject(t('pages.signup.validate.password_confirmation'))
  } else {
    return Promise.resolve()
  }
}

const rules: Record<string, Rule[]> = {
  email: [
    {
      required: true,
      message: t('common.filed_no_required', {
        field: t('pages.login.email'),
      }),
      trigger: 'change',
    },
    {
      type: 'email',
      message: t('pages.login.msg_email_invalid'),
      trigger: 'change',
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

onMounted(async () => {
  const { token } = route.query

  if (token) {
    await setLoading(true)
    $api.auth
      .checkExpiration(token as string)
      .then(async (res: any) => {
        formStateResetPassword.email = res?.includes?.email
        isLoading.value = true
        await setLoading(false)
      })
      .catch(async (e: any) => {
        if (e.status === 400) {
          const params = {
            description: e?._data?.message,
            duration: 4.5,
            icon: true,
            status: false,
          }

          showNotification(params as INotification)
        }

        isLoading.value = true
        await setLoading(false)
      })
  }
})
</script>

<template>
  <div class="h-screen">
    <div class="w-full h-full login-page flex justify-center items-center">
      <div class="login-form flex flex-col items-center w-full <tablet:px-15px">
        <NuxtLink :to="config.public.homeUrl" target="_blank">
          <img
            class="logo mb-12px cursor-pointer"
            :src="getImageUrlLogo"
            width="240"
          />
        </NuxtLink>
        <p class="login-form__title mb-12px text-18px leading-22px">
          {{ $t('pages.reset-password.title') }}
        </p>
        <p class="login-form__subTitle mb-32px text-14px leading-22px">
          {{ $t('pages.reset-password.sub_title') }}
        </p>

        <div class="w-full tablet:w-400px">
          <a-form
            ref="formResetPassword"
            :model="formStateResetPassword"
            :rules="rules"
          >
            <FormTextInput
              v-model="formStateResetPassword.email"
              :placeholder="$t('pages.login.email')"
              :label="$t('pages.login.email')"
              :name="'email'"
              :is-required="true"
              :is-disabled="true"
            ></FormTextInput>

            <FormTextInput
              v-model="formStateResetPassword.password"
              :placeholder="$t('pages.signup.password_placeholder')"
              :label="$t('pages.reset-password.password')"
              :type-input="'password'"
              :name="'password'"
            ></FormTextInput>

            <FormTextInput
              v-model="formStateResetPassword.password_confirmation"
              class="login-form_custom"
              :placeholder="
                $t('pages.signup.password_confirmation_placeholder')
              "
              :label="$t('pages.signup.password_confirmation')"
              :type-input="'password'"
              :name="'password_confirmation'"
            ></FormTextInput>

            <div class="mt-60px">
              <Button
                :size="`large`"
                :label="$t('pages.reset-password.button')"
                :disabled="
                  !formStateResetPassword.password ||
                  !formStateResetPassword.password_confirmation
                "
                @click="onResetPassword"
              ></Button>
            </div>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-form {
  &__title {
    color: $color_black2;
  }

  &__subTitle {
    color: rgba($color: $color_black1, $alpha: 0.45);
  }

  &__forgotpass {
    margin-top: -10px;
    color: $color_blue;
    padding-bottom: 4px;
    border-bottom: 1px solid $color_blue;
  }
}

.grecaptcha-badge {
  visibility: hidden;
}

:deep(.ant-btn > span) {
  display: inline-flex;
}
</style>
