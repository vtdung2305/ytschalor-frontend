import { useI18n } from 'vue-i18n'
import { useVideo } from '@/stores/video'
import { IFormSearchParams, IFormSortVideo } from '@/interfaces/video'

export const useVideoInfo = () => {
  const videoStore = useVideo()

  const isLoading = ref<Boolean>(false)

  const currentFilter = ref<number>(0)

  const searchVideo = async (params: IFormSearchParams): Promise<void> => {
    await videoStore.getVideos(params)
  }

  const getVideoDetail = async (videoId: string): Promise<void> => {
    await videoStore.getVideoDetail(videoId as string)
  }

  const handleFilterVideo = async (params: IFormSortVideo): Promise<void> => {
    await videoStore.filterVideo(params)
  }

  const videoLists = computed(() => videoStore.videoLists)

  const countFilter = computed((): number => {
    if (!videoStore.videoLists.length) return 0
    return videoStore.videoLists.length
  })

  const countVideos = computed(() => videoStore.countVideos)

  const videoIncludes = computed(() => videoStore.videoIncludes)

  const videoDetail = computed(() => videoStore.videoDetail)

  const isSearching = computed((): boolean => !!isLoading.value)

  return {
    searchVideo,
    handleFilterVideo,
    getVideoDetail,
    videoLists,
    videoIncludes,
    isSearching,
    isLoading,
    countFilter,
    videoDetail,
    countVideos,
  }
}
