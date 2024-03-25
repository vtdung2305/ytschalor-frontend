import HttpFactory from '../factory'
import { IVideoParams, IVideoItem } from '@/interfaces/video'
import { serialize } from '@/helper/common'

class VideoModule extends HttpFactory {
  private config = useRuntimeConfig()

  async getListVideo(params: IVideoParams): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/analysis/videos/`,
      undefined,
      {
        params: {
          ...params,
        },
      }
    )
  }

  async getVideoDetail(id: string): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${this.config.public.apiVer}/analysis/videos/${id}`
    )
  }

  async keywordAnalysis(params: Object): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/analysis/keyword-analysis`,
      params
    )
  }

  async keywordTrendSuggestions(params: Object): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${
        this.config.public.apiVer
      }/analysis/keyword-trend-suggestions?${serialize(params)}`
    )
  }

  async keywordToolTrendSuggestions(
    params: Object
  ): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'GET',
      `${
        this.config.public.apiVer
      }/analysis/tool-keyword-trend-suggestions?${serialize(params)}`
    )
  }

  async interestOverTime(params: Object): Promise<Object | null | any> {
    return await this.call<Object | null | any>(
      'POST',
      `${this.config.public.apiVer}/analysis/interest-over-time`,
      params
    )
  }

  async exportVideo(params: {
    data: IVideoItem[]
    keyword: string
  }): Promise<Object | null | any> {
    return await this.call<Object[] | null | any>(
      'POST',
      `${this.config.public.apiVer}/analysis/videos/export`,
      params
    )
  }
}

export default VideoModule
