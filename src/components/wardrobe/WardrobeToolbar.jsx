import {
    Plus,
    Search,
    SlidersHorizontal,
    Users,
    X,
  } from "lucide-react";
  
  export default function WardrobeToolbar({
    families,
    activeFamilyId,
    onFamilyChange,
    search,
    onSearchChange,
    category,
    onCategoryChange,
    categories,
    onAdd,
  }) {
    return (
      <div className="rounded-3xl border border-[#EEEBF3] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A097AA]"
              />
  
              <input
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search your clothes..."
                className="h-12 w-full rounded-2xl border border-[#E5DFEB] bg-[#FCFBFD] pl-11 pr-10 text-sm text-[#302640] outline-none transition placeholder:text-[#AAA1B2] focus:border-[#B9A5D5] focus:bg-white focus:ring-4 focus:ring-[#7553C9]/10"
              />
  
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-[#8F8598] hover:bg-[#F0ECF4]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
  
            {families.length > 1 && (
              <div className="relative lg:w-56">
                <Users
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8299]"
                />
  
                <select
                  value={activeFamilyId}
                  onChange={(event) => onFamilyChange(event.target.value)}
                  className="h-12 w-full appearance-none rounded-2xl border border-[#E5DFEB] bg-[#FCFBFD] pl-10 pr-4 text-sm font-semibold text-[#40364C] outline-none focus:border-[#B9A5D5] focus:ring-4 focus:ring-[#7553C9]/10"
                >
                  {families.map((family) => (
                    <option key={family.id} value={family.id}>
                      {family.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
  
            <button
              type="button"
              onClick={onAdd}
              disabled={!activeFamilyId}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#5B437A] px-5 text-sm font-bold text-white shadow-lg shadow-[#5B437A]/15 transition hover:bg-[#4E386A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} />
              Add clothing
            </button>
          </div>
  
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-1 flex items-center gap-2 text-xs font-bold text-[#82778D]">
              <SlidersHorizontal size={15} />
              Filter
            </div>
  
            <button
              type="button"
              onClick={() => onCategoryChange("All")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                category === "All"
                  ? "bg-[#5B437A] text-white"
                  : "bg-[#F5F1F8] text-[#756A80] hover:bg-[#ECE5F3]"
              }`}
            >
              All
            </button>
  
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onCategoryChange(item)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  category === item
                    ? "bg-[#7553C9] text-white"
                    : "bg-[#F5F1F8] text-[#756A80] hover:bg-[#ECE5F3]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }