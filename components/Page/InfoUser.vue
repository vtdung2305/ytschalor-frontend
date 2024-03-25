<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import { useUser } from '@/stores/user'
import { IUserInfo } from '@/interfaces/user'
import { TitleLoading } from '@/constants/common'
import { INotification } from '@/interfaces/common'
import { CookieKeyEnum } from '@/constants/cookie'

const { t } = useLang()

const { setLoading, showNotification } = useHelper()

const config = useRuntimeConfig()

const { $api } = useNuxtApp()

const userStore = useUser()

const { uploadFile } = useUpload()

const formState = reactive<IUserInfo>({
  avatar: null,
  last_name: '',
  first_name: '',
  company: null,
  phone_number: null,
  email: '',
})

const formRef = ref()

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
}

const onFinish = () => {
  formRef.value
    .validate()
    .then(async () => {
      await setLoading(true, TitleLoading.LoadingRegistration)

      let avatarUrl = ''

      if (typeof formState?.avatar === 'string') {
        avatarUrl = formState?.avatar.replace(`${config.public.apiCloud}/`, '')
      } else if (formState.avatar) {
        avatarUrl = await uploadFile(formState?.avatar as File)

        if (avatarUrl === 'ERROR') {
          avatarUrl = ''
          const params = {
            description: t('common.serve_error'),
            duration: 4.5,
            icon: true,
            status: false,
          }

          showNotification(params as INotification)
          await setLoading(false)
          return
        }
      }

      const params = {
        avatar: avatarUrl,
        last_name: formState.last_name,
        first_name: formState.first_name,
        company: formState.company,
        phone_number: formState.phone_number,
        email: formState.email,
      }

      $api.user
        .editUserInfo(params)
        .then(async (e: any) => {
          const userData = localStorage.getItem(CookieKeyEnum.USER_DATA)

          if (userData) {
            const data = JSON.parse(userData)

            data.avatar = avatarUrl
            data.last_name = formState.last_name
            data.first_name = formState.first_name
            data.company = formState.company
            data.phone_number = formState.phone_number
            data.email = formState.email

            localStorage.setItem(CookieKeyEnum.USER_DATA, JSON.stringify(data))

            userStore.setUser(data)
          }

          const params = {
            description: e?.message,
            duration: 4.5,
            icon: true,
            status: true,
          }

          showNotification(params as INotification)

          await setLoading(false)
        })
        .catch(async (e: any) => {
          const params = {
            description: t('common.serve_error'),
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

onMounted(() => {
  if (userStore.userData) {
    formState.avatar = userStore.userData?.avatar
      ? `${config.public.apiCloud}/${userStore.userData?.avatar}`
      : ''
    formState.last_name = userStore.userData?.last_name
      ? userStore.userData?.last_name
      : ''
    formState.first_name = userStore.userData?.first_name
      ? userStore.userData?.first_name
      : ''
    formState.company = userStore.userData?.company
      ? userStore.userData?.company
      : ''
    formState.phone_number = userStore.userData?.phone_number
      ? userStore.userData?.phone_number
      : ''
    formState.email = userStore.userData?.email ? userStore.userData?.email : ''
  }
})
</script>

<template>
  <a-form ref="formRef" :model="formState" :rules="rules">
    <div class="flex <laptop:flex-col">
      <div class="ml-72px order-1 <laptop:order-0 <laptop:ml-0 <laptop:mb-30px">
        <div class="text-16px leading-24px mb-4px <tablet:text-center">
          {{ $t('pages.signup.avatar') }}
        </div>
        <div class="flex <tablet:justify-center">
          <UploadAvatar v-model="formState.avatar as File | string" />
        </div>
      </div>

      <div class="order-0 <laptop:order-1">
        <FormTextInput
          v-model="formState.last_name"
          :placeholder="$t('pages.signup.last_name')"
          :label="$t('pages.signup.last_name')"
          :name="'last_name'"
          :is-required="true"
          :is-show-required="true"
          class="w-400px <laptop:w-full"
        ></FormTextInput>

        <FormTextInput
          v-model="formState.first_name"
          :placeholder="$t('pages.signup.first_name')"
          :label="$t('pages.signup.first_name')"
          :name="'first_name'"
          :is-required="true"
          :is-show-required="true"
          class="w-400px <laptop:w-full"
        ></FormTextInput>

        <FormTextInput
          v-model="formState.email"
          :placeholder="$t('pages.signup.email')"
          :label="$t('pages.signup.email')"
          :name="'email'"
          :is-disabled="true"
          class="w-400px <laptop:w-full"
        ></FormTextInput>

        <FormTextInput
          v-model="formState.phone_number"
          :placeholder="$t('pages.signup.phone_number')"
          :label="$t('pages.create_subaccount.phone')"
          class="w-400px <laptop:w-full"
        ></FormTextInput>

        <FormTextInput
          v-model="formState.company"
          :placeholder="$t('pages.signup.company')"
          :label="$t('pages.signup.company')"
          class="w-400px <laptop:w-full"
        ></FormTextInput>
      </div>
    </div>

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
</style>
