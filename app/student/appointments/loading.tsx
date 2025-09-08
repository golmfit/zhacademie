import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-6">
      <Skeleton className="h-8 w-64 mb-6" />
      <Skeleton className="h-[calc(100vh-200px)] w-full rounded-lg" />
    </div>
  )
}
