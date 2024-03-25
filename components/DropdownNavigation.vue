<script lang="ts" setup>
import { ref } from 'vue'
import {
  SettingOutlined,
  TeamOutlined,
  PayCircleOutlined,
  LogoutOutlined,
  LockOutlined,
} from '@ant-design/icons-vue'
import { IMenuItem } from '@/interfaces/menu'
import { useUser } from '@/stores/user'
import { RoleEnum } from '@/constants/role'
import { PlanEnum } from '@/constants/plan'
import { INotification, IModalParams } from '@/interfaces/common'
import { MasterSite } from '@/constants/common'

const { t } = useLang()

const config = useRuntimeConfig()

const router = useRouter()

const route = useRoute()

const userStore = useUser()

const {
  userName,
  isPlanFree,
  isPlanPersonal,
  isPlanTeam,
  isAdmin,
  isChildren,
  showNotification,
} = useHelper()

const current = ref<string[]>([''])

const menuItems = ref<IMenuItem[]>([
  {
    key: 'user-settings',
    name: t('components.dropdowmenu.setting'),
    link: '/user-settings',
    component: SettingOutlined,
    show: true,
    disabled: false,
  },
  {
    key: 'subaccounts',
    name: t('components.dropdowmenu.team'),
    link: '/subaccounts',
    component: TeamOutlined,
    show: !(isAdmin.value || isChildren.value),
    disabled: !isPlanTeam.value,
  },
  {
    key: 'account-settings',
    name: t('components.dropdowmenu.payment'),
    link: '/account-settings',
    component: PayCircleOutlined,
    show: !(isAdmin.value || isChildren.value),
    disabled: false,
  },
  {
    key: 'logout',
    name: t('components.dropdowmenu.logout'),
    link: '/logout',
    component: LogoutOutlined,
    show: true,
    disabled: false,
  },
])

const logout = async () => {
  const { $modalConfirm } = useNuxtApp()

  const params: IModalParams = {
    title: t('components.logout.title'),
    content: t('components.logout.description'),
    okText: t('components.logout.btn_confirm'),
    okType: 'primary',
    cancelText: t('components.logout.btn_cancel'),
  }

  const confirm = await $modalConfirm(params)

  if (!confirm) {
    return false
  }
  try {
    const isAdmin = userStore.roleName === RoleEnum.ADMIN

    await userStore.logout()
    if (isAdmin) {
      router.push(`/admin/login`)
    } else {
      router.push(`/login`)
    }
  } catch (error) {}
}

const notify = () => {
  const params = {
    description: t('components.notify.msg_function_lock'),
    duration: 4.5,
    icon: true,
    status: true,
  }

  showNotification(params as INotification)
}

onMounted(() => {
  if (route.name === 'admin-user-settings') {
    current.value[0] = 'user-settings'
  } else {
    current.value[0] = route.name as string
  }
})

watch(
  () => route.name,
  () => {
    if (route.name === 'admin-user-settings') {
      current.value[0] = 'user-settings'
    } else {
      current.value[0] = route.name as string
    }
  }
)
</script>

<template>
  <div class="flex">
    <a-dropdown
      :trigger="['click']"
      :placement="`bottomRight`"
      :get-popup-container="(triggerNode) => triggerNode.parentNode"
    >
      <a class="ant-dropdown-link" @click.prevent>
        <div class="flex items-center cursor-pointer">
          <CommonUserAvatar
            :avatar-url="
              userStore.userData?.avatar
                ? `${config.public.apiCloud}/${userStore.userData?.avatar}`
                : MasterSite.avatar_default
            "
          />
          <div class="pl-8px">{{ userName }}</div>
        </div>
      </a>
      <template #overlay>
        <a-menu v-model:selectedKeys="current">
          <div
            v-for="(item, index) in menuItems"
            :key="index"
            class="flex items-center pr-10px"
            :class="current[0] === item.key ? 'selected-menu' : ''"
          >
            <a-menu-item
              v-if="item.show"
              :disabled="item.disabled"
              class="!py-12px"
            >
              <component
                :is="item.component"
                :style="{ fontSize: '22px' }"
              ></component>
              <template v-if="item.link !== '/logout'">
                <nuxt-link :to="isAdmin ? `/admin${item.link}` : item.link">{{
                  item.name
                }}</nuxt-link>
              </template>
              <template v-else>
                <a @click="logout">{{ item.name }}</a>
              </template>
            </a-menu-item>
            <div
              v-if="item.disabled && !isAdmin && item.show"
              class="cursor-pointer"
              @click="notify"
            >
              <LockOutlined :style="{ fontSize: '18px' }" />
            </div>
          </div>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-dropdown .ant-dropdown-menu-item) {
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
}

:deep(.ant-dropdown-menu-title-content) {
  display: flex;

  > a {
    padding-left: 10px;
  }
}

:deep(.ant-dropdown .ant-dropdown-menu) {
  padding: 4px;
}
:deep(.selected-menu li) {
  color: $color_orange !important;
}
</style>
