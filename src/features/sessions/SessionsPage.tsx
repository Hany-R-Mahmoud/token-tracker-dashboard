import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { PageHeader } from '@/components/shared/SectionHeader';
import { StateChip } from '@/components/shared/StateChip';
import { FilterBar } from '@/components/shared/FilterBar';
import { CompositionBar } from '@/components/charts/CompositionBar';
import { SessionDetailSheet, SESSION_STATUS_MAP, CONTEXT_COLORS, TRUTH_COLORS } from '@/components/shared/SessionDetailSheet';
import { mockSessions } from '@/data/mock/sessions';
import { Session } from '@/types';

const thStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--tt-text-muted)',
  fontFamily: "'Manrope', sans-serif",
  textAlign: 'left',
  borderBottom: '1px solid var(--tt-border)',
  whiteSpace: 'nowrap',
  background: 'var(--tt-bg-tertiary)',
  position: 'sticky' as const,
  top: 0,
};

const tdStyle: React.CSSProperties = {
  padding: '9px 10px',
  fontSize: 12,
  borderBottom: '1px solid var(--tt-border)',
  verticalAlign: 'middle',
};


const columnHelper = createColumnHelper<Session>();

const SESSION_COLUMNS = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--tt-text-muted)' }}>{info.getValue()}</span>,
  }),
  columnHelper.accessor('timestamp', {
    header: 'Time',
    cell: info => <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--tt-text-muted)', whiteSpace: 'nowrap' }}>{new Date(info.getValue()).toLocaleTimeString()}</span>,
  }),
  columnHelper.accessor('provider', {
    header: 'Provider',
    cell: info => <span style={{ fontSize: 11, color: 'var(--tt-text-secondary)' }}>{info.getValue()}</span>,
  }),
  columnHelper.accessor('model', {
    header: 'Model',
    cell: info => <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--tt-text-muted)', whiteSpace: 'nowrap' }}>{info.getValue()}</span>,
  }),
  columnHelper.accessor('tokens', {
    header: 'Tokens',
    cell: info => <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>{info.getValue().toLocaleString()}</span>,
    meta: { align: 'right' as const },
  }),
  columnHelper.accessor('cost', {
    header: 'Cost',
    cell: info => <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>${info.getValue().toFixed(3)}</span>,
    meta: { align: 'right' as const },
  }),
  columnHelper.accessor('duration', {
    header: 'Duration',
    cell: info => <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>{(info.getValue() / 1000).toFixed(1)}s</span>,
    meta: { align: 'right' as const },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => <StateChip state={SESSION_STATUS_MAP[info.getValue()] ?? 'unknown'} label={info.getValue()} />,
  }),
  columnHelper.accessor('successScore', {
    header: 'Score',
    cell: info => {
      const v = info.getValue();
      return (
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: v >= 0.9 ? 'var(--tt-accent)' : v >= 0.6 ? 'var(--tt-warning)' : 'var(--tt-critical-text)' }}>
          {(v * 100).toFixed(0)}%
        </span>
      );
    },
    meta: { align: 'right' as const },
  }),
  columnHelper.accessor('contextHealth', {
    header: 'Context',
    cell: info => <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: CONTEXT_COLORS[info.getValue()] }}>{info.getValue()}</span>,
  }),
  columnHelper.accessor('surfaceTruth', {
    header: 'Truth',
    cell: info => <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: TRUTH_COLORS[info.getValue()] }}>{info.getValue()}</span>,
  }),
];

