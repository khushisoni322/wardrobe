import { ArrowRight, Plus } from "lucide-react";
import ClothingCard from "../wardrobe/ClothingCard";
import { sampleClothes } from "../../data/sampleClothes";

export default function RecentClothes({
  clothes = sampleClothes,
  onNavigate,
  onAddClothing,
  onToggleFavorite,
  onOpenClothing,
}) {
  function handleEdit(item) {
    onOpenClothing?.(item);
  }

  function handleDelete(item) {
    console.log("Delete requested:", item);
  }

  return (
    <section className="mb-9 mt-8">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="mb-2 text-[9px] font-extrabold tracking-[1.2px] text-[#A18BBD]">
            FRESHLY ORGANIZED
          </p>

          <h2 className="text-[17px] font-extrabold tracking-tight text-[#392E4B]">
            Your latest pieces
          </h2>

          <p className="mt-1 text-xs leading-6 text-[#948CA3]">
            A little look at what's in your wardrobe.
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onAddClothing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9E5F0] bg-white px-3 py-2 text-[10px] font-bold text-[#514966] hover:bg-[#F8F6FC]"
          >
            <Plus size={15} />
            Add piece
          </button>

          <button
            type="button"
            onClick={() => onNavigate("My Wardrobe")}
            className="inline-flex items-center gap-1.5 px-1 py-2 text-[10px] font-bold text-[#7958BA] hover:text-[#563592]"
          >
            View all <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {clothes.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {clothes.slice(0, 4).map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              onFavorite={onToggleFavorite}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#DCD3E9] bg-white p-8 text-center">
          <p className="text-sm font-bold text-[#493B59]">
            Your wardrobe is waiting!
          </p>

          <p className="mt-2 text-xs text-[#948CA3]">
            Add your first clothing item to get started.
          </p>
        </div>
      )}
    </section>
  );
}