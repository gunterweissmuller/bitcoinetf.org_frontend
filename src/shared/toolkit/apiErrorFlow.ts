export interface ErrorList {
  [key: string]: string[]
}

export interface IApiErrorFlow extends Error {
  errors: ErrorList
}

export class ApiErrorFlow extends Error implements IApiErrorFlow {
  errors
  constructor(_message: ErrorList) {
    super()

    this.errors = _message
    this.name = 'ApiErrorFlow'
  }
}
