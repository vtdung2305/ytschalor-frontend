import { IVideoItem } from '@/interfaces/video'

export function filterChannelVideo(items: IVideoItem[], params: number[]) {
  // console.log(params)

  if (!params.length) {
    return items
  } else if (params.length === 1) {
    if (params[0] === 50000) {
      return items.filter(
        (item) => item.channel_detail.subscriberCount >= params[0]
      )
    } else {
      return items.filter(
        (item) => item.channel_detail.subscriberCount <= params[0]
      )
    }
  } else {
    return items.filter(
      (item) =>
        item.channel_detail.subscriberCount >= params[0] &&
        item.channel_detail.subscriberCount <= params[1]
    )
  }
}
