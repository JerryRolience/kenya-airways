"use client"

import { toast } from "sonner"

interface ErrorHandlerData {
  title: string
  description?: string
  action: "success" | "error" | "info" | "warning" | "loading"
}

export function ErrorHandler(data: ErrorHandlerData) {
  const { title, description, action } = data

  switch (action) {
    case "success":
      return toast.success(title, {
        description: description,
        style: { backgroundColor: "green", color: "black" },
      })
    case "error":
      return toast.error(title, {
        description: description,
        style: { backgroundColor: "red", color: "white" },
      })
    case "info":
      return toast.info(title, {
        description: description,
        style: { backgroundColor: "blue", color: "white" },
      })
    case "warning":
      return toast.warning(title, {
        description: description,
        style: { backgroundColor: "orange", color: "black" },
      })
    case "loading":
      return toast.loading(title, {
        description: description,
        style: { backgroundColor: "gray", color: "white" },
      })
    default:
      return toast(title, {
        description: description,
      })
  }
}
