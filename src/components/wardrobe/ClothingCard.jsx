import {
  Heart,
  Pencil,
  Trash2,
  Shirt,
} from "lucide-react";
import { getClothingImage } from "../../lib/imageUtils";

export default function ClothingCard({
  item,
  onFavorite,
  onEdit,
  onDelete,
  busy = false,
}) {
  const image = getClothingImage(item);

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#EEEBF3] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#5D477A]/10">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F3F0F7]">
        {image ? (
          <img
            src={image}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-[#A59AAF]">
            <Shirt size={42} strokeWidth={1.4} />
            <span className="mt-2 text-xs">No photo</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => onFavorite(item)}
          disabled={busy}
          aria-label={
            item.favorite
              ? `Remove ${item.name} from favorites`
              : `Add ${item.name} to favorites`
          }
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border shadow-sm backdrop-blur transition ${
            item.favorite
              ? "border-[#E6B6CC] bg-white/95 text-[#D46E9A]"
              : "border-white/70 bg-white/85 text-[#81768C] hover:text-[#D46E9A]"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <Heart
            size={18}
            fill={item.favorite ? "currentColor" : "none"}
          />
        </button>

        <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#655A70] shadow-sm backdrop-blur">
          {item.category}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-[#302640]">
              {item.name}
            </h3>

            {item.color && (
              <p className="mt-1 truncate text-xs text-[#948CA3]">
                {item.color}
              </p>
            )}
          </div>

          {item.occasion && (
            <span className="shrink-0 rounded-full bg-[#F4EFFB] px-2.5 py-1 text-[10px] font-semibold text-[#7553C9]">
              {item.occasion}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(item)}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E9E4EF] px-3 py-2.5 text-xs font-semibold text-[#675C72] transition hover:border-[#CBBCE3] hover:bg-[#FAF8FD] disabled:opacity-50"
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(item)}
            disabled={busy}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#F0DCE5] text-[#B46A88] transition hover:bg-[#FFF5F8] disabled:opacity-50"
            aria-label={`Delete ${item.name}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}