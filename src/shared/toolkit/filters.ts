import { injectable } from 'inversify'
import _ from 'lodash'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ru'

import validatorRegExpImpl from '~/src/shared/toolkit/validator'

dayjs.extend(utc)
dayjs.extend(isBetween)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(relativeTime)

// dayjs.locale('ru')

export interface IFiltersPack {
  dayjs(date?: Date | string): dayjs.Dayjs | any

  dayjsObject: dayjs.Dayjs | any

  rounded(value: unknown): unknown

  roundedFixed(value: unknown): unknown

  convertValue(value: unknown): unknown

  cloneDeep(value: unknown): unknown

  maxBy(array: [], iteratee: string)

  head(value: Array<any>): any

  merge(object: object, other: object): Object

  isEqual(object: object, other: object): boolean

  isEmpty(object: object): boolean

  get(object: object, path: string | [], defaultValue?: string): any

  pick(object: object, paths: []): Pick<object, never>

  omit(object: object, paths: string[]): Omit<object, never>

  omitBy(object: object, predicate: Function): object

  find(collection: object | Array<any>, predicate: any, fromIndex?: number): any

  findIndex(collection: Array<any>, predicate: any, fromIndex?: number): any

  filter(collection: object | Array<any>, predicate: any): any

  sortBy(object: object | Array<any>, iteratees: Array<any>): any

  orderBy(object: object | Array<any>, iteratees: Array<any>, orders: Array<any>): any

  replace(string: string, pattern: RegExp | string, replacement: any): any

  capitalize(string: string): string

  random(number: number, number: number): number

  uuid(): any

  idempotenceKey(): any

  readCookie(name: string): string | null

  validateRegExp(_propLupForValidation: object, _propCustomValidation: object): any

  validatePropStringByArray(valueProp: string, variants: string[]): boolean

  setAtomClassByProp(propValue: string | undefined, variants: string[], atomBaseClass: string): string | undefined

  getCountHiddenOutsideWindow(element: HTMLElement): {
    top: number
    left: number
    bottom: number
    right: number
  }

  getLocalDateByMoscowTime(date?: Date | string): number

  getMoscowDate(date?: Date | string): Date

  replaceByMasks(str: string, masks: Record<string, string | number> | null): string
}

@injectable()
export default class FiltersPack implements IFiltersPack {
  readonly name = 'filters-pack'

  dayjs(date?: Date | string) {
    return dayjs(date)
  }

  dayjsObject() {
    return dayjs
  }

  rounded(num: number, n: number = 0, x: number = 3) {
    if (!num) {
      return 0
    }

    const number = Number(num)

    if (!number) {
      return 0
    }

    const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')'
    return number.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,').replace(/\.0+$/, '')
  }

