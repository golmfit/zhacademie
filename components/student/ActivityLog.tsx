"use client"

import React from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

interface ActivityLogProps {
  activity: any[]
  formatDateTime: (timestamp: any) => string
}

export default function ActivityLog({ activity, formatDateTime }: ActivityLogProps) {
  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: activity?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  })

  if (!activity?.length) {
    return <p className="text-gray-500 text-center py-8">No activity recorded yet</p>
  }

  return (
    <div ref={parentRef} className="max-h-[400px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = activity[virtualItem.index]
          return (
            <div
              key={item.id}
              className="absolute top-0 left-0 w-full"
              style={{
                height: virtualItem.size,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="flex items-start">
                <div
                  className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                    item.type === "Document"
                      ? "bg-green-500"
                      : item.type === "Application"
                        ? "bg-blue-500"
                        : item.type === "Visa"
                          ? "bg-purple-500"
                          : "bg-gray-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">
                      {item.type}: {item.action} {item.detail}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{formatDateTime(item.timestamp)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
