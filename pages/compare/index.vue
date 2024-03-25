<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import { MasterSite, REGEX_LOWER_LIMIT } from '@/constants/common'
import { useCompare } from '@/stores/compare'
import { comma } from '@/helper/number'
import { IVideoInfo } from '@/interfaces/video'

// meta
definePageMeta({
  layout: 'page',
})

const { formatDate } = useHelper()

const { t } = useLang()

const router = useRouter()

const getUrlIconLink = computed(() => {
  return MasterSite.icon_link
})

const checkedAll = ref<boolean>(true)

const checkedKeyword = ref<boolean>(false)

const checkedFrequentword = ref<boolean>(false)

const lowerLimit = ref<number>()

const titleList = ref([
  '',
  t('pages.compare.video_title'),
  t('pages.compare.coefficient'),
  t('pages.compare.view'),
  t('pages.compare.high_rating'),
  t('pages.compare.publish_date'),
  t('pages.compare.registrants'),
  t('pages.compare.keyword'),
  t('pages.compare.word'),
])

const formRef = ref()

const formState = reactive<{ lower_limit: number | undefined }>({
  lower_limit: 1,
})

const checkLowerLimit = () => {
  if (checkedFrequentword.value && !formState.lower_limit) {
    return Promise.reject(
      t('common.filed_no_required', {
        field: t('pages.compare.lower_limit'),
      })
    )
  }

  return Promise.resolve()
}

const rules: Record<string, Rule[]> = {
  lower_limit: [
    {
      validator: checkLowerLimit,
    },
    {
      pattern: REGEX_LOWER_LIMIT,
      message: t('common.field_only_number', {
        field: t('components.search_video.judgment_criteria'),
      }),
      trigger: 'change',
    },
  ],
}

const checkedList = ref<string[]>([])

const listCompare = ref<IVideoInfo[]>([])

const compareStore = useCompare()

const handelCompare = () => {
  formRef.value
    .validate()
    .then(() => {
      lowerLimit.value = formState.lower_limit
      listCompare.value = compareStore.listVideoCompare.filter(({ id }) =>
        checkedList.value.includes(id as string)
      )
    })
    .catch(() => {})
}

const onCheckAllChange = (checkedAll: boolean) => {
  if (checkedAll) {
    const newArr = []

    for (let i = 0; i < compareStore.listVideoCompare.length; i++) {
      const dump = compareStore.listVideoCompare[i].id as string

      newArr.push(dump)
    }
    checkedList.value = newArr
  } else {
    checkedList.value = []
  }
}

const uncheckAll = () => {
  checkedList.value = []
}

watch(
  () => checkedList.value,
  (newVal) => {
    checkedAll.value = newVal.length === compareStore.listVideoCompare.length
  }
)

watch(
  () => checkedFrequentword.value,
  () => {
    formState.lower_limit = 1
    formRef.value.validateFields(['lower_limit'])
  },
  { flush: 'post' }
)

const toPageAnalysis = () => {
  router.push(`/analysis`)
}

const toVideoDetail = (id: string) => {
  window.open(`https://www.youtube.com/watch?v=${id}`, '_blank')
}

const getListVideoCompare = () => {
  return compareStore.listVideoCompare
}

onMounted(async () => {
  await getListVideoCompare

  const newArr = []

  for (let i = 0; i < compareStore.listVideoCompare.length; i++) {
    const dump = compareStore.listVideoCompare[i].id as string

    newArr.push(dump)
  }

  checkedList.value = newArr
})
</script>

