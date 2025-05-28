import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "Pending" | "In Progress" | "Completed" | "Approved" | "Rejected" | "Not Started"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Approved":
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "Pending":
      case "Not Started":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStatusStyles(status),
        className,
      )}
    >
      {status}
    </span>
  )
}
