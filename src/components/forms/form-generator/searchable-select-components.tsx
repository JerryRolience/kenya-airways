import { cn } from "@/lib/utils"
import { ErrorMessage } from "@hookform/error-message"
import { Check, ChevronDown, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form"
import { Option } from "./types"
import { FieldLabel } from "./utils/field-label"
import { formatErrorMessage } from "./utils/format-error-message"

interface SearchableSelectProps {
  label: string
  name: string
  icon?: React.ReactNode
  placeholder?: string
  options?: Option[]
  control?: Control<FieldValues>
  errors?: FieldErrors<FieldValues>
  required?: boolean
  className?: string
}

export function SearchableSelect({ label, name, icon, placeholder = "Select an option...", options = [], control, errors, required = false, className }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const hasError = !!errors?.[name]

  const filteredOptions = options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" })
      }
    }
  }, [highlightedIndex])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="grid gap-2" ref={containerRef}>
      <FieldLabel label={label} name={name} hasError={hasError} required={required} icon={icon} />

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selectedOption = options.find(opt => opt.value === field.value)

          return (
            <div className="relative">
              <div
                className={cn(
                  "relative flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                  isOpen && "ring-2 ring-ring ring-offset-2",
                  hasError && "border-destructive ring-destructive",
                  className,
                )}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={selectedOption?.label || placeholder}
                  value={isOpen ? searchTerm : selectedOption?.label || ""}
                  onChange={e => {
                    if (!isOpen) setIsOpen(true)
                    setSearchTerm(e.target.value)
                    setHighlightedIndex(-1)
                  }}
                  onFocus={() => {
                    if (!isOpen) {
                      setIsOpen(true)
                    }
                  }}
                  className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                  readOnly={!isOpen}
                />

                <div className="flex items-center gap-1">
                  {field.value && !isOpen && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        field.onChange("")
                        setSearchTerm("")
                      }}
                      className="p-1 hover:bg-accent rounded-sm transition-colors"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}

                  <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200", isOpen && "rotate-180")} />
                </div>
              </div>

              {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-popover rounded-md border shadow-md overflow-hidden">
                  {/* Options List */}
                  <div ref={listRef} className="max-h-60 overflow-y-auto">
                    {filteredOptions.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground text-center">{`No  ${label?.includes("*") ? label.slice(0, -1) : label || "options"} found`}</div>
                    ) : (
                      filteredOptions.map((option, index) => (
                        <div
                          key={option.value}
                          className={cn(
                            "relative flex cursor-pointer select-none items-center justify-between px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                            field.value === option.value && "bg-accent/50",
                            highlightedIndex === index && "bg-accent text-accent-foreground",
                          )}
                          onClick={() => {
                            field.onChange(option.value)
                            setIsOpen(false)
                            setSearchTerm("")
                            setHighlightedIndex(-1)
                          }}
                          onMouseEnter={() => setHighlightedIndex(index)}
                        >
                          <span>{option.label}</span>
                          {field.value === option.value && <Check className="h-4 w-4" />}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        }}
      />

      {errors && (
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => <p className="text-destructive text-sm mt-1">{formatErrorMessage(message, label ?? name.charAt(0).toUpperCase() + name.slice(1))}</p>}
        />
      )}
    </div>
  )
}