<template>
  <PageContainer class="compare">
    <PageSection class="flex justify-between items-baseline">
      <h2 class="page-title">{{ $t('pages.compare.title') }}</h2>
      <nuxt-link class="compare__link" @click="toPageAnalysis">
        {{ $t('pages.compare.end_compare') }}
      </nuxt-link>
    </PageSection>
    <PageBody>
      <div class="compare__title text-20px mb-20px mt-3px">
        {{ $t('pages.compare.compare_setting') }}
      </div>
      <div class="mb-6px flex <tablet:flex-col <tablet:items-baseline">
        <FormCheckbox
          v-model="checkedAll"
          :label="$t('pages.compare.check_all')"
          @change="onCheckAllChange(checkedAll)"
        >
        </FormCheckbox>
        <nuxt-link
          class="compare__link ml-16px <tablet:mt-10px <tablet:ml-0"
          @click="uncheckAll"
        >
          {{ $t('pages.compare.uncheck_all') }}
        </nuxt-link>
      </div>
      <a-checkbox-group v-model:value="checkedList">
        <div class="compare__list">
          <div
            v-for="(item, index) in compareStore.listVideoCompare"
            :key="index"
            class="compare__item"
            :class="{ active: checkedList.includes(item.id as string) }"
          >
            <img
              class="w-140px h-80px mb-6px"
              :src="item?.thumbnail?.high ? item?.thumbnail?.high : ''"
              alt=""
            />
            <a-checkbox :value="item.id">
              <a-popover>
                <template #content>
                  {{ item.title }}
                </template>
                {{ item.title }}
              </a-popover>
            </a-checkbox>
          </div>
        </div>
      </a-checkbox-group>

      <a-form ref="formRef" :model="formState" :rules="rules">
        <div
          class="mb-16px mt-16px flex items-baseline <tablet:flex-col <tablet:items-baseline"
        >
          <FormCheckbox
            v-model="checkedKeyword"
            :label="$t('pages.compare.keyword')"
          >
          </FormCheckbox>

          <FormCheckbox
            v-model="checkedFrequentword"
            class="pl-24px <tablet:pl-0 <tablet:mt-4px"
            :label="$t('pages.compare.frequent_words')"
          >
          </FormCheckbox>

          <div class="pl-20px flex items-center <tablet:pl-0 <tablet:mt-4px">
            <a-form-item name="lower_limit">
              <div class="flex">
                <div class="mr-4px">{{ $t('pages.compare.lower_limit') }}</div>
                <a-input-number
                  v-model:value="formState.lower_limit"
                  :min="1"
                  :disabled="!checkedFrequentword"
                />
                <div class="ml-4px">{{ $t('pages.compare.times') }}</div>
              </div>
            </a-form-item>
          </div>
        </div>

        <Button
          class="w-184px mb-16px <laptop:w-full"
          :label="$t('pages.compare.submit')"
          :disabled="!checkedKeyword"
          @click="handelCompare"
        ></Button>
      </a-form>
    </PageBody>

    <PageBody v-if="listCompare.length > 0">
      <div class="compare__title text-20px mb-16px mt-5px">
        {{ $t('pages.compare.comparing_results') }}
      </div>
      <div class="table-box">
        <table>
          <tr v-for="(n, k) in 9" :key="k">
            <th>{{ titleList[k] }}</th>
            <td v-for="(item, index) in listCompare" :key="index">
              <template v-if="k == 0">
                <ImageVideo
                  :width="110"
                  :height="62"
                  :src-thumb="listCompare[index]?.thumbnail.medium"
                  :src-preview="listCompare[index]?.thumbnail?.high"
                />
              </template>
              <template v-else-if="k === 1">
                <p
                  class="compare__tableTitle"
                  @click="toVideoDetail(listCompare[index].id as string)"
                >
                  <span> {{ listCompare[index].title }} </span>
                  <img :src="getUrlIconLink" alt="" />
                </p>
              </template>
              <template v-else-if="k === 2">
                {{ listCompare[index].coefficient }}
              </template>
              <template v-else-if="k === 3">
                {{ comma(listCompare[index].viewCount) }}
              </template>
              <template v-else-if="k === 4">
                {{ comma(listCompare[index].likeCount) }}
              </template>
              <template v-else-if="k === 5">
                {{ formatDate(listCompare[index].publishedAt as string) }}
              </template>
              <template v-else-if="k === 6">
                {{
                  listCompare[index].registrants
                    ? comma(listCompare[index].registrants as number)
                    : $t('others.empty')
                }}
              </template>
              <template v-else-if="k === 7">
                <div
                  v-if="listCompare[index].tags.length > 0"
                  class="flex flex-col items-center"
                >
                  <div
                    v-for="(tag, indexx) in listCompare[index].tags"
                    :key="indexx"
                  >
                    <div class="flex items-center">
                      <span>
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else>
                  {{ $t('others.empty') }}
                </div>
              </template>
              <template v-else-if="k === 8">
                <div class="flex flex-col">
                  <div
                    v-for="(key, indexx) in listCompare[index].titleLists?.filter(
                        (x) => x.count >= lowerLimit! && x.type !== 'other'
                      )"
                    :key="indexx"
                  >
                    {{ key.keyword }}
                  </div>
                </div>
                <div class="flex flex-col">
                  <div
                    v-for="(key, indexx) in listCompare[index].descriptionLists?.filter
                    (item => (!listCompare[index].titleLists?.some
                    (item2 => (item2.keyword === item.keyword)))).filter(
                        (x) => x.count >= lowerLimit! && x.type !== 'other'
                      )"
                    :key="indexx"
                  >
                    {{ key.keyword }}
                  </div>
                </div></template
              >
            </td>
          </tr>
        </table>
      </div>
    </PageBody>
  </PageContainer>
