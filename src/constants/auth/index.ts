import { InputType, Option } from "@/components/forms/form-generator/types";
import { FaLinkedinIn } from "react-icons/fa";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

interface AuthFormProps {
  id: string;
  type: "email" | "text" | "password";
  inputType: InputType;
  options?: Option[];
  label: string;
  placeholder: string;
  name: string;
}

export const SIGN_UP_FORM: AuthFormProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Enter your first name",
    label: "First name",
    name: "firstName",
    type: "text",
  },
  {
    id: "2",
    inputType: "input",
    placeholder: "Enter your last name",
    label: "Last name",
    name: "lastName",
    type: "text",
  },
  {
    id: "3",
    inputType: "input",
    placeholder: "Enter your email address",
    label: "Email",
    name: "email",
    type: "email",
  },
  {
    id: "4",
    inputType: "phone-input",
    type: "text",
    label: "Enter your phone number",
    placeholder: "+254700000000",
    name: "phone",
  },
  {
    id: "5",
    inputType: "input",
    placeholder: "Enter your password",
    label: "Password",
    name: "password",
    type: "password",
  },
];

export const AUTH_FORM: AuthFormProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Enter your email address",
    label: "Email",
    name: "email",
    type: "email",
  },
];

export const socialLinks = [
  {
    id: 1,
    link: "#",
    icon: SiFacebook,
  },
  {
    id: 2,
    link: "#",
    icon: SiX,
  },
  {
    id: 3,
    link: "#",
    icon: SiInstagram,
  },
  {
    id: 4,
    link: "#",
    icon: FaLinkedinIn,
  },
];
