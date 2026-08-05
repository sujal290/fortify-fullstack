'use client';
import { useMemo, useState } from 'react';

export function usePagination(totalItems, pageSize = 12) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(totalItems / pageSize));

  const range = useMemo(() => {
    const start = (page - 1) * pageSize;
    return { start, end: start + pageSize };
  }, [page, pageSize]);

  const next = () => setPage((p) => Math.min(pages, p + 1));
  const prev = () => setPage((p) => Math.max(1, p - 1));

  return { page, pages, range, setPage, next, prev };
}
