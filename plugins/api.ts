import { $fetch, FetchOptions } from 'ohmyfetch'
import { defineNuxtPlugin } from '#app'
import AuthModule from '@/repositories/modules/auth'
import UserModule from '@/repositories/modules/user'
import ChannelModule from '@/repositories/modules/channel'
import VideoModule from '@/repositories/modules/video'
import UploadModule from '@/repositories/modules/upload'

/** ApiInstance interface provides us with good typing */
interface IApiInstance {
  auth: AuthModule
  user: UserModule
  channel: ChannelModule
  video: VideoModule
  upload: UploadModule
}

export default defineNuxtPlugin((nuxtApp) => {
  const fetchOptions: FetchOptions = {}

  /** create a new instance of $fetcher with custom option */
  const apiFetcher = $fetch.create(fetchOptions)

  /** an object containing all repositories we need to expose */
  const modules: IApiInstance = {
    auth: new AuthModule(apiFetcher),
    user: new UserModule(apiFetcher),
    channel: new ChannelModule(apiFetcher),
    video: new VideoModule(apiFetcher),
    upload: new UploadModule(apiFetcher),
  }

  return {
    provide: {
      api: modules,
    },
  }
})
