import {AsYouType, parsePhoneNumberFromString} from 'libphonenumber-js/mobile'

const COUNTRY_ISO_DEFAULT = 'RU'

function internationalFormatter(value: string, country: object): string {
  const phoneWithoutPlus = value.startsWith('+') ? value.slice(1) : value
  const phoneNumber = parsePhoneNumberFromString(phoneWithoutPlus, country)

  if (phoneNumber && phoneNumber.isValid()) {
    return phoneNumber.formatInternational()
  }

  return new AsYouType(country).input(value)
}

function localFormatter(value: string, country: object): string {
  const phoneWithoutPlus = value.startsWith('+') ? value.slice(1) : value
  const phoneNumber = parsePhoneNumberFromString(phoneWithoutPlus, country)

  if (phoneNumber && phoneNumber.isValid()) {
    return phoneNumber.formatInternational()
  }

  return new AsYouType(country).input(value)
}

function handleDeletion(value: string, selectionStart: number, event: InputEvent): string {
  const newValue = value.slice()

  if (event?.inputType === 'deleteContentBackward' && isSpaceAround(newValue, selectionStart - 1, -1)) {
    return newValue.slice(0, selectionStart - 1) + newValue.slice(selectionStart)
  } else if (event?.inputType === 'deleteContentForward' && isSpaceAround(newValue, selectionStart, 1)) {
    return newValue.slice(0, selectionStart) + newValue.slice(selectionStart + 1)
  }

  return newValue
}

function isSpaceAround(value: string, index: number, offset: number): boolean {
  return value[index] === ' ' || value[index + offset] === ' '
}

function getUpdatedValue(value: string, formattedNumber: string | null): string {
  if (formattedNumber) {
    return formattedNumber
  }

  const updatedValue = value.replace(/[^+0-9 ()]/gi, '')
  return updatedValue.substring(0, 1) + updatedValue.substring(1).replace(/[+]/gi, '')
}

function updateInputValue(element: HTMLInputElement, value: string, saveCaret: boolean): void {
  const {selectionStart} = element
  element.value = value
  element.setSelectionRange(
    saveCaret ? selectionStart! - 1 : value.length,
    saveCaret ? selectionStart! - 1 : value.length,
  )
  element.dispatchEvent(new Event('change'))
  element.dispatchEvent(new Event('input'))
}

function setInputEventListeners(element: HTMLInputElement, binding: any): void {
  const country = binding.value || COUNTRY_ISO_DEFAULT
  const formatter = binding.modifiers.local ? localFormatter : internationalFormatter

  let previousValue = element.value

  // @ts-ignore
  element.oninput = function (event: InputEvent) {
    const value = element.value || ''
    const {selectionStart} = element

    const newValue = previousValue !== value ? handleDeletion(value, selectionStart!, event) : value

    const formattedNumber = formatter(newValue, country)
    const updatedValue = getUpdatedValue(newValue, formattedNumber)

    if (element.value !== updatedValue) {
      updateInputValue(element, updatedValue, formattedNumber === null)
      previousValue = element.value
    }
  }

  // @ts-ignore
  element.oninput()
}

export default function (el: HTMLElement, binding: any): void {
  // @ts-ignore
  if (el.type !== 'tel') return

  const inputElement = el.nodeName === 'INPUT' ? (el as HTMLInputElement) : findInputElement(el)
  if (!inputElement) {
    throw new Error('Element is not input and does not contain input')
  }

  // @ts-ignore
  inputElement.country = binding.value || COUNTRY_ISO_DEFAULT
  setInputEventListeners(inputElement, binding)
}

function findInputElement(element: HTMLElement): HTMLInputElement | null {
  return Array.from(element.children).find((child) => child.nodeName === 'INPUT') as HTMLInputElement | null
}
