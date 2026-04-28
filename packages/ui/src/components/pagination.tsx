import { useCallback } from "react";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationRoot,
} from "@/ui/shadcn/components/ui/pagination";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblings?: number;
}

function getPageRange(page: number, totalPages: number, siblings: number): (number | "...")[] {
  const left = page - siblings;
  const right = page + siblings;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      pages.push(i);
    }
  }

  const result: (number | "...")[] = [];
  let prev: number | null = null;
  for (const p of pages) {
    if (prev !== null && p - prev > 1) {
      result.push("...");
    }
    result.push(p);
    prev = p;
  }
  return result;
}

export function Pagination({ page, totalPages, onPageChange, siblings = 1 }: PaginationProps) {
  const range = getPageRange(page, totalPages, siblings);

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (page > 1) {
        onPageChange(page - 1);
      }
    },
    [page, onPageChange]
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (page < totalPages) {
        onPageChange(page + 1);
      }
    },
    [page, totalPages, onPageChange]
  );

  const handlePageClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const target = Number(e.currentTarget.dataset["page"]);
      if (target >= 1 && target <= totalPages) {
        onPageChange(target);
      }
    },
    [totalPages, onPageChange]
  );

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-50" : undefined}
            onClick={handlePrev}
          />
        </PaginationItem>

        {range.map((p, i) =>
          p === "..." ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis has no identity
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href="#" isActive={p === page} data-page={p} onClick={handlePageClick}>
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page === totalPages}
            className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
            onClick={handleNext}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
