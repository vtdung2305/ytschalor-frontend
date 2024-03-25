<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import { IUserSubSignUp } from '@/interfaces/user'
import { INotification } from '@/interfaces/common'
import { TitleLoading } from '@/constants/common'
import { useUser } from '@/stores/user'
import { PlanEnum } from '@/constants/plan'
import { CookieKeyEnum } from '@/constants/cookie'

// meta
definePageMeta({ layout: 'page' })

const { t } = useLang()

const { setLoading, showNotification } = useHelper()

const { $api } = useNuxtApp()

const router = useRouter()

const current = ref<number>(0)

const formRef = ref()

const userStore = useUser()

const errorEmail = ref<boolean>(false)

const formState = reactive<IUserSubSignUp>({
  last_name: '',
  first_name: '',
  company: userStore.userData?.company ? userStore.userData?.company : '',
  phone_number: '',
  email: '',
})

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
}

const onFinish = () => {
  formRef.value
    .validate()
    .then(async () => {
      if (current.value === 0) {
        current.value++
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        })
      } else {
        await setLoading(true, TitleLoading.LoadingRegistration)
        $api.user
          .createSubAccount(formState)
          .then(async (e: any) => {
            const userData = localStorage.getItem(CookieKeyEnum.USER_DATA)

            if (userData) {
              const data = JSON.parse(userData)

              data.child_account_number = e?.includes?.child_account_number

              localStorage.setItem(
                CookieKeyEnum.USER_DATA,
                JSON.stringify(data)
              )

              userStore.setUser(data)
            }

            current.value++
            await setLoading(false)
          })
          .catch(async (e: any) => {
            current.value--
            if (e?._data?.email) {
              errorEmail.value = true
              formRef.value.validateFields()

              const params = {
                description: t('pages.create_subaccount.email_require', {
                  field: formState.email,
                }),
                duration: 4.5,
                icon: true,
                status: false,
              }

              showNotification(params as INotification)
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

const onClickBack = () => {
  current.value--
}

const toSubaccounts = () => {
  router.push(`/subaccounts`)
}

onMounted(() => {
  if (userStore.planType !== PlanEnum.TEAM) {
    router.push('/404')
  }
})

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
  <PageContainer>
    <PageSection class="flex justify-between items-baseline">
      <h2 class="page-title">
        <div>{{ $t('pages.create_subaccount.title') }}</div>
      </h2>
    </PageSection>

    <PageBody>
      <div class="mb-200px">
        <div class="create-sub__title">
          {{ $t('pages.create_subaccount.sub_title') }}
        </div>

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
                title: $t('pages.create_subaccount.finish'),
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

            <div class="mt-50px">
              <Button
                :size="`large`"
                :label="
                  current === 0
                    ? $t('pages.create_subaccount.confirm')
                    : $t('pages.create_subaccount.submit')
                "
                @click="onFinish"
              ></Button>
            </div>
            <div v-if="current === 0" class="text-center -mt-10px">
              <nuxt-link target="_blank" class="c-link" @click="toSubaccounts">
                {{ $t('pages.create_subaccount.back') }}
              </nuxt-link>
            </div>
            <div
              v-if="current === 1"
              class="text-center -mt-10px"
              @click="onClickBack"
            >
              <a to="/" class="c-link">
                {{ $t('pages.create_subaccount.back') }}
              </a>
            </div>
          </a-form>
        </div>
        <div v-else>
          <div class="text-18px">
            {{ $t('pages.create_subaccount.title_success') }}
          </div>
          <div class="w-400px mt-35px text-14px leading-22px <tablet:w-full">
            {{ $t('pages.create_subaccount.note') }}
          </div>
          <div class="create-sub__list mt-40px">
            <div class="create-sub__row">
              <div class="create-sub__column">
                {{ $t('pages.create_subaccount.name') }}
              </div>
              <div class="create-sub__column">
                {{ formState.last_name }} {{ formState.first_name }}
              </div>
            </div>
            <div class="create-sub__row">
              <div class="create-sub__column">
                {{ $t('pages.create_subaccount.company') }}
              </div>
              <div class="create-sub__column">
                {{ formState.company || $t('others.empty') }}
              </div>
            </div>
            <div class="create-sub__row">
              <div class="create-sub__column">
                {{ $t('pages.create_subaccount.phone') }}
              </div>
              <div class="create-sub__column">
                {{ formState.phone_number || $t('others.empty') }}
              </div>
            </div>
            <div class="create-sub__row">
              <div class="create-sub__column">
                {{ $t('pages.create_subaccount.email') }}
              </div>
              <div class="create-sub__column">{{ formState.email }}</div>
            </div>
          </div>
          <div class="mt-100px">
            <p class="c-link inline" @click="toSubaccounts">
              {{ $t('pages.create_subaccount.back') }}
            </p>
          </div>
        </div>
      </div>
    </PageBody>
  </PageContainer>
</template>

<style lang="scss" scoped>
.page-title {
  font-size: 20px;
  line-height: 28px;
  font-weight: bold;
  color: $color_black2;
}

.create-sub {
  &__title {
    font-size: 20px;
    line-height: 24px;
  }

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
}

.c-link {
  border-bottom: 1px solid $color_blue;
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

  .ant-steps-item-title {
    color: $color_black2 !important;
  }
}

@include mq_down(sp) {
  :deep(.ant-steps) {
    flex-direction: row;
  }
}
</style>
