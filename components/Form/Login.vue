<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import { useChallengeV2 } from 'vue-recaptcha'
import { useI18n } from 'vue-i18n'
import { MasterSite, REGEX_PASSWORD } from '@/constants/common'
import { IFormLogin } from '@/interfaces/login'
import { useUser } from '@/stores/user'
import { IUserLoginData } from '@/interfaces/user'
import { INotification } from '@/interfaces/common'

const { setLoading, showNotification } = useHelper()

const { t } = useI18n()

const i18nLocale = useI18n()

const router = useRouter()

const userStore = useUser()

const isLoading = ref<boolean>(false)

const isDisabled = ref<boolean>(false)

const formLogin = ref()

const isRecaptcha = ref<number>(0)

const incorrectEmail = ref<number>(0)

const incorrectPassword = ref<number>(0)

const messageError = ref<string>('')

const route = useRoute()

const { root, state, onVerify, execute, reset } = useChallengeV2({
  options: {
    size: 'normal',
    hl: i18nLocale.locale.value,
  },
})

onVerify((response) => {
  // do something with response
  console.log(response)
})

const formStateLogin = reactive<IFormLogin>({
  email: '',
  password: '',
  role: route.name === 'admin-login' ? 1 : 2,
})

const config = useRuntimeConfig()

const getImageUrlLogo = computed(() => {
  return MasterSite.logo_src
})

const onLogin = () => {
  formLogin.value
    .validate()
    .then(async () => {
      await setLoading(true)
      // isLoading.value = true
      await userStore
        .login(formStateLogin as IUserLoginData)
        .then(async () => {
          userStore.isAuthenticated && router.replace(`/`)
          isLoading.value = false
          isRecaptcha.value = 0
          isDisabled.value = false
          await setLoading(false)
        })
        .catch(async (error) => {
          // isLoading.value = false
          // console.log('error', error)
          if (error.status === 400) {
            if (error?._data?.email) {
              // wrong email
              isRecaptcha.value++
              incorrectEmail.value++
              messageError.value = error?._data?.email[0]
              if (isRecaptcha.value > 1) {
                reset()
                isDisabled.value = true
              }
            } else if (error?._data?.password) {
              // wrong password
              incorrectPassword.value++
              messageError.value = error?._data?.password[0]
            } else if (error?._data?.message) {
              const params = {
                description: error?._data?.message[0],
                status: false,
                icon: true,
              }

              if (error?._data?.is_active) {
                formLogin.value.resetFields()
              }

              showNotification(params as INotification)
            } else {
              console.log(error)
            }
          } else {
            const params = {
              description: error?._data?.message,
              status: false,
              icon: true,
            }

            showNotification(params as INotification)
          }
          await setLoading(false)
        })
    })
    .catch(async (error: any) => {
      console.log('error', error)
      await setLoading(false)
    })
}

const validateEmail = (_rule: Rule, value: string) => {
  if (incorrectEmail.value > 0) {
    return Promise.reject(messageError.value)
  }

  return Promise.resolve()
}

const validatePassword = (_rule: Rule, value: string) => {
  if (incorrectPassword.value > 0) {
    return Promise.reject(messageError.value)
  }

  return Promise.resolve()
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
    {
      validator: validateEmail,
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      message: t('common.filed_no_required', {
        field: t('pages.login.password'),
      }),
      trigger: 'change',
    },
    {
      pattern: REGEX_PASSWORD,
      message: t('pages.signup.validate.password_regex'),
      trigger: 'change',
    },
    {
      validator: validatePassword,
      trigger: 'change',
    },
  ],
}

watch(
  [incorrectEmail, incorrectPassword, state],
  ([newEmail, newPassword, newState]) => {
    if (newEmail > 0) {
      formLogin.value.validateFields('email')
    }

    if (newPassword > 0) {
      formLogin.value.validateFields('password')
    }

    if (newState === 'verified') {
      isDisabled.value = false
    }
  }
)
</script>

<template>
  <div class="login-form flex flex-col items-center w-full <tablet:px-15px">
    <NuxtLink :to="config.public.homeUrl" target="_blank">
      <img
        class="logo mb-12px cursor-pointer"
        :src="getImageUrlLogo"
        width="240"
      />
    </NuxtLink>
    <p class="login-form__title mb-12px text-18px leading-22px">
      {{ $t('pages.login.title') }}
    </p>
    <p class="login-form__subTitle mb-32px text-14px leading-22px">
      {{ $t('pages.login.subtitle') }}
    </p>

    <div class="w-full tablet:w-400px">
      <a-form ref="formLogin" :model="formStateLogin" :rules="rules">
        <FormTextInput
          v-model="formStateLogin.email"
          :placeholder="$t('pages.login.email')"
          :label="$t('pages.login.email')"
          :name="'email'"
          :is-required="true"
          @change="() => (incorrectEmail ? incorrectEmail-- : '')"
        ></FormTextInput>

        <FormTextInput
          v-model="formStateLogin.password"
          :placeholder="$t('pages.login.password')"
          :type-input="'password'"
          :label="$t('pages.login.password')"
          :name="'password'"
          :is-required="true"
          @change="() => (incorrectPassword ? incorrectPassword-- : '')"
        ></FormTextInput>

        <div v-if="isRecaptcha > 1" class="recaptcha flex justify-center">
          <div ref="root" />
        </div>

        <div class="mt-60px">
          <Button
            :is-loading="isLoading"
            :size="`large`"
            :label="$t('components.button.btn_login')"
            :disabled="isDisabled"
            @click="onLogin"
          ></Button>
        </div>
        <div class="text-center -mt-10px">
          <nuxt-link to="/forgot-password" class="login-form__forgotpass">{{
            $t('pages.login.forgot_password')
          }}</nuxt-link>
        </div>
      </a-form>
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
</style>
