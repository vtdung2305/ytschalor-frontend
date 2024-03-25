<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import { IItemObject, INotification } from '@/interfaces/common'
import data from '@/static/data_country.json'
import { TitleLoading } from '@/constants/common'
import { useUser } from '@/stores/user'
import { CookieKeyEnum } from '@/constants/cookie'
import { IUserKeyUpdate } from '@/interfaces/user'

definePageMeta({
  layout: 'page',
})

const { setLoading, showNotification, isAdmin } = useHelper()

const { t } = useLang()

const userStore = useUser()

const visible = ref<boolean>(true)

const countryList = ref<IItemObject[]>()

const activeKey = ref<string>(isAdmin.value ? '2' : '1')

const { $api } = useNuxtApp()

const formRef = ref()

const formState = reactive<IUserKeyUpdate>({
  key: '',
  country: 'JP',
})

const rules: Record<string, Rule[]> = {
  key: [
    {
      required: true,
      message: t('common.filed_no_required', {
        field: t('pages.user_setting.google_api_key'),
      }),
    },
  ],
}

const onFinish = () => {
  const params = {
    api_key: formState.key,
    region_code: formState.country,
    relevance_language: formState.country === 'JP' ? 'ja' : 'en',
  }

  formRef.value
    .validate()
    .then(async () => {
      await setLoading(true, TitleLoading.LoadingList)
      $api.user
        .updateGoogleApiKey(params)
        .then(async () => {
          const userData = localStorage.getItem(CookieKeyEnum.USER_DATA)

          if (userData) {
            const data = JSON.parse(userData)

            data.key = {
              api_key: formState.key,
              region_code: formState.country,
              relevance_language: formState.country === 'JP' ? 'ja' : 'en',
              user_id: data?.id,
            }

            localStorage.setItem(CookieKeyEnum.USER_DATA, JSON.stringify(data))

            userStore.setUser(data)
          }

          visible.value = false

          const params = {
            description: t(
              'pages.user_setting.messages.update_api_key_success'
            ),
            duration: 4.5,
            icon: true,
            status: true,
          }

          showNotification(params as INotification)
          await setLoading(false)
        })
        .catch(async (e: any) => {
          const params = {
            description: t('pages.user_setting.messages.update_api_key_error'),
            duration: 4.5,
            icon: true,
            status: false,
          }

          showNotification(params as INotification)
          await setLoading(false)
        })
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

onMounted(() => {
  if (userStore.userData?.key) {
    formState.key = userStore.userData?.key?.api_key
    formState.country = userStore.userData?.key?.region_code
    visible.value = false
  }

  countryList.value = data.map((item) => ({
    label: item.Name,
    value: item.Code,
  }))
})
</script>

<template>
  <PageContainer>
    <PageHead :title="$t('pages.user_setting.title')">
      <a-tabs v-model:activeKey="activeKey" :size="'large'">
        <a-tab-pane
          v-if="!isAdmin"
          key="1"
          :tab="$t('pages.user_setting.basic_settings')"
        ></a-tab-pane>
        <a-tab-pane
          key="2"
          :tab="$t('pages.user_setting.account_info')"
        ></a-tab-pane>
        <a-tab-pane
          key="3"
          :tab="$t('pages.user_setting.password_setting')"
        ></a-tab-pane>
      </a-tabs>
    </PageHead>

    <PageBody v-if="activeKey === '1'">
      <a-form
        ref="formRef"
        :model="formState"
        autocomplete="off"
        :rules="rules"
      >
        <div class="flex items-center <laptop:flex-col <laptop:items-start">
          <FormTextInput
            v-model="formState.key"
            class="w-500px <laptop:w-full"
            :label="$t('pages.user_setting.google_api_key')"
            :type-input="'password'"
            :name="'key'"
            :is-required="true"
            :is-show-required="true"
            :visible="visible"
          ></FormTextInput>
          <nuxt-link
            target="_blank"
            to="/user-settings/api-key-configuration-guide"
            class="change-key__instruct ml-32px <laptop:ml-0 <laptop:mb-32px"
          >
            {{ $t('pages.user_setting.instruct') }}
          </nuxt-link>
        </div>

        <div class="change-key__desc">
          {{ $t('pages.user_setting.desc1') }}<br />
          {{ $t('pages.user_setting.desc2') }}
        </div>

        <FormSelect
          v-model="formState.country"
          class="mt-32px w-250px <laptop:w-full"
          :label="$t('pages.user_setting.region_settings')"
          :items="countryList"
          :is-required="true"
          :is-show-required="true"
          :show-search="true"
          :size="`large`"
        >
        </FormSelect>

        <Button
          class="w-250px mt-46px mb-224px <laptop:w-full"
          :size="`large`"
          :label="$t('pages.user_setting.submit')"
          @click="onFinish"
        ></Button>
      </a-form>
    </PageBody>
    <PageBody v-else-if="activeKey === '2'">
      <PageInfoUser></PageInfoUser>
    </PageBody>
    <PageBody v-else>
      <PageChangePassword></PageChangePassword>
    </PageBody>
  </PageContainer>
</template>

<style lang="scss">
.change-key {
  &__instruct {
    margin-top: 8px;
    color: $color_blue;
    padding-bottom: 4px;
    border-bottom: 1px solid $color_blue;
  }

  &__desc {
    color: $color_gray3;
  }
}

.ant-tabs-top > .ant-tabs-nav {
  margin: unset;
}

.ant-tabs-large > .ant-tabs-nav .ant-tabs-tab {
  color: $color_black2;
}

.ant-input-affix-wrapper {
  border-radius: 2px;
}
</style>
