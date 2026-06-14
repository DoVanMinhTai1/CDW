import { useState, useEffect } from 'react';

export function usePagination<T>(
  fetchFunc: (page: number, filters: any) => Promise<T[]>,
  pageSize: number = 10,
  initialFilters: any = {}
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFunc(page, filters);
        setItems(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, filters, fetchFunc]);

  return {
    items,
    page,
    setPage,
    filters,
    setFilters,
    loading,
    error
  };
}
