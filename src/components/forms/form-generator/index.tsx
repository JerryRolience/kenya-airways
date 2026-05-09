"use client"

import { DatePickerComponent } from "./date-picker-component"
import { ImageUploadComponent } from "./image-upload-component"
import { InputNumberComponent } from "./input-number-component"
import { InputTextComponent } from "./input-text-component"
import { MultiSelectComponent } from "./multi-select-component"
import MultiFileUploadComponent from "./multiple-file-upload"
import { PhoneInputComponent } from "./phone-input-component"
import { ReadonlyInputComponent } from "./readonly-input-component"
import { SearchableSelect } from "./searchable-select-components"
import { SelectComponent } from "./select-component"
import { SwitchComponent } from "./switch-component"
import { TextAreaComponent } from "./text-area-component"
import { FormGeneratorProps } from "./types"

export function FormGenerator({
  inputType,
  options = [],
  label,
  placeholder,
  icon,
  register,
  control,
  name,
  errors,
  setError,
  clearErrors,
  type,
  lines,
  required,
  switchDescription,
  maxDate,
  minDate,
  minNumber,
  maxNumber,
  helperText,
  readonlyValue,
  readOnlySubmitValue,
  multiselectPlaceholder,
}: FormGeneratorProps) {
  switch (inputType) {
    case "input":
      return type === "number" ? (
        <InputNumberComponent
          label={label}
          name={name}
          placeholder={placeholder}
          control={control}
          errors={errors}
          minNumber={minNumber}
          maxNumber={maxNumber}
          required={required}
          helperText={helperText}
        />
      ) : (
        <InputTextComponent label={label} name={name} type={type} placeholder={placeholder} register={register} errors={errors} required={required} helperText={helperText} />
      )

    case "searchable-dropdown":
      return <SearchableSelect label={label} name={name} icon={icon} placeholder={placeholder} options={options} control={control} errors={errors} required={required} />

    case "readonly-input":
      return <ReadonlyInputComponent label={label} name={name} readonlyValue={readonlyValue} readOnlySubmitValue={readOnlySubmitValue} register={register} errors={errors} />

    case "multiselect":
      return <MultiSelectComponent label={label} name={name} multiselectPlaceholder={multiselectPlaceholder} options={options} control={control} errors={errors} required={required} />

    case "select":
      return <SelectComponent label={label} name={name} placeholder={placeholder} options={options} control={control} errors={errors} required={required} />

    case "textarea":
      return <TextAreaComponent label={label} name={name} placeholder={placeholder} lines={lines} register={register} errors={errors} required={required} helperText={helperText} />

    case "switch":
      return <SwitchComponent label={label} name={name} switchDescription={switchDescription} control={control} errors={errors} required={required} />

    case "date":
      return <DatePickerComponent name={name} label={label} icon={icon} placeholder={placeholder} maxDate={maxDate} minDate={minDate} control={control} errors={errors} required={required} />

    case "phone-input":
      return <PhoneInputComponent label={label} name={name} placeholder={placeholder} control={control} errors={errors} required={required} />

    case "single-file-upload":
      return <ImageUploadComponent name={name} label={label} control={control} errors={errors} required={required} setError={setError} clearErrors={clearErrors} />

    case "multiple-file-upload":
      return <MultiFileUploadComponent />

    default:
      return <></>
  }
}
