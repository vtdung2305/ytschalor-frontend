<script lang="ts" setup>
import { SearchOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import isNil from 'lodash/isNil'
import maxBy from 'lodash/maxBy'
import { MasterSite } from '@/constants/common'
import { DataWords } from '@/constants/chart'
import { ISuggestion, INotification } from '@/interfaces/common'
import { ErrorCodeEnum, ErrorCode } from '@/constants/video'

const { t } = useLang()

const { notificationDeveloping, showNotification } = useHelper()

const formStateSuggestions = reactive({
  keyword: '',
})

const formSuggestions = ref()

const { toolTrendSuggestLists, toolTrendSuggestions } = useAnalysis()

const rules: Record<string, Rule[]> = {
  keyword: [
    {
      required: true,
      message: t('common.filed_no_required', {
        field: '単語',
      }),
    },
  ],
}

const isSearching = ref<boolean>(false)

const breadcrumbs = ref<ISuggestion[]>([])

// const onFinish = () => {
//   formSuggestions.value
//     .validate()
//     .then(() => {
//       notificationDeveloping()
//     })
//     .catch(() => {})
// }

const dataWord = computed(() => {
  if (!toolTrendSuggestLists.value.length) return []
  return toolTrendSuggestLists.value.map((e: any, index: any) => {
    return {
      key: e,
      value: index,
    }
  })
})

const handleSuggestKeyword = (
  label: string,
  isPush: boolean = true,
  isReset: boolean = false
) => {
  formSuggestions.value
    .validate()
    .then(async () => {
      isSearching.value = true

      await toolTrendSuggestions(label as string)
      isSearching.value = false

      if (isReset) {
        breadcrumbs.value = []
        breadcrumbs.value.push({
          value: 0,
          label,
        })
      } else {
        const max = maxBy(breadcrumbs.value, 'value')?.value

        const maxIndex = !isNil(max) ? max + 1 : 0

        if (isPush) {
          breadcrumbs.value.push({
            value: maxIndex,
            label,
          })
        }
      }
    })
    .catch((e: any) => {
      isSearching.value = false
      // console.log(e)
      if (ErrorCode.includes(e?.message?._data?.error_code)) {
        const params = {
          description: e?.message?._data?.message,
          duration: 4.5,
          icon: true,
          status: false,
        }

        showNotification(params as INotification)
      }
    })
}

const handleClickWordChart = async (label: string) => {
  await handleSuggestKeyword(label as string)
}

const handleClickKeyword = async (item: ISuggestion) => {
  const breadcrumb = breadcrumbs.value.find(
    (e) => e.label === item.label && e.value === item.value
  )

  if (breadcrumb) {
    breadcrumbs.value = breadcrumbs.value.filter((e) => e.value <= item.value)
  }
  await handleSuggestKeyword(item.label as string, false)
}
</script>

<template>
  <PageBody>
    <a-form ref="formSuggestions" :model="formStateSuggestions" :rules="rules">
      <div class="flex items-end <laptop:flex-col">
        <div class="w-400px <laptop:w-full">
          <FormLabel :label="$t('pages.suggestions.key_work')" />
          <FormAutoComplete
            v-model="formStateSuggestions.keyword"
            :placeholder="$t('pages.suggestions.placeholder')"
            :name="'keyword'"
            :size="'large'"
            :is-disabled="isSearching"
          >
          </FormAutoComplete>
        </div>

        <Button
          class="w-192px ml-24px mb-26px <laptop:w-full"
          :label="$t('pages.suggestions.button')"
          :icon="SearchOutlined"
          :disabled="isSearching"
          @click="
            handleSuggestKeyword(formStateSuggestions.keyword, true, true)
          "
        ></Button>
      </div>
    </a-form>

    <div class="flex items-start">
      <Popover
        :class="`text-22px`"
        :title="$t('pages.subaccounts.pop_title')"
        :content="`${$t('pages.subaccounts.pop_desc_one')}<br>${$t(
          'pages.subaccounts.pop_desc_two'
        )}`"
        :theme="`outlined`"
        :placement="`topLeft`"
        :is-show-content="false"
      />
      <!-- <img class="mt-5px" :src="MasterSite.icon_note" alt="" /> -->
      <div class="ml-5px suggestions__note">
        {{ $t('pages.suggestions.note1') }}<br />
        <p class="text-14px leading-normal">
          {{ $t('pages.suggestions.note2') }} <br />
          {{ $t('pages.suggestions.note3') }}
        </p>
      </div>
    </div>
  </PageBody>

  <PageBody>
    <div class="suggestions__note">
      {{ $t('pages.suggestions.note4') }}<br />
      {{ $t('pages.suggestions.note5') }}
    </div>

    <div v-if="dataWord.length" class="word-chart mt-20px">
      <div class="breadcrumbs-keyword">
        <ul class="flex flex-wrap items-center">
          <li
            v-for="(breadcrumb, index) in breadcrumbs"
            :key="index"
            :class="index !== breadcrumbs.length - 1 ? 'allow' : 'not-allow'"
            @click="handleClickKeyword(breadcrumb)"
          >
            {{ breadcrumb.label }}
          </li>
        </ul>
      </div>
      <template v-if="isSearching">
        <SearchLoading class="h-532px" />
      </template>
      <template v-else>
        <WordChart :chart-data="dataWord" @on-click="handleClickWordChart" />
      </template>
    </div>
    <NoData v-else />

    <!-- <Development></Development> -->
  </PageBody>
</template>

<style lang="scss" scoped>
.suggestions {
  &__note {
    font-size: 16px;
    line-height: 180%;
  }
}

.breadcrumbs-keyword {
  padding-bottom: 11px;

  ul {
    li {
      font-size: 16px;
      line-height: 30px;
      color: $color_gray5;

      &:hover {
        text-underline-position: under;
        text-decoration: underline;
      }

      &:not(:first-child) {
        &::before {
          content: '→';
          font-size: 18px;
          display: inline-block;
          vertical-align: -1px;
          margin: 0 8px;
        }
      }
    }
  }
}

.not-allow {
  pointer-events: none;
  color: $color_black2 !important;
}

.allow {
  cursor: pointer;
  pointer-events: auto;
}

:deep(.popover .anticon svg) {
  font-size: 22px;
  color: $color_gray5;
}
</style>
