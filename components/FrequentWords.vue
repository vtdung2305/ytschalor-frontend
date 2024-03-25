<script setup lang="ts">
import { PropType } from 'vue'
import { IVideoInfo, IKeywordAnalysis } from '@/interfaces/video'
import { IParamsPagination, INotification } from '@/interfaces/common'
import { PaginationEnum } from '@/constants/common'
import { ErrorCodeEnum } from '@/constants/video'

const props = defineProps({
  items: {
    type: Array as PropType<IKeywordAnalysis[]>,
    default: () => [],
  },
  isError: {
    type: Boolean,
    default: false,
  },
})

const { t } = useLang()

const selectKeyword = ref<string[]>(['noun'])

const options = [
  { label: t('components.frequentwords.noun'), value: 'noun' },
  { label: t('components.frequentwords.verb'), value: 'verb' },
  { label: t('components.frequentwords.adjective'), value: 'adjective' },
  { label: t('components.frequentwords.other'), value: 'other' },
]

const keywordsFilter = ref<IKeywordAnalysis[]>([])

const keywords = ref<IKeywordAnalysis[]>([])

const openModal = ref<boolean>(false)

const selectWord = ref<IKeywordAnalysis>()

const isLoading = ref<boolean>(false)

const params = reactive({
  page: PaginationEnum.PAGE,
  per_page: PaginationEnum.PER_PAGE,
})

const { isPlanFree, showNotification } = useHelper()

const { trendSuggestLists, trendSuggestions } = useAnalysis()

const filterKeyword = () => {
  const page = params.page // 1

  const perPage = params.per_page // 10

  const from = page * perPage - perPage

  const to = page * perPage

  keywordsFilter.value = props.items
    .filter((e) => selectKeyword.value.includes(e.type))
    .sort((a, b) => b.count - a.count)
  keywords.value = props.items
    .filter((e) => selectKeyword.value.includes(e.type))
    .sort((a, b) => b.count - a.count)
    .slice(from, to)
}

const onChange = (page: number) => {
  params.page = page
  filterKeyword()
}

const handleSuggestWord = (item: IKeywordAnalysis) => {
  isLoading.value = true
  openModal.value = true
  selectWord.value = item
  const timeout = isPlanFree.value ? 3000 : 1

  setTimeout(async () => {
    await trendSuggestions(selectWord.value?.keyword as string)
      .then(() => {})
      .catch((e) => {
        if (
          e?.message?._data?.error_code ===
          ErrorCodeEnum.SUGGESTION_KEYWORD_LIMIT_EXCEEDED
        ) {
          openModal.value = false
          const params = {
            description: e?.message?._data?.message,
            duration: 4.5,
            icon: true,
            status: false,
          }

          showNotification(params as INotification)
        }
      })
    isLoading.value = false
  }, timeout)
}

const emit = defineEmits(['reload', 'callback'])

watch(
  selectKeyword,
  (newVal) => {
    if (newVal) {
      params.page = PaginationEnum.PAGE
      filterKeyword()
    }
  },
  {
    deep: true,
  }
)

onMounted(() => {
  filterKeyword()
})
</script>

<template>
  <div class="word">
    <div class="word-head flex justify-between <tablet:flex-col">
      <div class="text-18px <tablet:mb-20px">
        {{ $t('components.frequentwords.title') }}
      </div>
      <div class="flex">
        <FormCheckboxGroup
          v-model="selectKeyword"
          :options="options"
          class="ml-8px"
          :disabled="!items.length"
        ></FormCheckboxGroup>
      </div>
    </div>
    <div v-if="items.length">
      <template v-if="keywords.length > 0">
        <div>
          <table class="word-table">
            <tbody>
              <tr v-for="(item, index) in keywords" :key="index">
                <td class="w-200px">
                  <template v-if="params.page === 1">
                    {{ index + 1 }}.
                  </template>
                  <template v-else>
                    {{ index < 9 ? params.page - 1 : ''
                    }}{{
                      index < 9
                        ? index + 1
                        : parseInt((index + 1) * params.page)
                    }}.
                  </template>
                  {{ item.keyword }}
                </td>
                <td class="<tablet:w-70px">
                  {{ item.count }}{{ $t('components.units.time') }}
                </td>
                <td>
                  <a class="c-link" @click="handleSuggestWord(item)">
                    {{ $t('components.frequentwords.see_suggestions') }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-center mt-56px">
          <Pagination
            v-model="params.page"
            :total="keywordsFilter.length"
            :default-page-size="PaginationEnum.PER_PAGE"
            @onChange="onChange"
          ></Pagination>
        </div>
      </template>
      <template v-else>
        <NoData :message="$t('others.no_data2')"></NoData>
      </template>
    </div>
    <div v-else>
      <div v-if="!isError" class="flex h-400px items-center justify-center">
        <p class="text-center leading-28px">
          {{ $t('components.frequentwords.error_loading') }}<br />{{
            $t('components.frequentwords.msg_1')
          }}<span class="reload" @click="$emit('callback')">{{
            $t('components.frequentwords.link')
          }}</span
          >{{ $t('components.frequentwords.msg_2') }}
        </p>
      </div>
      <template v-else>
        <NoData :message="$t('others.no_data2')"></NoData>
      </template>
    </div>
    <div class="mt-40px">
      {{ $t('components.frequentwords.note') }}
    </div>
    <ModalSuggest
      v-if="openModal"
      v-model="openModal"
      :is-loading="isLoading"
      :closable="false"
      :title="
        $t('components.modal_suggest.title', {
          word: selectWord.keyword,
        })
      "
    >
      <div class="modal-body">
        <div class="flex gap-x-6px">
          <Popover
            :title="``"
            :is-show-content="false"
            :theme="`outlined`"
            :placement="`topLeft`"
          />
          <div class="content <tablet:text-justify">
            <p>
              <span class="text-16px">{{
                $t('components.modal_suggest.desc_one')
              }}</span
              ><br />
              {{ $t('components.modal_suggest.desc_two') }}<br />
              {{ $t('components.modal_suggest.desc_three') }}
            </p>
          </div>
        </div>
        <div class="suggest-lists mt-26px h-300px overflow-y-auto">
          <ul class="flex flex-col gap-y-18px">
            <li
              v-for="(trend, index) in trendSuggestLists"
              :key="index"
              class="text-16px"
            >
              {{ trend }}
            </li>
          </ul>
        </div>
        <div class="action mt-70px text-center">
          <a class="c-link" @click="openModal = false">{{
            $t('common.close')
          }}</a>
        </div>
      </div>
    </ModalSuggest>
  </div>
</template>

<style lang="scss" scoped>
.word {
  &-head {
    padding-bottom: 7px;
    border-bottom: 1px solid $color_gray1;
  }

  &-table {
    margin-top: 8px;
    tbody {
      tr {
        td {
          padding: 13px 0;
          font-size: 16px;
          line-height: 24px;

          &:first-child {
            padding-right: 77px;

            @include mq-down(sp) {
              padding-right: 10px;
            }
          }

          &:nth-child(2) {
            padding-right: 77px;

            @include mq-down(sp) {
              padding-right: 10px;
            }
          }
        }
      }
    }
  }

  &-note {
    font-size: 14px;
    line-height: 24px;
  }
}

:deep(.c-link) {
  font-size: 14px;
}

:deep(.anticon svg) {
  color: $color_gray5;
}

.suggest-lists {
  overflow: auto;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 4px;
    display: block;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
}

.reload {
  cursor: pointer;
  border-bottom: 1px solid $color_blue;
  color: $color_blue;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 0.6;
  }
}
</style>
