import { InputType, Option } from "@/components/forms/form-generator/types"

interface MatchFormField {
  id: string
  type?: "text" | "email" | "password" | "number"
  inputType: InputType
  options?: Option[]
  label: string
  placeholder?: string
  name: string
  lines?: number
  switchDescription?: string
  maxDate?: string
  required?: boolean
}

export const MATCH_FORM: MatchFormField[] = [
  {
    id: "1",
    inputType: "select",
    type: "text",
    label: "Job Opening",
    placeholder: "Select a job opening",
    name: "openingId",
    options: [], // Dynamically populated
    required: true,
  },
  {
    id: "2",
    inputType: "select",
    type: "text",
    label: "Employee",
    placeholder: "Select an employee",
    name: "employeeId",
    options: [], // Dynamically populated based on opening
    required: true,
  },
  {
    id: "3",
    inputType: "textarea",
    type: "text",
    label: "Notes (optional)",
    placeholder: "Add any notes about this match...",
    name: "notes",
    lines: 3,
    required: false,
  },
]
