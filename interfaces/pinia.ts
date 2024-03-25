import { Pinia, Store } from 'pinia'

export interface ExtendedPinia extends Pinia {
  _s: Map<string, Store>
}
