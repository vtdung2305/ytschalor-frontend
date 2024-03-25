<script lang="ts" setup>
import { useUser } from '@/stores/user'
import { useVideo } from '@/stores/video'
import { useChannel } from '@/stores/channel'
import { INotification } from '@/interfaces/common'
import { CookieKeyEnum } from '@/constants/cookie'

definePageMeta({
  layout: 'page',
})

const userStore = useUser()

const videoStore = useVideo()

const channelStore = useChannel()

const route = useRoute()

const router = useRouter()

const { setLoading, showNotification } = useHelper()

const verifyPayment = async (transactionId: string) => {
  const { $api } = useNuxtApp()

  try {
    const res = await $api.user.verifyPaymentPlan(transactionId)

    if (res && res?.data) {
      const userData = localStorage.getItem(CookieKeyEnum.USER_DATA)

      if (userData) {
        const data = JSON.parse(userData)

        data.child_account_number = res?.includes?.child_account_number

        localStorage.setItem(CookieKeyEnum.USER_DATA, JSON.stringify(data))

        userStore.setUser(data)
      }

      await userStore.setPlanUser(res.data)
      await videoStore.$reset()
      await channelStore.$reset()
      router.push('/account-settings')
    }
    // console.log(res)
  } catch (error: any) {
    const params = {
      description: error?._data?.message,
      duration: 4.5,
      icon: true,
      status: false,
    }

    showNotification(params as INotification)
  }
}

onMounted(async () => {
  if (route.query?.status === 'success' && route.query?.transaction_id) {
    setLoading(true)
    await verifyPayment(route.query?.transaction_id as string)
    setLoading(false)
  } else if (route.query?.status === 'fail') {
    router.push('/account-settings')
  } else {
    router.push('404')
  }
})
</script>

<template>
  <div>
    <Loading class="w-full h-full fixed top-0 left-0" />
  </div>
</template>

<style lang="scss" scoped></style>
