import { SkeletonTable } from './Skeleton';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import Pagination from './Pagination';

/**
 * Reusable data table with loading/error/empty states.
 *
 * Props:
 *   columns  : [{ key, label, render, width, align }]
 *   data     : []
 *   loading  : boolean
 *   error    : string | null
 *   onRetry  : () => void
 *   emptyIcon: string
 *   emptyTitle, emptyMessage
 *   page, totalPages, onPageChange
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  error = null,
  onRetry,
  emptyIcon = '📋',
  emptyTitle = 'No records found',
  emptyMessage,
  page,
  totalPages,
  onPageChange,
}) {
  if (loading) return <SkeletonTable rows={5} cols={columns.length} />;
  if (error)   return <ErrorState message={error} onRetry={onRetry} />;
  if (!data.length) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width, textAlign: col.align ?? 'left' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={row.id ?? rowIdx}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{ textAlign: col.align ?? 'left' }}
                  >
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {page && totalPages && onPageChange && (
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}
