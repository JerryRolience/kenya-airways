import { UseFormRegister, FieldErrors, FieldValues, Control, UseFormSetError, UseFormClearErrors } from "react-hook-form"

export interface Option {
  value: string | number
  label: string
}

export type InputType =
  | "select"
  | "input"
  | "textarea"
  | "switch"
  | "date"
  | "dropdown"
  | "searchable-dropdown"
  | "readonly-input"
  | "multiselect"
  | "phone-input"
  | "combobox"
  | "single-file-upload"
  | "multiple-file-upload"

export interface FormGeneratorProps {
  type?: "text" | "email" | "password" | "number" | "date"
  inputType: InputType
  options?: Option[]
  label: string
  icon?: React.ReactNode
  placeholder?: string
  register?: UseFormRegister<any>
  control?: Control<any>
  name: string
  required?: boolean
  errors: FieldErrors<FieldValues>
  lines?: number
  switchDescription?: string
  minNumber?: number
  maxNumber?: number
  maxDate?: string
  minDate?: string
  readonlyValue?: string
  readOnlySubmitValue?: string
  multiselectPlaceholder?: string
  helperText?: string
  setError?: UseFormSetError<FieldValues>
  clearErrors?: UseFormClearErrors<FieldValues>
}
