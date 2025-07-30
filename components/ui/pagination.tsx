"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showTotalItems?: boolean
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showTotalItems = true,
  className = "",
}: PaginationProps) {
  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots.filter((item, index, array) => array.indexOf(item) === index)
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      {showTotalItems && (
        <div className="text-sm text-gray-400">
          Showing {startItem} - {endItem} of {totalItems} items
        </div>
      )}
      
      <div className="flex items-center gap-2">
        {showPageSizeSelector && (
          <>
            <span className="text-sm text-gray-400">Items per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-20 bg-gray-700/50 border-gray-600 text-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600/50"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent rounded">
            {getVisiblePages().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="px-3 py-1 text-gray-400">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(Number(page))}
                    className={`px-3 py-1 h-8 ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600/50"
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600/50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600/50"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
