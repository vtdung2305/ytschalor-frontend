import type { ComponentPublicInstance } from 'vue'
import { FunctionalComponent } from 'vue'
import { IconDefinition } from '@ant-design/icons-svg/lib/types'

export interface IMenuItem {
  key?: string
  name: string
  link?: string
  target?: boolean
  component?: FunctionalComponent | IconDefinition | any
  show: boolean
  disabled: boolean
}
