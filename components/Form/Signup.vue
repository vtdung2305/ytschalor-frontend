<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import { Form } from 'ant-design-vue'
import { IUserSignUp } from '@/interfaces/user'
import { MasterSite, REGEX_PASSWORD } from '@/constants/common'
import { INotification } from '@/interfaces/common'

const config = useRuntimeConfig()

const { setLoading, showNotification } = useHelper()

const { t } = useLang()

const { $api } = useNuxtApp()

const formRef = ref()

const formState = reactive<IUserSignUp>({
  last_name: '',
  first_name: '',
  company: '',
  phone_number: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const checked = ref<boolean>(false)

const errorEmail = ref<boolean>(false)

const current = ref<number>(0)

const getImageUrlLogo = computed(() => {
  return MasterSite.logo_src
})

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
    return Promise.reject(t('pages.signup.validate.password_confirmation'))
  } else {
    return Promise.resolve()
  }
}

const checkEmail = () => {
  if (errorEmail.value) {
    return Promise.reject(t('pages.signup.validate.email_require'))
  }

  return Promise.resolve()
}

const rules: Record<string, Rule[]> = {
  last_name: [
    {
      required: true,
      message: t('common.filed_no_required', {
        field: t('pages.signup.last_name'),
      }),
    },
  ],
  first_name: [
    {
      required: true,
      message: t('common.filed_no_required', {
        field: t('pages.signup.first_name'),
      }),
    },
  ],
  email: [
    {
      required: true,
      message: t('common.filed_no_required', {
        field: t('pages.signup.email'),
      }),
    },
    {
      type: 'email',
      message: t('pages.signup.validate.email'),
    },
    {
      validator: checkEmail,
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
  const params = {
    last_name: formState.last_name.trim(),
    first_name: formState.first_name.trim(),
    company: formState.company.trim(),
    phone_number: formState.phone_number.trim(),
    email: formState.email.trim(),
    password: formState.password.trim(),
    password_confirmation: formState.password_confirmation.trim(),
  }

  formRef.value
    .validate()
    .then(async () => {
      if (current.value === 0) {
        checked.value = true
        current.value++
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        })
      } else {
        await setLoading(true)
        $api.auth
          .signup(params)
          .then(async () => {
            current.value++
            formRef.value.resetFields()
            await setLoading(false)
          })
          .catch(async (e: any) => {
            current.value--
            if (e?._data?.email) {
              errorEmail.value = true
              formRef.value.validateFields()
            } else {
              const params = {
                description: t('common.serve_error'),
                duration: 4.5,
                icon: true,
                status: false,
              }

              showNotification(params as INotification)
            }
            await setLoading(false)
          })
      }
    })
    .catch(() => {
      setTimeout(() => {
        document
          .getElementsByClassName('ant-form-item-explain-error')[0]
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
      }, 100)
    })
}

const onClickBack = (values: any) => {
  checked.value = true
  current.value--
}

watch(
  () => formState.email,
  () => {
    if (current.value !== 2) {
      errorEmail.value = false
      formRef.value.validateFields(['email'])
    }
  },
  { flush: 'post' }
)
</script>

