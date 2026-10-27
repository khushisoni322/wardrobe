import { memo } from 'react'

/**
 * Reusable sidebar navigation item.
 *
 * Props:
 * - icon: Lucide icon component
 * - label: Navigation label
 * - active: Whether this item is selected
 * - count: Optional badge count
 * - onClick: Click handler
 */
export const SidebarItem = memo(function SidebarItem({
  icon: Icon,
  label,
  active = false,
  count,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`
        group flex w-full items-center gap-3 rounded-xl px-3.5 py-3
        text-sm transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-stone-400 focus-visible:ring-offset-2
        ${
          active
            ? 'bg-stone-900 font-medium text-white shadow-sm'
            : 'text-stone-500 hover:bg-white hover:text-stone-800'
        }
      `}
    >
      {Icon && (
        <Icon
          size={18}
          strokeWidth={1.8}
          className="shrink-0 transition-transform duration-200 group-hover:scale-105"
        />
      )}

      <span className="flex-1 text-left">{label}</span>

      {typeof count === 'number' && count > 0 && (
        <span
          className={`
            rounded-full px-2 py-0.5 text-[10px] font-medium
            ${
              active
                ? 'bg-white/15 text-white'
                : 'bg-stone-100 text-stone-500'
            }
          `}
        >
          {count}
        </span>
      )}
    </button>
  )
})

/**
 * Reusable dashboard statistics card.
 *
 * Props:
 * - icon: Lucide icon component
 * - label: Statistic title
 * - value: Statistic value
 * - detail: Supporting text
 */
export const StatCard = memo(function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}) {
  return (
    <article
      className="
        group rounded-2xl border border-stone-200/80 bg-white
        p-4 transition-all duration-200
        hover:-translate-y-0.5 hover:border-stone-300
        hover:shadow-md sm:p-5
      "
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium text-stone-500">
          {label}
        </span>

        {Icon && (
          <span
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-xl bg-[#f5f0e8] text-stone-600
              transition-colors duration-200
              group-hover:bg-[#eee4d5]
            "
          >
            <Icon size={17} strokeWidth={1.8} />
          </span>
        )}
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
        {value}
      </p>

      {detail && (
        <p className="mt-1 text-[10px] leading-4 text-stone-400 sm:text-xs">
          {detail}
        </p>
      )}
    </article>
  )
})

/**
 * Reusable row for displaying clothing details.
 *
 * Props:
 * - label: Detail label
 * - value: Detail value
 */
export const DetailRow = memo(function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-stone-200 py-3 last:border-b-0">
      <span className="shrink-0 text-stone-500">{label}</span>

      <span className="break-words text-right font-medium text-stone-800">
        {value ?? 'Not specified'}
      </span>
    </div>
  )
})