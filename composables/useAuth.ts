import { SCOPE_GOOGLE } from '@/constants/common'
export const useAuth = () => {
  const instance = ref()

  const config = useRuntimeConfig()

  const installClient = () => {
    const apiUrl = 'https://apis.google.com/js/api.js'

    return new Promise<void>((resolve) => {
      const script = document.createElement('script')

      script.src = apiUrl
      script.onreadystatechange = script.onload = function () {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
          setTimeout(function () {
            resolve()
          }, 500)
        }
      }
      document.getElementsByTagName('head')[0].appendChild(script)
    })
  }

  const initClient = () => {
    const params = {
      clientId: config.public.clientId,
      scope: SCOPE_GOOGLE,
      prompt: 'select_account',
      fetch_basic_profile: false,
      ux_mode: 'popup',
      plugin_name: 'chat',
    }

    return new Promise((resolve, reject) => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2
          .init(params)
          .then(() => {
            resolve(window.gapi)
          })
          .catch((error: any) => {
            reject(error)
          })
      })
    })
  }

  const initOauth = async () => {
    await installClient
    initClient()
      .then((gapi: any) => {
        instance.value = gapi.auth2.getAuthInstance()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const signIn = () => {
    return new Promise((resolve, reject) => {
      if (!instance.value) {
        reject(false)
        return
      }
      console.log(instance)

      instance.value
        .signIn()
        .then((googleUser: any) => {
          resolve(googleUser)
        })
        .catch((error: any) => {
          console.log(error)

          reject(error)
        })
    })
  }

  return {
    instance,
    initOauth,
    signIn,
  }
}
