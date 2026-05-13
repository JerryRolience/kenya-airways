/**
 * Converts enum values to readable UI strings
 * Handles various formats: camelCase, snake_case, UPPER_CASE, PascalCase, etc.
 *
 * @param value - The enum value to format (string or null/undefined)
 * @param options - Formatting options
 * @returns Formatted readable string
 *
 * @example
 * formatEnumValue("IN_PROGRESS") // "In Progress"
 * formatEnumValue("in_progress") // "In Progress"
 * formatEnumValue("inProgress") // "In Progress"
 * formatEnumValue("cardiology") // "Cardiology"
 * formatEnumValue("GENERAL_PRACTITIONER") // "General Practitioner"
 * formatEnumValue("CONSULTATION_FEE") // "Consultation Fee"
 */
export function formatEnumValue(
  value: string | null | undefined,
  options?: {
    capitalizeWords?: boolean // Default: true
    joinWords?: string // Default: " "
    preserveUppercase?: boolean // Default: false (e.g., "MRI" stays "MRI")
    customMappings?: Record<string, string> // Custom overrides
  },
): string {
  // Handle null/undefined/empty
  if (!value || value.trim() === "") {
    return "N/A"
  }

  const { capitalizeWords = true, joinWords = " ", preserveUppercase = false, customMappings = {} } = options || {}

  // Check for custom mapping first
  if (customMappings[value]) {
    return customMappings[value]
  }

  let formatted = value

  // Handle special case: preserve common acronyms if preserveUppercase is true
  if (!preserveUppercase) {
    // Split by underscore, camelCase, or PascalCase
    // First, replace underscores and hyphens with spaces
    formatted = formatted.replace(/[_-]/g, " ")

    // Split camelCase/PascalCase (e.g., "inProgress" -> "in Progress")
    // This regex finds positions where a lowercase letter is followed by an uppercase letter
    // or an uppercase letter is followed by a lowercase letter (for PascalCase)
    formatted = formatted.replace(/([a-z])([A-Z])/g, "$1 $2")
    formatted = formatted.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")

    // Split numbers from letters (e.g., "Room101" -> "Room 101")
    formatted = formatted.replace(/([a-zA-Z])(\d)/g, "$1 $2")
    formatted = formatted.replace(/(\d)([a-zA-Z])/g, "$1 $2")
  }

  // Split into words
  let words = formatted.split(/\s+/)

  // Process each word
  words = words.map(word => {
    // Skip empty strings
    if (!word) return ""

    // Check if the word is a common acronym that should stay uppercase
    const commonAcronyms = ["MRI", "CT", "XRAY", "DNA", "RNA", "HIV", "AIDS", "ICU", "ER", "OR", "GP"]
    if (commonAcronyms.includes(word.toUpperCase())) {
      return word.toUpperCase()
    }

    // Handle words that might be partially uppercase (e.g., "iPhone" -> "Iphone" then capitalize)
    if (capitalizeWords) {
      // For words that are all uppercase, convert to proper case
      if (word === word.toUpperCase() && word.length > 1) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }
      // For normal words, capitalize first letter and lowercase the rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    }

    return word
  })

  // Filter out empty strings and join
  formatted = words.filter(w => w).join(joinWords)

  return formatted
}
