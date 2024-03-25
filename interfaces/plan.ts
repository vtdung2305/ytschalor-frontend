export interface IPlanDetail {
  compareable_videos_count: number
  daily_search_limit: number
  export_csv_permission: number
  keyword_search_history: number
  keyword_suggestion_last_updated: number
  keyword_suggestions_per_day: number
  linked_to_google_trends: number
  max_members: number
  max_results_display: number
  plan_id: number
  suggestions_per_day: number
  trend_links_count: number
}

export interface IPlan {
  amount: string | number
  currency: string
  interval: string | null
  name: string
  plan_type: string
  status: number
  plan_detail: IPlanDetail
}
