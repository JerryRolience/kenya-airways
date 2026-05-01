import set from "lodash/set"
import { FieldError, FieldErrors, FieldValues, Resolver } from "react-hook-form"
import { ZodError, ZodSchema } from "zod"

// Utility to convert ZodError to Hook Form-compatible FieldErrors
const zodToHookFormErrors = <T extends FieldValues>(zodError: ZodError): FieldErrors<T> => {
  const errors: FieldErrors<T> = {}

  for (const issue of zodError.issues) {
    const path = issue.path.join(".")

    set(errors, path, {
      type: issue.code,
      message: issue.message,
    } as FieldError)
  }

  return errors
}

// Custom resolver for useForm()
export const customZodResolver = <T extends Record<string, any>>(schema: ZodSchema<T>): Resolver<T> => {
  return async values => {
    const result = await schema.safeParseAsync(values)

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      }
    }

    return {
      values: {},
      errors: zodToHookFormErrors<T>(result.error),
    }
  }
}
