export type Props  = {
  title: string
  date?: string
  titleColor?: 'primary' | 'success'
  titleLink?: string
  difference?: string | undefined
  subtitle?: string | undefined
  info: string
  options?: any
  toggleTitle?: string
  modelValue?: any
  listType?: 'items' | 'files'
  type?: 'default' | 'list'
  list?: any
  popper?: any
  fixedHeader?: boolean
  icon: string
  iconType: 'full' | 'small'
  bottom: 'dropdown' | 'link' | 'none'
}
