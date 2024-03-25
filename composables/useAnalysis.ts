import { useVideo } from '@/stores/video'
import { IKeywordAnalysis } from '@/interfaces/video'

export const useAnalysis = () => {
  const analysisTitleLists = ref<IKeywordAnalysis[]>([])

  const analysisDescriptionLists = ref<IKeywordAnalysis[]>([])

  const analysisVideoChannelLists = ref<IKeywordAnalysis[]>([])

  const trendSuggestLists = ref<string[]>([])

  const toolTrendSuggestLists = ref<string[]>([])

  const analysisKeyword = async (keywordsArr: string[]) => {
    try {
      // console.log(keywords)

      const params = {
        keywords: keywordsArr,
      }

      const { $api } = useNuxtApp()

      const res = await $api.video.keywordAnalysis(params)

      // console.log(res)

      if (res && res.data) {
        analysisTitleLists.value = res.data[0]?.analysis
        if (res.data.length > 1) {
          analysisDescriptionLists.value = res.data[1]?.analysis
        }
      }
    } catch (error) {
      throw { message: error }
    }
  }

  const analysisKeywordVideoChannel = async (keywordsArr: string[]) => {
    try {
      // console.log(keywords)

      const params = {
        keywords: keywordsArr,
      }

      const { $api } = useNuxtApp()

      const res = await $api.video.keywordAnalysis(params)

      // console.log(res)

      if (res && res.data) {
        analysisVideoChannelLists.value = res.data[0].analysis
        if (res.data.length > 1) {
          analysisDescriptionLists.value = res.data[1].analysis
        }
      }
    } catch (error) {
      throw { message: error }
    }
  }

  const trendSuggestions = async (word: string) => {
    try {
      const params = {
        keyword: word,
      }

      const { $api } = useNuxtApp()

      const res = await $api.video.keywordTrendSuggestions(params)

      // console.log(res)

      if (res && res.data) {
        trendSuggestLists.value = res.data
        // analysisTitleLists.value = res.data[0].analysis
        // if (res.data.length > 1) {
        //   analysisDescriptionLists.value = res.data[1].analysis
        // }
      }
    } catch (error) {
      throw { message: error }
    }
  }

  const toolTrendSuggestions = async (word: string) => {
    try {
      const params = {
        keyword: word,
      }

      const { $api } = useNuxtApp()

      const res = await $api.video.keywordToolTrendSuggestions(params)

      // console.log(res)

      if (res && res.data) {
        toolTrendSuggestLists.value = res.data
        // analysisTitleLists.value = res.data[0].analysis
        // if (res.data.length > 1) {
        //   analysisDescriptionLists.value = res.data[1].analysis
        // }
      }
    } catch (error) {
      // console.log(error)

      throw { message: error }
    }
  }

  return {
    analysisTitleLists,
    analysisDescriptionLists,
    analysisVideoChannelLists,
    trendSuggestLists,
    toolTrendSuggestLists,
    analysisKeyword,
    trendSuggestions,
    toolTrendSuggestions,
    analysisKeywordVideoChannel,
  }
}
