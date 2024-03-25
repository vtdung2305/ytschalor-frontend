export interface IHistoryParams {
  date_from?: string | null
  date_to?: string | null
  search_type: string | null
  periodOfTime?: string[] | null
  page_no?: number
  page_size?: number
  total_page?: number
  count?: number
}

export interface IHistoryItem {
  id: string | number
  user_id: string | number
  word: string | null
  search_type: string
  search_datetime: string
}
