import { IItemObject } from '@/interfaces/common'
import { IHistoryItem } from '@/interfaces/history'

export const SearchTypeLists: IItemObject[] = [
  {
    value: 'search_all',
    label: 'components.search_type.all',
  },
  {
    value: 'search_video',
    label: 'components.search_type.search_video',
  },
  {
    value: 'search_channel',
    label: 'components.search_type.search_channel',
  },
]

export const HistoriesKeywordSample: IHistoryItem[] = [
  {
    id: 1344,
    user_id: 126,
    word: 'english',
    search_type: 'search_video',
    search_datetime: '2023-11-05 17:43:25',
  },
  {
    id: 1345,
    user_id: 126,
    word: 'english singsing',
    search_type: 'search_channel',
    search_datetime: '2023-11-05 17:43:56',
  },
  {
    id: 1358,
    user_id: 126,
    word: 'a',
    search_type: 'search_video',
    search_datetime: '2023-11-05 23:35:18',
  },
  {
    id: 1359,
    user_id: 126,
    word: 'h',
    search_type: 'search_channel',
    search_datetime: '2023-11-05 23:45:07',
  },
  {
    id: 1361,
    user_id: 126,
    word: 'hoa c\u1ECF lau',
    search_type: 'search_video',
    search_datetime: '2023-11-06 11:34:43',
  },
  {
    id: 1362,
    user_id: 126,
    word: 'h\u00E0nh tr\u00ECnh r\u1EF1c r\u1EE1',
    search_type: 'search_video',
    search_datetime: '2023-11-06 11:35:43',
  },
  {
    id: 1363,
    user_id: 126,
    word: 'a',
    search_type: 'search_video',
    search_datetime: '2023-11-06 14:59:31',
  },
  {
    id: 1364,
    user_id: 126,
    word: 'a',
    search_type: 'search_video',
    search_datetime: '2023-11-06 15:00:32',
  },
  {
    id: 1365,
    user_id: 126,
    word: 'a',
    search_type: 'search_video',
    search_datetime: '2023-11-06 15:01:40',
  },
  {
    id: 1366,
    user_id: 126,
    word: 'hoang luan',
    search_type: 'search_video',
    search_datetime: '2023-11-06 16:11:07',
  },
]