</template>

<style lang="scss" scoped>
.page-title {
  font-size: 20px;
  line-height: 28px;
  font-weight: bold;
  color: $color_black2;
}

.page-section {
  padding-bottom: 24px;
}

.compare {
  color: $color_black2;

  ::-webkit-scrollbar {
    display: block;
    height: 8px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #c8c8c8;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #898989;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &__link {
    color: $color_blue;
    padding-bottom: 4px;
    border-bottom: 1px solid $color_blue;
  }

  &__title {
    color: $color_black2;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    margin-left: -12px;
  }

  &__item {
    margin-left: 12px;
    margin-bottom: 12px;
    background-color: $color_gray1;
    width: 160px;
    height: 124px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 10px;

    @include mq_down(sp) {
      width: 100%;
      height: auto;

      img {
        width: 100%;
        height: 160px;
        object-fit: cover;
      }
    }

    &.active {
      border: 1px solid $color_orange;
      background-color: unset;
    }
  }

  &__table {
    ::-webkit-scrollbar {
      display: block;
      width: 4px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: #c8c8c8;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #898989;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    tr,
    td:not(:last-child) {
      border-bottom: 1px solid $color_gray1;
    }

    th,
    td:not(:first-child) {
      height: 58px;
    }

    td {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &__tableLeft {
    border-right: 1px solid $color_gray1;

    th {
      width: 106px;
      font-size: 16px;
      font-weight: 400;
    }

    tr:first-child {
      border-top: 1px solid $color_gray1;
    }
  }

  &__tableRight {
    tr:not(:last-child) {
      border-right: 1px solid $color_gray1;
    }

    tr {
      border-top: 1px solid $color_gray1;
    }
  }

  &__tableTitle {
    display: flex;
    padding-bottom: 4px;
    cursor: pointer;
    margin: 0 10px;

    span {
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

      &:hover {
        text-decoration: underline;
        text-underline-position: auto;
        text-underline-offset: 4px;
      }
    }

    img {
      margin-left: 8px;
      cursor: pointer;
    }
  }
}

:deep(.ant-input-number .ant-input-number-input) {
  height: 24px;
  width: 70px;
}

:deep(.ant-input-number) {
  width: 70px;
  border-radius: 2px;
}

:deep(.ant-checkbox + span) {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

:deep(.ant-checkbox-group) {
  column-gap: unset;
  white-space: unset;
}

:deep(.ant-checkbox .ant-checkbox-inner) {
  border-radius: 2px;
}

:deep(.ant-form-item) {
  margin-bottom: unset;
}

.table-box {
  overflow-x: scroll;
  padding-bottom: 20px;
}

table {
  border-collapse: collapse;
  table-layout: fixed;
  border: unset;
}

table th {
  min-width: 106px;
  border: 1px solid #d9d9d9;
  border-left: unset;
  text-align: left;
  font-weight: normal;
  font-size: 16px;
}

table td {
  width: 214px;
  min-width: 214px;
  vertical-align: top;
  border: 1px solid #d9d9d9;
  border-right: unset;
  text-align: center;
  padding: 12px 0;
  font-size: 16px;
}

table tr th {
  position: sticky;
  left: -1px;
  background-color: #fff;
  z-index: 9;
}
</style>
