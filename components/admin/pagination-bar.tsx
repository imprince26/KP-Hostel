"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Page navigation for a table.
 *
 * The users and applications tables each carried their own copy of the same
 * numbered-page control.
 */
export function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemLabel,
  itemsPerPage,
  onItemsPerChange,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemLabel: string;
  itemsPerPage?: number;
  onItemsPerChange?: (size: number) => void;
  className?: string;
}) {
  const startIndex = (currentPage - 1) * (itemsPerPage ?? totalItems);
  const endIndex = startIndex + (itemsPerPage ?? totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => {
    const distance = Math.abs(page - currentPage);
    return distance === 0 || distance === 1 || page === 1 || page === totalPages;
  });

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 mt-6",
        className
      )}
    >
      <div className="text-sm text-muted-foreground">
        Showing {totalItems === 0 ? 0 : startIndex + 1} to{" "}
        {Math.min(endIndex, totalItems)} of {totalItems} {itemLabel}
      </div>

      {onItemsPerChange && (
        <div className="flex items-center gap-1.5 pl-3 border-l border-border">
          <span className="hidden md:inline text-sm">Per page:</span>
          <Select
            value={itemsPerPage?.toString()}
            onValueChange={(value) => onItemsPerChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-18 text-xs bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="h-8 px-2.5 text-xs gap-1"
          >
            <ChevronLeft className="size-3.5" />
            <span className="hidden min-[400px]:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-1">
            {pages.map((page, index, array) => (
              <div key={page} className="flex items-center">
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-1 text-xs text-muted-foreground select-none">...</span>
                )}
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="h-8 w-8 p-0 text-xs font-medium"
                >
                  {page}
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="h-8 px-2.5 text-xs gap-1"
          >
            <span className="hidden min-[400px]:inline">Next</span>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
