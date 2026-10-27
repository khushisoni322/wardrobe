import { Heart } from 'lucide-react'

export default function ClothingCard({
  item,
  owner,
  onSelect,
  onToggleFavorite,
}) {
  if (!item) return null

  return (
    <article
      className="
        group min-w-0 overflow-hidden rounded-2xl
        border border-stone-200/80 bg-white
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
        hover:shadow-stone-200/50
      "
    >
      {/* Clothing photo */}
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <button
          type="button"
          onClick={() => onSelect(item)}
          className="absolute inset-0 h-full w-full"
          aria-label={`View ${item.name}`}
        >
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="
              h-full w-full object-cover
              transition-transform duration-500
              group-hover:scale-105
            "
          />
        </button>

        {/* Category */}
        <span
          className="
            pointer-events-none absolute left-3 top-3
            rounded-full bg-white/95 px-2.5 py-1.5
            text-[10px] font-medium text-stone-700 shadow-sm
          "
        >
          {item.category}
        </span>

        {/* Favourite button */}
        <button
          type="button"
          onClick={() => onToggleFavorite(item.id)}
          aria-label={
            item.favorite
              ? 'Remove from favourites'
              : 'Add to favourites'
          }
          aria-pressed={Boolean(item.favorite)}
          className={`
            absolute right-3 top-3
            flex h-9 w-9 items-center justify-center
            rounded-full shadow-sm transition
            ${
              item.favorite
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/95 text-stone-500 hover:text-rose-500'
            }
          `}
        >
          <Heart
            size={17}
            fill={item.favorite ? 'currentColor' : 'none'}
          />
        </button>

        {/* Clothing owner */}
        <span
          className="
            pointer-events-none absolute bottom-3 left-3
            flex max-w-[calc(100%-24px)] items-center gap-1.5
            rounded-full bg-white/95 px-2.5 py-1.5
            text-[10px] font-medium text-stone-600 shadow-sm
          "
        >
          <span className="text-sm">
            {owner?.emoji || '👗'}
          </span>

          <span className="truncate">
            {owner?.name || 'My Wardrobe'}
          </span>
        </span>
      </div>

      {/* Clothing information */}
      <div className="p-3.5 sm:p-4">
        <button
          type="button"
          onClick={() => onSelect(item)}
          className="
            block w-full truncate text-left
            text-sm font-semibold text-stone-800
            transition hover:text-amber-800
            focus-visible:outline-none
            focus-visible:underline
          "
        >
          {item.name}
        </button>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-stone-400">
            {item.color || 'Colour not specified'}
          </span>

          <span
            className="
              shrink-0 rounded-full bg-stone-100
              px-2 py-1 text-[10px] text-stone-500
            "
          >
            {item.occasion || 'Everyday'}
          </span>
        </div>
      </div>
    </article>
  )
}