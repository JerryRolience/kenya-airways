import { InputType, Option } from "@/components/forms/form-generator/types"

interface UserProfileFormField {
  id: string
  type?: "text" | "email" | "password" | "number"
  inputType: InputType
  options?: Option[]
  label: string
  placeholder: string
  name: string
  lines?: number
  switchDescription?: string
  maxDate?: string
  required?: boolean
}

export const UPDATE_USER_FORM: UserProfileFormField[] = [
  {
    id: "1",
    inputType: "input",
    type: "text",
    label: "First Name *",
    placeholder: "John",
    name: "firstName",
  },
  {
    id: "2",
    inputType: "input",
    type: "text",
    label: "Last Name *",
    placeholder: "Doe",
    name: "lastName",
  },
  {
    id: "3",
    inputType: "phone-input",
    type: "text",
    label: "Phone Number *",
    placeholder: "+254700000000",
    name: "phone",
  },
  {
    id: "4",
    inputType: "input",
    type: "email",
    label: "Email Address",
    placeholder: "john@example.com",
    name: "email",
  },
]
