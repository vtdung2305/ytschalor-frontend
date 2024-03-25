<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import { CheckCircleTwoTone, InfoCircleOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import {
  GoogleTypeEnum,
  TitleLoading,
  GoogleOptions,
  MasterSite,
} from '../../constants/common'
import { IItemObject, INotification } from '@/interfaces/common'
import { IParamsAPIKey, IUserKeyUpdate, IUserSetting } from '@/interfaces/user'
import { useUser } from '@/stores/user'
import { CookieKeyEnum } from '@/constants/cookie'
import I18nLanguage from '@/static/I18nLanguage.json'
import I18nRegions from '@/static/I18nRegions.json'
import timezones from '@/static/timezones.json'

definePageMeta({
  layout: 'page',
})

const { setLoading, showNotification, isAdmin } = useHelper()

const { t } = useLang()

const userStore = useUser()

const visible = ref<boolean>(true)

const activeKey = ref<string>(isAdmin.value ? '2' : '1')

const { $api } = useNuxtApp()

const { initOauth, signIn } = useAuth()

const formRef = ref()

const form = ref()

const formState = reactive<IUserKeyUpdate>({
  api_key: null,
})

const userData = computed(() => {
  const userInfo = userStore.userData || null

  if (!userInfo) return null
  return userInfo
})

const googleModel = ref<number>(1)

const timezone = computed(() => {
  const utcOffset = dayjs().utcOffset() / 60

  const timezoneName = timezones.find(
    (e) =>
      e.timezone_offset === (utcOffset > 0 ? `+${utcOffset}` : `-${utcOffset}`)
  )

  if (!timezoneName) return null
  return timezoneName.timezone_name_en
})

const formUserSetting = reactive<IUserSetting>({
  region_code: userData.value?.region_code || navigator.language.split('-')[1],
  relevance_language:
    userData.value?.relevance_language || navigator.languages[1],
  timezone_name: userData.value?.timezone_name || timezone.value,
  timezone_offset: userData.value?.timezone_offset || null,
})

const rules: Record<string, Rule[]> = {
  api_key: [
    {
      required: true,
      message: t('common.filed_no_required', {
        field: t('pages.user_setting.google_api_key'),
      }),
    },
  ],
}

const regionLists = computed(() =>
  I18nRegions.items.map((e) => {
    return {
      label: e.snippet.name,
      value: e.snippet.gl,
    }
  })
)

const languageLists = computed(() =>
  I18nLanguage.items.map((e) => {
    return {
      label: e.snippet.name,
      value: e.snippet.hl,
    }
  })
)

const timezoneLists = computed(() =>
  timezones.map((e) => {
    return {
      label: e.timezone_name_ja,
      value: e.timezone_name_en,
    }
  })
)

const hasApiKey = computed(() => {
  return !!userData.value?.google_api_key_configured
})

const handleUserSetting = async () => {
  const params: IUserSetting = cloneDeep(formUserSetting)

  params.timezone_offset = convertTimeZoneOffset(params.timezone_name as string)

  await setLoading(true, TitleLoading.LoadingRegistration)
  $api.user
    .updateGoogleApiKey(params)
    .then(async () => {
      userStore.updateUserSearchSetting(params)
      const paramsNotify = {
        description: t('pages.user_setting.messages.search_setting_success'),
        duration: 4.5,
        icon: true,
        status: true,
      }

      showNotification(paramsNotify as INotification)
      await setLoading(false)
    })
    .catch(async (e: any) => {
      const params = {
        description: t('pages.user_setting.messages.search_setting_error'),
        duration: 4.5,
        icon: true,
        status: false,
      }

      showNotification(params as INotification)
      await setLoading(false)
    })
}

const handleOauthGoogleSignIn = async () => {
  // alert('Developing')
  // return false
  try {
    const googleUser: any = await signIn()

    // console.log('googleUser', googleUser)
    if (!googleUser) {
      return null
    }

    // const user = $googleAuth.getBasicProfile().getEmail();
    // console.log("getId", user);
    // console.log('getBasicProfile', googleUser.getBasicProfile())
    // console.log("getAuthResponse", googleUser.getAuthResponse());
    // console.log('getAuthResponse', googleUser.getAuthResponse())
    const userInfo = googleUser.getAuthResponse()

    const params: IParamsAPIKey = {
      google_access_token: userInfo.access_token,
      // google_refresh_token: userInfo?.refresh_token || null,
      // region_code: formUserSetting.region_code as string,
      // relevance_language: formUserSetting.relevance_language as string,
      handle_action: GoogleTypeEnum.AUTO,
      // timezone_name: formUserSetting.timezone_name,
      // timezone_offset: convertTimeZoneOffset(
      //   formUserSetting.timezone_name as string
      // ),
    }

    await setLoading(true, TitleLoading.LoadingRegistration)
    $api.user
      .settingKey(params)
      .then(async () => {
        // console.log(1111)

        userStore.updateUserAPI(true)

        const params = {
          description: t('pages.user_setting.messages.oauth_google_success'),
          duration: 4.5,
          icon: true,
          status: true,
        }

        showNotification(params as INotification)
        await setLoading(false)
      })
      .catch(async (e: any) => {
        const params = {
          description:
            e.status === 500
              ? t('pages.user_setting.messages.oauth_google_limit')
              : !e?._data?.data?.google_service_status
              ? t('pages.user_setting.messages.oauth_google_error')
              : h('div', [
                  t('pages.user_setting.messages.first_oauth_google_error'),
                  h(
                    'a',
                    {
                      href: e?._data?.data?.google_service_status,
                      style: 'color: #ff6b00; padding-right: 5px;',
                      target: '_blank',
                    },
                    [t('pages.user_setting.messages.link_oauth_google')]
                  ),
                  `${t('pages.user_setting.messages.last_oauth_google_error')}`,
                ]),
          duration: 4.5,
          icon: true,
          status: false,
        }

        showNotification(params as INotification)
        await setLoading(false)
      })
  } catch (error) {
    // on fail do something
    console.error(error)
    return null
  }
}

const handleSaveApiKey = async (action: number) => {
  const params: IParamsAPIKey = {
    // region_code: formUserSetting.region_code as string,
    // relevance_language: formUserSetting.relevance_language as string,
    api_key: formState.api_key as string,
    handle_action: action,
    // timezone_name: formUserSetting.timezone_name,
    // timezone_offset: convertTimeZoneOffset(
    //   formUserSetting.timezone_name as string
    // ),
  }

  await formRef.value
    .validate()
    .then(async () => {
      await setLoading(true, TitleLoading.LoadingRegistration)
      $api.user
        .settingKey(params)
        .then(async () => {
          userStore.updateUserAPI(true)

          const params = {
            description: t('pages.user_setting.messages.oauth_google_success'),
            duration: 4.5,
            icon: true,
            status: true,
          }

          showNotification(params as INotification)
          await setLoading(false)
        })
        .catch(async (e: any) => {
          const params = {
            description: t('pages.user_setting.messages.oauth_google_error'),
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

const handleRemoveApiKey = async (action: number) => {
  const params: IParamsAPIKey = {
    handle_action: action,
  }

  console.log(params)

  await setLoading(true, TitleLoading.LoadingRegistration)
  $api.user
    .settingKey(params)
    .then(async () => {
      formState.api_key = null
      userStore.updateUserAPI(false)

      // const params = {
      //   description: t('pages.user_setting.messages.update_api_key_success'),
      //   duration: 4.5,
      //   icon: true,
      //   status: true,
      // }

      // showNotification(params as INotification)
      await setLoading(false)
    })
    .catch(async (e: any) => {
      console.log(e)

      const params = {
        description: t('pages.user_setting.messages.update_api_key_error'),
        duration: 4.5,
        icon: true,
        status: false,
      }

      showNotification(params as INotification)
      await setLoading(false)
    })
}

const confirm = async (e: MouseEvent) => {
  await handleRemoveApiKey(GoogleTypeEnum.DELETE)
}

const cancel = (e: MouseEvent) => {
  console.log(e)
}

const getContainer = () => {
  return document.getElementById('popDeleteKey')
}

const convertTimeZoneOffset = (timezone: string) => {
  const tz = timezones.find(
    (e) => e.timezone_name_en === timezone
  )?.timezone_offset

  const timesign = dayjs().tz(timezone).utcOffset() > 0 ? '+' : '-'

  if (!tz) return null
  if (!tz.includes('.')) {
    return `${timesign}${tz
      .replace('+', '')
      .replace('-', '')
      .padStart(2, '0')}:00`
  }

  const tzArr = tz.split('.')

  const first = tzArr[0].replace('+', '').replace('-', '')

  const last = tzArr.pop() === '5' ? 30 : 45

  return `${timesign}${first.padStart(2, '0')}:${last}`
}

onBeforeMount(async () => {
  await initOauth()
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
      <h3 class="text-18px">
        {{ $t('pages.user_setting.google_api_setting') }}
      </h3>
      <div class="oauthGoogle mt-16px">
        <div v-if="!hasApiKey" class="oauthGoogle_noLogin">
          <div class="flex items-start">
            <info-circle-outlined
              class="text-24px"
              :style="{ color: '#FAAD14' }"
            />
            <div class="ml-16px suggestions__note">
              <p class="text-16px leading-24px">
                {{ $t('pages.user_setting.oauth_desc1') }} <br />
                {{ $t('pages.user_setting.oauth_desc2') }}
              </p>
            </div>
          </div>
        </div>
        <template v-else>
          <div class="oauthGoogle_logged">
            <div class="flex items-start">
              <check-circle-two-tone
                two-tone-color="#52c41a"
                class="text-24px"
              />
              <div class="ml-14px suggestions__note">
                <p class="text-16px pb-10px">
                  {{ $t('pages.user_setting.successful_cooperation') }}
                </p>
                <p class="text-14px leading-22px">
                  {{ $t('pages.user_setting.msg_linked_google') }}
                </p>
              </div>
            </div>
          </div>
          <p class="pt-20px text-16px leading-24px">
            {{ $t('pages.user_setting.google_logged.desc1') }}
            <a-popconfirm
              :placement="'top'"
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
              <span class="c-line warning">{{
                $t('pages.user_setting.google_logged.action')
              }}</span></a-popconfirm
            >
            {{ $t('pages.user_setting.google_logged.desc2') }}
          </p>
          <div id="popDeleteKey"></div>
        </template>
      </div>
      <div v-if="!hasApiKey" class="form">
        <div class="flex gap-x-16px my-24px">
          <FormLabel :label="$t('pages.user_setting.google_api_key')">
            <span class="required">{{ $t('common.required') }}</span>
          </FormLabel>
          <div class="flex items-center">
            <FormRadio
              v-model="googleModel"
              :options="GoogleOptions"
            ></FormRadio>
          </div>
        </div>
        <div v-if="googleModel === GoogleTypeEnum.MANUAL" class="flex flex-col">
          <a-form
            ref="formRef"
            :model="formState"
            autocomplete="off"
            :rules="rules"
          >
            <FormTextInput
              v-model="formState.api_key"
              class="w-414px <laptop:w-full"
              :type-input="'password'"
              :name="'api_key'"
              :is-required="true"
              :is-show-required="true"
              :visible="visible"
            ></FormTextInput>
            <div class="mt-30px">
              <Button
                class="w-250px mb-0 <laptop:w-full"
                :size="`large`"
                :label="$t('pages.user_setting.submit')"
                @click="handleSaveApiKey(GoogleTypeEnum.MANUAL)"
              ></Button>
            </div>
          </a-form>
        </div>
        <div v-else>
          <div class="step">
            <div class="step-block">
              <p class="text-16px leading-24px">
                <span class="step-title font-bold">{{
                  $t('pages.user_setting.step1.title')
                }}</span>
                {{ $t('pages.user_setting.step1.desc1') }}
                <a
                  href="https://console.cloud.google.com/getting-started"
                  target="_blank"
                  class="c-line primary"
                  >{{ $t('pages.user_setting.step1.link') }}</a
                >
                {{ $t('pages.user_setting.step1.desc2') }}
              </p>
              <div class="my-16px">
                <ImageVideo
                  :width="$device.isTablet || $device.isMobile ? '100%' : 393"
                  :src-thumb="MasterSite.google_image_instruction"
                  :src-preview="MasterSite.google_image_instruction"
                />
              </div>
              <p class="text-16px leading-24px">
                <span class="step-title font-bold">{{
                  $t('pages.user_setting.step2.title')
                }}</span>
                {{ $t('pages.user_setting.step2.desc') }}
              </p>
            </div>
          </div>
          <button
            class="oauthGoogleBtn !mt-16px"
            @click="handleOauthGoogleSignIn"
          >
            {{ $t('pages.user_setting.btn_sign_google') }}
          </button>
          <p class="pt-16px text-14px leading-normal">
            {{ $t('pages.user_setting.msg_oauth1') }}<br />{{
              $t('pages.user_setting.msg_oauth2')
            }}
          </p>
        </div>
      </div>
    </PageBody>

    <PageBody v-if="activeKey === '1'">
      <h3 class="text-18px">{{ $t('pages.user_setting.search_settings') }}</h3>
      <div class="oauthGoogle">
        <div class="oauthGoogle_form">
          <a-form :model="formUserSetting" autocomplete="off" :rules="rules">
            <div class="mt-32px">
              <div class="w-292px <laptop:w-full">
                <FormLabel :label="$t('pages.user_setting.region_code')">
                  <Popover
                    :title="``"
                    :content="$t('pages.user_setting.messages.region_tooltip')"
                    :theme="`outlined`"
                  />
                </FormLabel>
                <FormSelect
                  v-model="formUserSetting.region_code"
                  :items="regionLists"
                  :is-required="false"
                  :is-show-required="false"
                  :show-search="true"
                  :size="`large`"
                >
                </FormSelect>
              </div>
              <div class="w-292px <laptop:w-full">
                <FormLabel :label="$t('pages.user_setting.relevance_language')">
                  <Popover
                    :title="``"
                    :content="
                      $t('pages.user_setting.messages.language_tooltip')
                    "
                    :theme="`outlined`"
                  />
                </FormLabel>
                <FormSelect
                  v-model="formUserSetting.relevance_language"
                  :items="languageLists"
                  :is-required="true"
                  :is-show-required="false"
                  :show-search="true"
                  :size="`large`"
                >
                </FormSelect>
              </div>
              <div class="w-292px <laptop:w-full">
                <FormLabel :label="$t('pages.user_setting.time_zone')">
                  <Popover
                    :title="``"
                    :content="
                      $t('pages.user_setting.messages.timezone_tooltip')
                    "
                    :theme="`outlined`"
                  />
                </FormLabel>
                <FormSelect
                  v-model="formUserSetting.timezone_name"
                  :items="timezoneLists"
                  :is-required="true"
                  :is-show-required="false"
                  :show-search="true"
                  :size="`large`"
                >
                </FormSelect>
              </div>
            </div>

            <Button
              class="w-250px mt-46px mb-50px <laptop:w-full"
              :size="`large`"
              :label="$t('pages.user_setting.submit')"
              @click="handleUserSetting"
            ></Button>
          </a-form>
        </div>
      </div>
    </PageBody>

    <PageBody v-else-if="activeKey === '2'">
      <PageInfoUser></PageInfoUser>
    </PageBody>

    <PageBody v-else>
      <PageChangePassword></PageChangePassword>
    </PageBody>
  </PageContainer>
</template>

<style lang="scss" scoped>
:deep(.ant-input-affix-wrapper) {
  border-radius: 2px;
}
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

:deep(.ant-tabs-top > .ant-tabs-nav) {
  margin: unset;
}

.ant-tabs-large > .ant-tabs-nav .ant-tabs-tab {
  color: $color_black2;
}

.ant-input-affix-wrapper {
  border-radius: 2px;
}
.oauthGoogle {
  // padding-bottom: 84px;
  &_noLogin {
    padding: 16px 26px;
    background: linear-gradient(0deg, #fffbe6, #fffbe6),
      linear-gradient(0deg, #ffe58f, #ffe58f);
    border: 1px solid $color_yellow3;
  }

  &_logged {
    padding: 16px 26px;
    background: linear-gradient(0deg, #f6ffed, #f6ffed),
      linear-gradient(0deg, #b7eb8f, #b7eb8f);
    border: 1px solid $color_geeen;
  }
}

.oauthGoogleBtn {
  margin-top: 5px;
  width: 253px;
  height: 61px;
  background: url('../images/btn_google_signin@2x.png') no-repeat left center;
  background-size: contain;
  text-indent: -9999px;
  transition: opacity 0.3s ease-in-out;

  @include mq_down(sp) {
    width: 200px;
  }
  &:hover {
    opacity: 0.6;
  }
}

.required {
  display: inline-block;
  font-size: 10px;
  line-height: 18px;
  border: 1px solid;
  padding: 2px 7px;
  border-radius: 4px;
  margin-left: 11px;
  color: $color_red1;
  border-color: $color_red1;
  min-width: 36px;
}

.step {
  color: $color_black2;
}
</style>