export function SessionsPage() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'timestamp', desc: true }]);

  const successCount = mockSessions.filter(s => s.status === 'success').length;
  const warningCount = mockSessions.filter(s => s.status === 'warning').length;
  const errorCount = mockSessions.filter(s => s.status === 'error').length;
  const fallbackCount = mockSessions.filter(s => s.status === 'fallback').length;
  const degradedCount = mockSessions.filter(s => s.status === 'degraded').length;
  const unknownCount = mockSessions.filter(s => s.status === 'unknown').length;

  const avgScore = mockSessions.reduce((s, sess) => s + sess.successScore, 0) / mockSessions.length;
  const avgCost = mockSessions.reduce((s, sess) => s + sess.cost, 0) / mockSessions.length;
  const avgDuration = mockSessions.reduce((s, sess) => s + sess.duration, 0) / mockSessions.length;

  const columns = useMemo(() => SESSION_COLUMNS, []);

  const table = useReactTable({
    data: mockSessions,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <FilterBar />
      <div style={{ padding: '24px 28px', maxWidth: 1400 }}>
        <PageHeader title="Sessions" subtitle="Full session log with triage view" />

        {/* Summary Band */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 20 }}>
          {[
            { label: 'Success', value: successCount, color: 'var(--tt-accent)', state: 'success' },
            { label: 'Warning', value: warningCount, color: 'var(--tt-warning)', state: 'warning' },
            { label: 'Error', value: errorCount, color: 'var(--tt-critical-text)', state: 'error' },
            { label: 'Fallback', value: fallbackCount, color: 'var(--tt-fallback)', state: 'fallback' },
            { label: 'Degraded', value: degradedCount, color: 'var(--tt-degraded)', state: 'degraded' },
            { label: 'Unknown', value: unknownCount, color: 'var(--tt-unknown)', state: 'unknown' },
          ].map(item => (
            <div key={item.label} className="tt-panel" style={{ padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 20, color: item.color, fontWeight: 500 }}>{item.value}</div>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--tt-text-muted)', marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Composition Bar */}
        <div className="tt-panel" style={{ padding: '12px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tt-text-muted)', marginBottom: 10 }}>Session Outcome Composition</div>
          <CompositionBar
            segments={[
              { label: 'Success', value: successCount, color: 'var(--tt-accent)' },
              { label: 'Warning', value: warningCount, color: 'var(--tt-warning)' },
              { label: 'Error', value: errorCount, color: 'var(--tt-critical)' },
              { label: 'Fallback', value: fallbackCount, color: 'var(--tt-fallback)' },
              { label: 'Degraded', value: degradedCount, color: 'var(--tt-degraded)' },
              { label: 'Unknown', value: unknownCount, color: 'var(--tt-unknown)' },
            ]}
            height={10}
            showLegend={true}
          />
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          <div className="tt-panel" style={{ padding: '12px 14px' }}>
            <div className="tt-label">Avg Success Score</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 22, color: 'var(--tt-accent)', marginTop: 4 }}>{(avgScore * 100).toFixed(0)}%</div>
          </div>
          <div className="tt-panel" style={{ padding: '12px 14px' }}>
            <div className="tt-label">Avg Cost / Session</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 22, color: 'var(--tt-text-primary)', marginTop: 4 }}>${avgCost.toFixed(3)}</div>
          </div>
          <div className="tt-panel" style={{ padding: '12px 14px' }}>
            <div className="tt-label">Avg Duration</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 22, color: 'var(--tt-text-primary)', marginTop: 4 }}>{(avgDuration / 1000).toFixed(1)}s</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 12 }}>
          <input
            type="search"
            placeholder="Search sessions by ID, provider, model, status…"
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            data-testid="session-search"
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'var(--tt-bg-secondary)',
              border: '1px solid var(--tt-border)',
              borderRadius: 5,
              color: 'var(--tt-text-primary)',
              fontSize: 13,
              fontFamily: "'Manrope', sans-serif",
              outline: 'none',
            }}
          />
        </div>

        {/* Sessions Table — powered by @tanstack/react-table */}
        <div className="tt-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(header => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        style={{
                          ...thStyle,
                          cursor: canSort ? 'pointer' : 'default',
                          userSelect: 'none',
                        }}
                        title={canSort ? 'Click to sort' : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sorted === 'asc' ? ' ↑' : sorted === 'desc' ? ' ↓' : canSort ? ' ·' : ''}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedSession(row.original)}
                  style={{ cursor: 'pointer', transition: 'background 0.1s' }}
                  data-testid={`session-table-row-${row.original.id}`}
                >
                  {row.getVisibleCells().map(cell => {
                    const align = (cell.column.columnDef.meta as { align?: 'right' } | undefined)?.align;
                    return (
                      <td
                        key={cell.id}
                        style={{ ...tdStyle, textAlign: align ?? 'left' }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={11} style={{ ...tdStyle, textAlign: 'center', color: 'var(--tt-text-muted)', padding: 32 }}>
                    No sessions match the current search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <SessionDetailSheet session={selectedSession} onClose={() => setSelectedSession(null)} />
      </div>
    </div>
  );
}
