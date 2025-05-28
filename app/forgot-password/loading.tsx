import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto mt-2" />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center pb-6">
            <Skeleton className="h-8 w-56 mx-auto mb-2" />
            <Skeleton className="h-4 w-72 mx-auto" />
          </div>

          <div className="space-y-4">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />

            <div className="text-center mt-4">
              <Skeleton className="h-5 w-32 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
