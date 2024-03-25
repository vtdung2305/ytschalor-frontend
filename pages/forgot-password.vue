<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import { useChallengeV2 } from 'vue-recaptcha'
import { useI18n } from 'vue-i18n'
import { MailOutlined } from '@ant-design/icons-vue'
import { MasterSite, TitleLoading } from '@/constants/common'
import { IFormForgotPassword } from '@/interfaces/login'
import { INotification } from '@/interfaces/common'

definePageMeta({ layout: 'empty' })

const { showNotification, setLoading } = useHelper()

const { t } = useI18n()

const { $api } = useNuxtApp()

const router = useRouter()

const i18nLocale = useI18n()

const isLoading = ref<boolean>(false)

const isDisabled = ref<boolean>(true)

const formForgotPassword = ref()

const messageError = ref<string>('')

const success = ref<boolean>(false)

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

const formStateForgotPassword = reactive<IFormForgotPassword>({
  email: '',
})

const config = useRuntimeConfig()

const getImageUrlLogo = computed(() => {
  return MasterSite.logo_src
})

const onForgotPassword = () => {
  formForgotPassword.value
    .validate()
    .then(() => {
      isDisabled.value = false
    })
    .catch(async () => {})
}

const onFinish = () => {
  router.push('/login')
}

const checkEmail = () => {
  if (messageError.value) {
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
      validator: checkEmail,
    },
  ],
}

watch(state, async (newVal) => {
  if (newVal === 'verified') {
    await setLoading(true, TitleLoading.LoadingRegistration)
    $api.auth
      .forgotPassword(formStateForgotPassword)
      .then(async () => {
        success.value = true
        isLoading.value = true
        await setLoading(false)
      })
      .catch(async (e: any) => {
        success.value = false
        isLoading.value = true
        await setLoading(false)
        if (e?._data?.email) {
          messageError.value = e?._data?.email[0]
          formForgotPassword.value.validateFields()
        } else {
          const params = {
            description: t('common.serve_error'),
            duration: 4.5,
            icon: true,
            status: false,
          }

          showNotification(params as INotification)
        }
      })
  }
})

watch(
  () => formStateForgotPassword.email,
  () => {
    state.value = 'init'
    isDisabled.value = true
    messageError.value = ''
    formForgotPassword.value.validateFields(['email'])
  },
  { flush: 'post' }
)

onMounted(() => {})
</script>

<template>
  <div class="h-screen">
    <div class="w-full h-full login-page flex justify-center items-center">
      <div
        v-if="!success"
        class="login-form flex flex-col items-center w-full <tablet:px-15px"
      >
        <NuxtLink :to="config.public.homeUrl" target="_blank">
          <img
            class="logo mb-12px cursor-pointer"
            :src="getImageUrlLogo"
            width="240"
          />
        </NuxtLink>
        <p class="login-form__title mb-12px text-18px leading-22px">
          {{ $t('pages.forgot-password.title') }}
        </p>
        <p class="login-form__subTitle mb-32px text-14px leading-22px">
          {{ $t('pages.forgot-password.subtitle1') }}<br />
          {{ $t('pages.forgot-password.subtitle2') }}
        </p>

        <div class="w-full tablet:w-400px">
          <a-form
            ref="formForgotPassword"
            :model="formStateForgotPassword"
            :rules="rules"
          >
            <FormTextInput
              v-model="formStateForgotPassword.email"
              :placeholder="$t('pages.login.email')"
              :label="$t('pages.login.email')"
              :name="'email'"
              :is-required="true"
            ></FormTextInput>

            <div v-if="!isDisabled" class="recaptcha flex justify-center">
              <div ref="root" />
            </div>

            <div class="mt-60px">
              <Button
                :size="`large`"
                :label="$t('pages.forgot-password.submit')"
                :icon="MailOutlined"
                @click="onForgotPassword"
              ></Button>
            </div>
          </a-form>
        </div>
      </div>
      <template v-else>
        <div
          class="login-form flex flex-col items-center w-full <tablet:px-15px"
        >
          <NuxtLink :to="config.public.homeUrl" target="_blank">
            <img
              class="logo mb-12px cursor-pointer"
              :src="getImageUrlLogo"
              width="240"
            />
          </NuxtLink>
          <p class="login-form__title mb-30px text-18px leading-22px">
            {{ $t('pages.forgot-password.title_success') }}
          </p>
          <p
            class="login-form__complete mb-20px mt-17px text-16px leading-22px"
          >
            {{ $t('pages.forgot-password.sub_title_success1') }}<br />
            {{ $t('pages.forgot-password.sub_title_success2') }}<br />
            {{ $t('pages.forgot-password.sub_title_success3') }}
          </p>
          <div class="mt-75px flex justify-center w-full">
            <Button
              class="w-400px <mobile:w-full"
              :size="`large`"
              :label="$t('pages.forgot-password.button_success')"
              @click="onFinish"
            ></Button>
          </div>
        </div>
      </template>
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
