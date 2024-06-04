/* eslint-disable @typescript-eslint/ban-ts-comment */
const regExpErrors: any = {
  name: 'Min 3 characters',
  email: 'Invalid email address',
  password: 'Must include a mix of upper case, lower case, numeric and special character.',

  groupName: 'The group must be made up of Russian and English letters and be from 3 to 40 characters long',
  phoneNumber: 'Enter a correct phone number',
  promoCode: 'The promotional code must consist of Latin letters or numbers and contain from 4 to 32 characters',
  activateTv: 'The code must consist of numbers and contain 6 characters',
  nickName: 'Required field',
}

const regExpMap: any = {
  name: /^.*$/,
  email: /^[A-Za-z0-9а-яА-Я\._%+\-]+@([A-Za-z0-9а-яА-Я]{1,2}|[A-Za-z0-9а-яА-Я]((?!(\.\.))[A-Za-z0-9а-яА-Я.-])+[A-Za-z0-9а-яА-Я])\.[A-Za-zа-яА-Я]{2,}$/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{4,30}$/,

  groupName: /^[\wёа-я+-.,_:!?#&()*;$"'\s]{3,40}$/i,
  promoCode: /^[A-Za-z0-9]{4,32}$/i,
  activateTv: /^[0-9]{6,6}$/i,
  nickName: /^[a-zёа-яA-ZЁА-Я]{1,16}$/i,
  profileName: /^[-a-zA-Zа-яА-Я+0-9\s]{1,16}$/i,
}

export default function validate(_propLupForValidation: any, _propCustomValidation: any = {}) {
  const { hasOwnProperty } = Object.prototype
  const result: any = {
    inner: {},
    isValidAll: true,
  }

  for (const [key, value] of Object.entries(_propLupForValidation)) {
    let isValid = false
    const customMode = hasOwnProperty.call(_propCustomValidation, key)
    const customModeWithResultValid = hasOwnProperty.call(_propCustomValidation, 'isValid')
    if (hasOwnProperty.call(regExpMap, key) || customMode || customModeWithResultValid) {
      const regExpMapKey = customMode && _propCustomValidation[key] ? _propCustomValidation[key] : regExpMap[key]
      // @ts-ignore
      isValid = customModeWithResultValid ? _propCustomValidation?.isValid : regExpMapKey.test(value.trim())
      const errorMsg = isValid
        ? null
        : customMode && _propCustomValidation.errorMessage
        ? _propCustomValidation.errorMessage
        : regExpErrors[key]
      result.inner[key] = {
        isValid,
        errors: {
          validationError: errorMsg,
        },
      }
    }
    result.isValidAll = result.isValidAll && isValid
  }

  return result
}
