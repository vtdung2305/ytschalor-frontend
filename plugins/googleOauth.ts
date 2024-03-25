import GAuth from 'vue3-google-oauth2'
import { SCOPE_GOOGLE } from '@/constants/common'

export default defineNuxtPlugin(({ vueApp }) => {
  const config = useRuntimeConfig()

  const gAuthOptions = {
    clientId: config.public.clientId,
    scope: SCOPE_GOOGLE,
    prompt: 'select_account',
    fetch_basic_profile: false,
    ux_mode: 'popup',
    plugin_name: 'chat',
  }

  vueApp.use(GAuth, gAuthOptions)
})
