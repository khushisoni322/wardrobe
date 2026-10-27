import { ArrowRight } from "lucide-react";
import { clothingCategories } from "../../data/sampleClothes";

export default function CategoryShortcuts({ onNavigate, onSelectCategory }) {
  return (
    <section className="mb-9 mt-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-[9px] font-extrabold tracking-[1.2px] text-[#A18BBD]">
            YOUR COLLECTION
          </p>
          <h2 className="text-[17px] font-extrabold tracking-tight text-[#392E4B]">
            Browse by category
          </h2>
          <p className="mt-1 text-xs leading-6 text-[#948CA3]">
            Everything you own, right where it belongs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("Categories")}
          className="inline-flex shrink-0 items-center gap-2 text-[11px] font-bold text-[#7958BA] hover:text-[#563592]"
        >
          View all <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {clothingCategories.map((category) => (
          <button
            type="button"
            key={category.name}
            onClick={() => onSelectCategory(category.name)}
            className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#EEEBF3] bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-[#D9CAEF] sm:p-4"
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl"
              style={{ backgroundColor: category.background }}
            >
              {category.emoji}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-[#493B59]">
                {category.name}
              </span>
              <span className="mt-1 block text-[10px] text-[#A198AF]">
                {category.count} pieces
              </span>
            </span>

            <ArrowRight size={15} className="shrink-0 text-[#B1A6C3]" />
          </button>
        ))}
      </div>
    </section>
  );
}