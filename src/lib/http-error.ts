interface HttpErrorOptions {
  message: string
  statusCode: number
  isOperational?: boolean
}

export class HttpError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor({ message, statusCode, isOperational = true }: HttpErrorOptions) {
    super(message)

    this.statusCode = statusCode
    this.isOperational = isOperational

    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace?.(this)
  }
}
