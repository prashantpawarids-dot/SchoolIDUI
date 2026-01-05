import { Label } from "@/components/ui/label"
import type { ReactNode } from "react"

interface FormInputProps {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

export function FormInput({ label, error, required, children }: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
