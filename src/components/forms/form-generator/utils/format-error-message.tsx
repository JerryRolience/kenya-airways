// Helper function to format error messages for users
export function formatErrorMessage(message: string, fieldLabel: string): string {
  // Handle common technical error messages
  if (message === "Required" || message.includes("undefined") || message.includes("Expected string")) {
    return `${fieldLabel} is required`
  }

  if (message.includes("email") || message.includes("Invalid email")) {
    return `Please enter a valid email address`
  }

  if (message.includes("min") && message.includes("characters")) {
    // Extract the number from message like "String must contain at least 2 character(s)"
    const match = message.match(/(\d+)/)
    const minLength = match ? match[0] : ""
    return `${fieldLabel} must be at least ${minLength} characters`
  }

  if (message.includes("max") && message.includes("characters")) {
    const match = message.match(/(\d+)/)
    const maxLength = match ? match[0] : ""
    return `${fieldLabel} must be no more than ${maxLength} characters`
  }

  if (message.includes("number") && message.includes("expected")) {
    return `${fieldLabel} must be a valid number`
  }

  // Return the original message but capitalize first letter
  return message.charAt(0).toUpperCase() + message.slice(1)
}
