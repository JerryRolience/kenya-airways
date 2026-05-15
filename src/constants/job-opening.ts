import { InputType, Option } from "@/components/forms/form-generator/types"

interface JobOpeningFormField {
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

export const STATUS_OPTIONS = [
  { label: "Open", value: "true" },
  { label: "Closed", value: "false" },
]

export const ADD_JOB_OPENING_FORM: JobOpeningFormField[] = [
  {
    id: "1",
    inputType: "input",
    type: "text",
    label: "Job Title",
    placeholder: "Software Engineer",
    name: "title",
    required: true,
  },
  {
    id: "2",
    inputType: "input",
    type: "text",
    label: "Department",
    placeholder: "IT",
    name: "department",
    required: true,
  },
  {
    id: "3",
    inputType: "input",
    type: "text",
    label: "Job Description",
    placeholder: "Software Engineer",
    name: "description",
    required: true,
  },
  {
    id: "4",
    inputType: "switch",
    type: "text",
    label: "Is the position open?",
    name: "isOpen",
    switchDescription: "Toggle to set the job opening as open or closed.",
    required: true,
  },
]