  roundedFixed(num: number, n: number = 0, x: number = 3) {
    if (!num) {
      return 0
    }

    const number = Number(num)

    if (!number) {
      return 0
    }

    const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')'
    return number.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  convertValue(sum) {
    const value = localStorage.getItem('display-currency') || 'btc'
    let numberSum = sum

    if (typeof numberSum === 'string') {
      numberSum = numberSum.replace(/,/g, '')
    }
    let uni = ''
    if (value === 'btc') {
      uni = `<i class='a-icons icon-mono--btc-uni convert-icon' aria-hidden='true' ></i>`
      return `${uni} ${numberSum}`
    } else {
      uni = `<i class='a-icons icon-mono--satoshi-uni convert-icon' aria-hidden='true' ></i>`
      return `${uni} ${this.rounded(numberSum * 100000000)}`
    }
  }

  cloneDeep(value: unknown) {
    return _.cloneDeep(value)
  }

  maxBy(array: [], iteratee: string) {
    return _.maxBy(array, iteratee)
  }

  head(value: Array<any>) {
    return _.head(value)
  }

  kebabCase(value: string) {
    return _.kebabCase(value)
  }

  merge(object: object, other: object) {
    return _.merge(object, other)
  }

  isEqual(object: object, other: object) {
    return _.isEqual(object, other)
  }

  isEmpty(object: object) {
    return _.isEmpty(object)
  }

  get(object: object, path: string | [], defaultValue?: string) {
    const result = object == null ? undefined : _.get(object, path)
    return result === undefined ? defaultValue : result
  }

  pick(object: object, paths: []) {
    return _.pick(object, paths)
  }

  omit(object: object, paths: string[]) {
    return _.omit(object, paths)
  }

  omitBy(object: object, predicate: Function) {
    return _.omitBy(object, predicate)
  }

  find(collection: object | Array<any>, predicate: any, fromIndex?: number) {
    return _.find(collection, predicate, fromIndex)
  }

  findIndex(collection: Array<any>, predicate: any, fromIndex?: number) {
    return _.findIndex(collection, predicate, fromIndex)
  }

  filter(collection: object | Array<any>, predicate: any) {
    return _.filter(collection, predicate)
  }

  sortBy(collection: object | Array<any>, iteratees: Array<any>) {
    return _.sortBy(collection, iteratees)
  }

  orderBy(collection: object | Array<any>, iteratees: Array<any>, orders: Array<any>) {
    return _.orderBy(collection, iteratees, orders)
  }

  replace(string: string, pattern: RegExp | string, replacement: any) {
    return _.replace(string, pattern, replacement)
  }

  debounce(func: (...args: any) => any, wait: number | undefined) {
    return _.debounce(func, wait)
  }

  capitalize(str) {
    return _.capitalize(str)
  }

  random(str) {
    return _.random(str)
  }

  uuid() {
    // @ts-ignore
    if (process.client) {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (crypto?.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
      )
    } else {
      return null
    }
  }

  idempotenceKey() {
    if (process.client) {
      const randomUuid = crypto.randomUUID()
      return this.replace(randomUuid, /[/-]/g, '').substring(0, 20)
    } else {
      return null
    }
  }

  readCookie(name: string) {
    const nameEQ = `${name}=`
    const ca = document.cookie.split(';').reverse()
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length)
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length)
      }
    }
    return null
  }

  validateRegExp(_propLupForValidation: object, _propCustomValidation: object) {
    return validatorRegExpImpl(_propLupForValidation, _propCustomValidation)
  }

  validatePropStringByArray(valueProp: string, variants: string[]) {
    if (!valueProp) return true
    const textProp = valueProp.trim().toLowerCase()
    return variants.includes(textProp)
  }

  setAtomClassByProp(propValue: string | undefined, variants: string[], atomBaseClass: string) {
    if (!propValue) return
    const propText = propValue ? propValue.trim().toLowerCase() : ''
    const defaultClass = variants[0]
    return variants.includes(propText) ? `${atomBaseClass}--${propText}` : `${atomBaseClass}--${defaultClass}`
  }

  getCountHiddenOutsideWindow(element: HTMLElement) {
    const elementRect = element.getBoundingClientRect()
    return {
      top: Math.max(0, 0 - elementRect.top),
      left: Math.max(0, 0 - elementRect.left),
      bottom: Math.max(0, elementRect.bottom - window.innerHeight),
      right: Math.max(0, elementRect.right - window.innerWidth),
    }
  }

  getLocalDateByMoscowTime(date: Date = new Date()): number {
    const timezoneOffset = new Date().getTimezoneOffset()
    const moscowTimezone = 180
    return dayjs(date).add(-moscowTimezone, 'minutes').add(-timezoneOffset, 'minutes').valueOf()
  }

  // @ts-ignore
  getMoscowDate(date: Date = new Date()) {
    return dayjs.tz?.(new Date(date), 'Europe/Moscow').$d
  }

  replaceByMasks(str = '', masks: Record<string, string | number> | null = null): string {
    let res = str

    if (masks) {
      for (const mask in masks) {
        res = res.replace(new RegExp(`{{ ${mask} }}`), String(masks[mask]))
      }
    }

    return res
  }
  trimSpaceIntoString (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
}
