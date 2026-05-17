"use client"

import { FormGenerator } from "@/components/forms/form-generator"
import { Button } from "@/components/ui/button"
import { customZodResolver } from "@/hooks/custom-zod-resolver"
import { PassengerFormValues, PassengerSchema } from "@/validators/booking"
import { UserCheck } from "lucide-react"
import { forwardRef, useImperativeHandle } from "react"
import { useForm } from "react-hook-form"
import { countries } from "@/constants/countries"
import { PassengerRelation, Title } from "../../../../generated/prisma/enums"
import { formatEnumValue } from "@/utils/format-enums"

interface PassengerFormProps {
  index: number
  defaultValues?: Partial<PassengerFormValues>
  onUseMyDetails?: () => Partial<PassengerFormValues>
}

export interface PassengerFormHandle {
  validate: () => Promise<boolean>
  getValues: () => PassengerFormValues
}

const TITLES = Object.values(Title).map(t => ({
  value: t,
  label: formatEnumValue(t),
}))

const RELATIONSHIPS = Object.values(PassengerRelation).map(r => ({
  value: r,
  label: formatEnumValue(r),
}))

// Country options for nationality
const NATIONALITY_OPTIONS = countries.map(c => ({
  value: c.nationality,
  label: `${c.nationality} (${c.name})`,
}))

export const PassengerForm = forwardRef<PassengerFormHandle, PassengerFormProps>(function PassengerForm({ index, defaultValues, onUseMyDetails }, ref) {
  const isFirstPassenger = index === 0

  const {
    register,
    control,
    setValue,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<PassengerFormValues>({
    resolver: customZodResolver(PassengerSchema),
    defaultValues: {
      relationship: isFirstPassenger ? PassengerRelation.SELF : PassengerRelation.OTHER,
      ...defaultValues,
    },
    mode: "onBlur",
  })

  // Expose validate + getValues to parent
  useImperativeHandle(ref, () => ({
    validate: async () => {
      const valid = await trigger()
      return valid
    },
    getValues: () => getValues(),
  }))

  const handleUseMyDetails = () => {
    if (!onUseMyDetails) return
    const details = onUseMyDetails()
    Object.entries(details).forEach(([key, value]) => {
      if (value !== undefined) {
        setValue(key as keyof PassengerFormValues, value as any, {
          shouldValidate: true,
        })
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Pre-fill button for passenger 1 */}
      {isFirstPassenger && onUseMyDetails && (
        <Button type="button" variant="outline" size="sm" onClick={handleUseMyDetails} className="h-8 rounded-xl text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/5">
          <UserCheck className="h-3.5 w-3.5" />
          Use my account details
        </Button>
      )}

      {/* Row 1: Title + First name + Last name */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-3 sm:col-span-2">
          <FormGenerator inputType="select" name="title" label="Title" placeholder="—" options={TITLES} control={control as any} errors={errors} required />
        </div>
        <div className="col-span-9 sm:col-span-5">
          <FormGenerator inputType="input" type="text" name="firstName" label="First name" placeholder="John" register={register} errors={errors} required />
        </div>
        <div className="col-span-12 sm:col-span-5">
          <FormGenerator inputType="input" type="text" name="lastName" label="Last name" placeholder="Doe" register={register} errors={errors} required />
        </div>
      </div>

      {/* Row 2: Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormGenerator inputType="input" type="email" name="email" label="Email address" placeholder="john@example.com" register={register} errors={errors} required />
        <FormGenerator inputType="phone-input" name="phone" label="Phone number" placeholder="+254 712 345 678" control={control as any} errors={errors} required />
      </div>

      {/* Row 3: Passport + Nationality + DOB */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormGenerator inputType="input" type="text" name="passportNumber" label="Passport number" placeholder="AB123456" register={register} errors={errors} required />
        <FormGenerator
          inputType="searchable-dropdown"
          name="nationality"
          label="Nationality"
          placeholder="Select nationality"
          options={NATIONALITY_OPTIONS}
          control={control as any}
          errors={errors}
          required
        />
        <FormGenerator
          inputType="date"
          name="dateOfBirth"
          label="Date of birth"
          placeholder="Pick a date"
          maxDate={new Date().toISOString().split("T")[0]}
          control={control as any}
          errors={errors}
          required
        />
      </div>

      {/* Row 4: Relationship */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormGenerator
          inputType="select"
          name="relationship"
          label="Relationship to lead passenger"
          placeholder="Select relationship"
          options={RELATIONSHIPS.filter(r => !isFirstPassenger || r.value === PassengerRelation.SELF)}
          control={control as any}
          errors={errors}
          required
        />
      </div>
    </div>
  )
})
