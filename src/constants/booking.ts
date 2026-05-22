import { InputType, Option } from "@/components/forms/form-generator/types"
import { PaymentMethod } from "../../generated/prisma/enums"
import { formatEnumValue } from "@/utils/format-enums"

interface ChangeBookingFormField {
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
  helperText?: string
}

export const CHANGE_BOOKING_FORM: ChangeBookingFormField[] = [
  {
    id: "1",
    inputType: "select",
    type: "text",
    label: "New Flight",
    placeholder: "Select a new flight",
    name: "newFlightId",
    options: [], // Dynamically populated based on route
    required: true,
    helperText: "Choose an alternative flight on the same route.",
  },
  {
    id: "2",
    inputType: "select",
    type: "text",
    label: "New Seat Class",
    placeholder: "Select seat class",
    name: "newSeatClassId",
    options: [], // Dynamically populated based on selected flight
    required: true,
    helperText: "Choose your preferred cabin class.",
  },
  {
    id: "3",
    inputType: "select",
    type: "text",
    label: "Payment Method",
    placeholder: "Select payment method",
    name: "paymentMethod",
    // options: [
    //   { value: "MPESA", label: "M-Pesa" },
    //   { value: "VISA", label: "Visa" },
    //   { value: "MASTERCARD", label: "Mastercard" },
    //   { value: "AMEX", label: "American Express" },
    //   { value: "BANK_TRANSFER", label: "Bank Transfer" },
    //   { value: "CASH", label: "Cash" },
    // ],
    options: Object.values(PaymentMethod).map(method => ({
      value: method,
      label: formatEnumValue(method),
    })),
    required: true,
    helperText: "Select payment method for fare difference.",
  },
  {
    id: "4",
    inputType: "input",
    type: "text",
    label: "Transaction Reference",
    placeholder: "e.g., M-Pesa confirmation code",
    name: "transactionRef",
    required: false,
    helperText: "Required for M-Pesa payments. Optional for other methods.",
  },
]
