import type React from "react"

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
      <div className="min-w-0">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          {title}
        </h1>

        {description && <p className="text-sm md:text-base text-muted-foreground mt-1">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0 w-full md:w-auto">{action}</div>}
    </div>
  )
}
