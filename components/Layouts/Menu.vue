<script lang="ts" setup>
import { h, ref } from 'vue'
import {
  ToolOutlined,
  RiseOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { MenuProps } from 'ant-design-vue'
import { IMenuItem } from '@/interfaces/menu'

const { t } = useLang()

const { isMobile, isTablet } = useDevice()

const { handleSideMenu } = useSideBar()

const { isAdmin } = useHelper()

const props = defineProps({
  mode: {
    type: String,
    default: 'horizontal',
  },
})

const router = useRouter()

const route = useRoute()

const current = ref<string[]>(['analysis'])

const items = ref<MenuProps['items']>([
  {
    key: 'analysis',
    icon: () => h(SearchOutlined),
    label: t('components.menus.keyword'),
    title: t('components.menus.keyword'),
  },
  // {
  //   key: 'trends',
  //   icon: () => h(RiseOutlined),
  //   label: t('components.menus.trend'),
  //   title: t('components.menus.trend'),
  // },
  {
    key: 'search',
    icon: () => h(ToolOutlined),
    label: t('components.menus.tool'),
    title: t('components.menus.tool'),
  },
])

const currentAdmin = ref<string[]>(['admin-users'])

const itemAdmins = ref<MenuProps['items']>([
  {
    key: 'admin-users',
    icon: () => h(UserOutlined),
    label: t('pages.admin_user.title'),
    title: t('pages.admin_user.title'),
  },
])

const handleClick: MenuProps['onClick'] = (e) => {
  router.push({ name: e?.key as string })
  if (isMobile || isTablet) {
    handleSideMenu()
  }
}

onMounted(() => {
  if (route.name === 'index' || route.name === 'analysis') {
    current.value[0] = 'analysis'
  } else if (route.name === 'search') {
    current.value[0] = 'search'
  } else {
    current.value[0] = ''
  }

  if (route.name === 'admin-users') {
    currentAdmin.value[0] = 'admin-users'
  } else {
    currentAdmin.value[0] = ''
  }
})

watch(
  () => route.name,
  () => {
    current.value[0] = route.name as string
    currentAdmin.value[0] = route.name as string
  }
)
</script>

<template>
  <a-menu
    v-if="!isAdmin"
    v-model:selectedKeys="current"
    :mode="mode"
    :items="items"
    disabled-overflow
    @click="handleClick"
  />
  <a-menu
    v-else
    v-model:selectedKeys="currentAdmin"
    :mode="mode"
    :items="itemAdmins"
    disabled-overflow
    @click="handleClick"
  />
</template>

<style lang="scss" scoped>
.ant-menu-horizontal {
  border-bottom: none;

  :deep(.ant-menu-item) {
    display: inline-flex;
    align-items: center;
    padding: 0 19px;
  }
}

.ant-menu {
  :deep(.ant-menu-item .ant-menu-item-icon) {
    font-size: 22px;
  }
}
</style>
