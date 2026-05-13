import { InputType, Option } from "@/components/forms/form-generator/types"
import { Role } from "../../generated/prisma/enums"
import { formatEnumValue } from "@/utils/format-enums"

interface PatientFormField {
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

export const STATUS_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
]

export const CREATE_EMPLOYEE_FORM: PatientFormField[] = [
  {
    id: "1",
    inputType: "input",
    type: "email",
    label: "Email Address",
    placeholder: "john@example.com",
    name: "email",
    required: true,
  },
  {
    id: "2",
    inputType: "select",
    type: "text",
    label: "Role",
    placeholder: "Select a role",
    name: "role",
    required: true,
    options: Object.values(Role).map(role => ({ label: formatEnumValue(role), value: role })),
  },
  {
    id: "3",
    inputType: "input",
    type: "text",
    label: "Position",
    placeholder: "Software Engineer",
    name: "position",
    required: true,
  },
  {
    id: "4",
    inputType: "input",
    type: "text",
    label: "Department",
    placeholder: "IT",
    name: "department",
    required: true,
  },
  {
    id: "5",
    inputType: "switch",
    label: "Active Employee",
    placeholder: "",
    name: "isActive",
    switchDescription: "Employee is currently active and employed",
  },
]

export const UPDATE_EMPLOYEE_FORM: PatientFormField[] = [
  {
    id: "1",
    inputType: "input",
    type: "text",
    label: "First Name *",
    placeholder: "John",
    name: "firstName",
    required: true,
  },
  {
    id: "2",
    inputType: "input",
    type: "text",
    label: "Last Name *",
    placeholder: "Doe",
    name: "lastName",
    required: true,
  },
  {
    id: "3",
    inputType: "phone-input",
    type: "text",
    label: "Phone Number *",
    placeholder: "+254700000000",
    name: "phone",
    required: true,
  },
  {
    id: "4",
    inputType: "input",
    type: "email",
    label: "Email Address",
    placeholder: "john@example.com",
    name: "email",
    required: true,
  },
  {
    id: "5",
    inputType: "select",
    type: "text",
    label: "Role",
    placeholder: "Select a role",
    name: "role",
    required: true,
    options: Object.values(Role).map(role => ({ label: formatEnumValue(role), value: role })),
  },
  {
    id: "6 ",
    inputType: "input",
    type: "text",
    label: "Position",
    placeholder: "Software Engineer",
    name: "position",
    required: true,
  },
  {
    id: "7",
    inputType: "input",
    type: "text",
    label: "Department",
    placeholder: "IT",
    name: "department",
    required: true,
  },

  {
    id: "8",
    inputType: "switch",
    label: "Active Employee",
    placeholder: "",
    name: "isActive",
    switchDescription: "Employee is currently active and employed",
  },
]