<template>
  <div
    class="login-form flex flex-col items-center mt-60px mb-235px <tablet:px-15px"
  >
    <NuxtLink :to="config.public.homeUrl" target="_blank">
      <img
        class="logo mb-12px cursor-pointer"
        :src="getImageUrlLogo"
        width="240"
      />
    </NuxtLink>
    <p class="login-form__title mb-12px text-18px leading-22px">
      {{ $t('pages.signup.title') }}
    </p>
    <p class="login-form__subTitle text-center text-14px leading-22px">
      {{ $t('pages.signup.subtitle1') }} <br />
      {{ $t('pages.signup.subtitle2') }}
    </p>

    <div class="w-full mt-45px mb-45px tablet:w-400px">
      <a-steps
        :current="current"
        :items="[
          {
            title: $t('pages.signup.step1'),
          },
          {
            title: $t('pages.signup.step2'),
          },
          {
            title: $t('pages.signup.step3'),
          },
        ]"
      ></a-steps>
    </div>

    <div v-if="current < 2" class="w-full tablet:w-400px">
      <a-form
        ref="formRef"
        :model="formState"
        autocomplete="off"
        :rules="rules"
      >
        <FormTextInput
          v-model="formState.last_name"
          :placeholder="$t('pages.signup.last_name')"
          :label="$t('pages.signup.last_name')"
          :name="'last_name'"
          :is-required="true"
          :is-show-required="true"
          :is-disabled="current === 1"
        ></FormTextInput>

        <FormTextInput
          v-model="formState.first_name"
          :placeholder="$t('pages.signup.first_name')"
          :label="$t('pages.signup.first_name')"
          :name="'first_name'"
          :is-required="true"
          :is-show-required="true"
          :is-disabled="current === 1"
        ></FormTextInput>

        <FormTextInput
          v-model="formState.company"
          :placeholder="$t('pages.signup.company')"
          :label="$t('pages.signup.company')"
          :is-disabled="current === 1"
          :is-show-required="true"
          :is-required="false"
        ></FormTextInput>

        <FormTextInput
          v-model="formState.phone_number"
          :placeholder="$t('pages.signup.phone_number')"
          :label="$t('pages.signup.phone_number')"
          :is-show-required="true"
          :is-required="false"
          :is-disabled="current === 1"
        ></FormTextInput>

        <FormTextInput
          v-model="formState.email"
          :placeholder="$t('pages.signup.email')"
          :label="$t('pages.signup.email')"
          :name="'email'"
          :is-required="true"
          :is-show-required="true"
          :is-disabled="current === 1"
        ></FormTextInput>

        <FormTextInput
          v-model="formState.password"
          :placeholder="$t('pages.signup.password_placeholder')"
          :label="$t('pages.signup.password')"
          :type-input="'password'"
          :name="'password'"
          :is-required="true"
          :is-show-required="true"
          :is-disabled="current === 1"
        ></FormTextInput>

        <FormTextInput
          v-model="formState.password_confirmation"
          class="login-form_custom"
          :placeholder="$t('pages.signup.password_confirmation_placeholder')"
          :label="$t('pages.signup.password_confirmation')"
          :type-input="'password'"
          :name="'password_confirmation'"
          :is-required="true"
          :is-show-required="true"
          :is-disabled="current === 1"
        ></FormTextInput>

        <a-form-item>
          <a-checkbox v-model:checked="checked"> </a-checkbox>
          <nuxt-link
            class="login-form__terms"
            :to="`${config.public.homeUrl}/terms.html`"
            target="_blank"
          >
            {{ $t('pages.signup.terms') }}
          </nuxt-link>
          {{ $t('pages.signup.end') }}
          <nuxt-link
            class="login-form__privacy"
            :to="`${config.public.homeUrl}/privacy.html`"
            target="_blank"
          >
            {{ $t('pages.signup.privacy') }}
          </nuxt-link>
          {{ $t('pages.signup.agree') }}
        </a-form-item>

        <div class="mt-50px">
          <Button
            :size="`large`"
            :label="
              current === 0
                ? $t('pages.signup.submit')
                : $t('components.button.submit')
            "
            :disabled="!checked"
            @click="onFinish"
          ></Button>
        </div>
        <div v-if="current === 0" class="text-center -mt-10px">
          <nuxt-link :to="config.public.homeUrl" class="login-form__forgotpass">
            {{ $t('pages.signup.quit_registration') }}
          </nuxt-link>
        </div>
        <div
          v-if="current === 1"
          class="text-center -mt-10px"
          @click="onClickBack"
        >
          <a to="/" class="login-form__forgotpass">
            {{ $t('pages.signup.back') }}
          </a>
        </div>
      </a-form>
    </div>
    <div v-else class="flex flex-col items-center">
      <p
        class="login-form__title mb-12px mt-8px text-20px leading-22px font-bold"
      >
        {{ $t('pages.signup.title_complete') }}
      </p>
      <p
        class="login-form__complete mb-20px mt-17px text-center text-16px leading-22px"
      >
        {{ $t('pages.signup.sub_title_complete1') }}<br />
        {{ $t('pages.signup.sub_title_complete2') }}
      </p>
      <p
        class="login-form__complete mb-80px text-center text-14px leading-22px"
      >
        {{ $t('pages.signup.sub_title_complete3') }}<br />
        {{ $t('pages.signup.sub_title_complete4') }}<br />
        {{ $t('pages.signup.sub_title_complete5') }}<br />
      </p>

      <div class="text-center -mt-10px">
        <nuxt-link :to="config.public.homeUrl" class="login-form__forgotpass">
          {{ $t('pages.signup.close_this_screen') }}
        </nuxt-link>
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

  &__privacy {
    font-size: 14px;
    border-bottom: 1px solid;

    &:hover {
      color: unset;
    }
  }

  &__terms {
    margin-left: 8px;
    font-size: 14px;
    border-bottom: 1px solid;

    &:hover {
      color: unset;
    }
  }

  &__forgotpass {
    margin-top: -10px;
    color: $color_blue;
    padding-bottom: 4px;
    border-bottom: 1px solid $color_blue;
  }

  &__complete {
    color: $color_black2;
  }
}

:deep(.ant-form-item) {
  margin-bottom: 30px;
}

.login-form_custom :deep(.ant-form-item) {
  margin-bottom: 26px !important;
}

:deep(.ant-steps) {
  .ant-steps-item-icon {
    font-size: 16px;

    > .ant-steps-icon {
      top: -2px;
    }
  }

  .ant-steps-item-finish .ant-steps-item-icon {
    border-color: $color_orange;
  }
}

@include mq_down(sp) {
  :deep(.ant-steps) {
    flex-direction: row;
  }
}
</style>
