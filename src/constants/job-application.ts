import { InputType } from "@/components/forms/form-generator/types"

interface JobApplicationFormField {
  id: string
  type?: "text" | "email" | "password" | "number"
  inputType: InputType
  label: string
  placeholder?: string
  name: string
  lines?: number
  required?: boolean
  helperText?: string
}

export const JOB_APPLICATION_FORM: JobApplicationFormField[] = [
  {
    id: "1",
    inputType: "readonly-input",
    type: "text",
    label: "Opening ID",
    name: "openingId",
    required: true,
  },
  {
    id: "2",
    inputType: "textarea",
    type: "text",
    label: "Cover Letter",
    placeholder: "Tell us why you're a great fit for this role. Highlight your relevant experience, skills, and what makes you passionate about joining Kenya Airways...",
    name: "coverLetter",
    lines: 8,
    required: true,
    helperText: "Minimum 50 characters. Be specific about your qualifications.",
  },
  {
    id: "3",
    inputType: "input",
    type: "text",
    label: "CV / Resume URL (optional)",
    placeholder: "https://drive.google.com/your-cv.pdf",
    name: "cvUrl",
    required: false,
    helperText: "Share a link to your CV. Ensure the link is publicly accessible.",
  },
]
