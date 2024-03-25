<script lang="ts" setup>
import { MasterSite } from '@/constants/common'

// meta
definePageMeta({
  layout: 'empty',
})

const { setLoading } = useHelper()

const route = useRoute()

const router = useRouter()

const { $api } = useNuxtApp()

const success = ref<boolean>(false)

const isLoading = ref<boolean>(false)

const getImageUrlLogo = computed(() => {
  return MasterSite.logo_src
})

const onFinish = () => {
  if (success.value) {
    router.push('/login')
  } else {
    router.push('/signup')
  }
}

onMounted(async () => {
  const { token } = route.params

  if (token) {
    await setLoading(true)
    $api.auth
      .activate(token as string)
      .then(async () => {
        success.value = true
        isLoading.value = true
        await setLoading(false)
      })
      .catch(async () => {
        success.value = false
        isLoading.value = true
        await setLoading(false)
      })
  } else {
    router.push('/signup')
  }
})
</script>

<template>
  <div
    class="login-form flex flex-col items-center mt-260px mb-235px <tablet:px-15px"
  >
    <template v-if="isLoading">
      <NuxtLink to="/">
        <img
          class="logo mb-12px cursor-pointer"
          :src="getImageUrlLogo"
          width="240"
        />
      </NuxtLink>
      <template v-if="success">
        <p class="login-form__title mb-30px text-18px leading-22px">
          {{ $t('pages.activate.title_success') }}
        </p>
        <p class="login-form__complete mb-20px mt-17px text-16px leading-22px">
          {{ $t('pages.activate.desc_success1') }} <br />
          {{ $t('pages.activate.desc_success2') }} <br />
          {{ $t('pages.activate.desc_success3') }} <br />
        </p>
        <div class="mt-75px flex justify-center w-full">
          <Button
            class="w-400px <mobile:w-full"
            :size="`large`"
            :label="$t('pages.activate.button_success')"
            @click="onFinish"
          ></Button>
        </div>
      </template>
      <template v-else>
        <p class="login-form__title mb-30px text-18px leading-22px">
          {{ $t('pages.activate.title_fail') }}
        </p>
        <p
          class="login-form__complete mb-20px mt-17px text-16px leading-22px w-400px <mobile:w-full"
        >
          {{ $t('pages.activate.desc_fail1') }} <br />
          {{ $t('pages.activate.desc_fail2') }} <br />
        </p>

        <div class="mt-75px flex justify-center w-full">
          <Button
            class="w-400px <mobile:w-full"
            :size="`large`"
            :label="$t('pages.activate.button_fail')"
            @click="onFinish"
          ></Button>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.login-form {
  &__title {
    color: $color_black2;
  }

  &__complete {
    color: $color_black2;
  }
}
</style>
