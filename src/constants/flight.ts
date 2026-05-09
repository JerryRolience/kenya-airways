// import { InputType, Option } from "@/components/forms/form-generator/types"
// import { FaLinkedinIn } from "react-icons/fa"
// import { SiFacebook, SiInstagram, SiX } from "react-icons/si"

// interface AuthFormProps {
//   id: string
//   type: "email" | "text" | "password"
//   inputType: InputType
//   options?: Option[]
//   label: string
//   placeholder: string
//   name: string
//   required?: boolean
//   maxDate?: string
//   minDate?: string
// }

// export const PASSENGER_SIGN_UP_FORM: AuthFormProps[] = [
//   {
//     id: "1",
//     inputType: "input",
//     placeholder: "Enter your first name",
//     label: "First name",
//     name: "firstName",
//     type: "text",
//     required: true,
//   },
//   {
//     id: "2",
//     inputType: "input",
//     placeholder: "Enter your last name",
//     label: "Last name",
//     name: "lastName",
//     type: "text",
//     required: true,
//   },
//   {
//     id: "3",
//     inputType: "select",
//     label: "Select your title",
//     placeholder: "Select your title",
//     type: "text",
//     name: "title",
//     required: true,
//     options: TITLE_OPTIONS,
//   },
//   {
//     id: "4",
//     inputType: "date",
//     type: "text",
//     label: "Date of Birth *",
//     placeholder: new Date().toLocaleDateString("en-US", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     }), // "DD/MMM/YYYY"
//     name: "dateOfBirth",
//     maxDate: new Date().toISOString().split("T")[0],
//   },
//   {
//     id: "5",
//     inputType: "phone-input",
//     type: "text",
//     label: "Enter your phone number",
//     placeholder: "+254700000000",
//     name: "phone",
//     required: true,
//   },
//   {
//     id: "6",
//     inputType: "input",
//     placeholder: "Enter your passport number",
//     label: "Passport number",
//     name: "passportNumber",
//     type: "text",
//     required: true,
//   },
//   {
//     id: "7",
//     inputType: "select",
//     placeholder: "Select your nationality",
//     label: "Nationality",
//     name: "nationality",
//     type: "text",
//     required: true,
//     options: NATIONALITY_OPTIONS,
//   },
// ]

// export const AUTH_FORM: AuthFormProps[] = [
//   {
//     id: "1",
//     inputType: "input",
//     placeholder: "Enter your email address",
//     label: "Email",
//     name: "email",
//     type: "email",
//   },
// ]

// export const socialLinks = [
//   {
//     id: 1,
//     link: "#",
//     icon: SiFacebook,
//   },
//   {
//     id: 2,
//     link: "#",
//     icon: SiX,
//   },
//   {
//     id: 3,
//     link: "#",
//     icon: SiInstagram,
//   },
//   {
//     id: 4,
//     link: "#",
//     icon: FaLinkedinIn,
//   },
// ]
