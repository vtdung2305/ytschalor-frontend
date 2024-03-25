import HttpFactory from '../factory'
import {
  IParamsSearchChannel,
  IVideoByChannelParams,
  IChannel,
} from '@/interfaces/channel'

class ChannelModule extends HttpFactory {
  private config = useRuntimeConfig()

  async searchChannel(filter: any): Promise<Object[] | null | any> {
    for (const [key, value] of Object.entries(filter)) {
      if (!value || value === 'null') {
        delete filter[key]
      }
    }

    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/analysis/channels`,
      undefined,
      {
        params: {
          ...filter,
        },
      }
    )
  }

  async getChannelDetail(id: string): Promise<Object[] | null | any> {
    return await this.call<Object[] | null | any>(
      'GET',
      `${this.config.public.apiVer}/analysis/channels/${id}`
    )
  }

  async getListVideoByChannel(
    params: IVideoByChannelParams
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/analysis/videos-channel/`,
      undefined,
      {
        params: {
          ...params,
        },
      }
    )
  }

  async exportChannel(params: {
    data: IChannel[]
    keyword: string
  }): Promise<Object | null | any> {
    return await this.call<Object[] | null | any>(
      'POST',
      `${this.config.public.apiVer}/analysis/channels/export`,
      params
    )
  }
}

export default ChannelModule
