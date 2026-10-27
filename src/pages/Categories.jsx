import { useMemo, useState } from "react";
import {
  Grid2X2,
  Shirt,
  Heart,
  Sparkles,
  ShoppingBag,
  Plus,
  ArrowRight,
  X,
} from "lucide-react";

import useWardrobe from "../hooks/useWardrobe";
import ClothingFormModal from "../components/wardrobe/ClothingFormModal";

const DEFAULT_CATEGORIES = [
  "Tops",
  "Shirts",
  "Jeans",
  "Pants",
  "Kurtis",
  "Suits",
  "Sarees",
  "Dresses",
  "Other",
];

const CATEGORY_ICONS = {
  Tops: Shirt,
  Shirts: Shirt,
  Jeans: ShoppingBag,
  Pants: ShoppingBag,
  Kurtis: Shirt,
  Suits: Sparkles,
  Sarees: Sparkles,
  Dresses: Shirt,
  Other: ShoppingBag,
};

export default function Categories({ onNavigate }) {
  const {
    families,
    activeFamily,
    activeFamilyId,
    clothes,
    categories,
    familiesLoading,
    clothesLoading,
    error,
    createClothing,
    reloadClothes,
  } = useWardrobe();

  const [modalOpen, setModalOpen] = useState(false);
  const [localError, setLocalError] = useState("");

  const availableCategories = useMemo(() => {
    const fromWardrobe = Array.isArray(categories)
      ? categories.filter(Boolean)
      : [];

    return Array.from(
      new Set([...DEFAULT_CATEGORIES, ...fromWardrobe])
    );
  }, [categories]);

  const categoryData = useMemo(() => {
    return availableCategories.map((name) => {
      const count = clothes.filter(
        (item) =>
          item.category?.toLowerCase() === name.toLowerCase()
      ).length;

      return {
        name,
        count,
        Icon: CATEGORY_ICONS[name] || Shirt,
      };
    });
  }, [availableCategories, clothes]);

  function openAddClothing() {
    setLocalError("");
    setModalOpen(true);
  }

  function closeAddClothing() {
    setModalOpen(false);
    setLocalError("");
  }

  async function handleCreateClothing(data) {
    setLocalError("");

    if (!activeFamilyId) {
      throw new Error(
        "Please create a family space first. Then you can save clothing to your wardrobe."
      );
    }

    await createClothing(data);

    if (reloadClothes) {
      await reloadClothes();
    }

    closeAddClothing();
  }

  function openCategory(category) {
    sessionStorage.setItem("wardrobe-category", category);
    onNavigate?.("My Wardrobe");
  }

  const totalPieces = clothes.length;

  if (familiesLoading || clothesLoading) {
    return (
      <section className="grid min-h-[60vh] place-items-center">
        <div className="flex items-center gap-3 rounded-2xl border border-[#EEEBF3] bg-white px-5 py-4 text-sm font-semibold text-[#6F647B] shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D9CDEE] border-t-[#7553C9]" />
          Loading categories...
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="space-y-6">
        {/* Header */}
        <div className="rounded-[2rem] border border-[#EEEAF3] bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F1EBFA] px-3 py-1.5 text-[11px] font-bold text-[#7553C9]">
                <Sparkles size={13} />
                Your wardrobe, organized
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-[#302640] sm:text-4xl">
                Categories
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#948CA3]">
                Browse your clothes by category instead of digging
                through your cupboard.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-[#FAF8FD] px-4 py-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EEE5FF] text-[#7553C9]">
                <Shirt size={24} />
              </div>

              <div>
                <p className="text-xl font-extrabold text-[#302640]">
                  {totalPieces}
                </p>

                <p className="text-[10px] font-semibold text-[#948CA3]">
                  Total pieces
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {(error || localError) && (
          <div className="flex items-start gap-3 rounded-2xl border border-[#F0D8E2] bg-[#FFF7F9] px-4 py-3 text-sm text-[#A85572]">
            <Heart size={18} className="mt-0.5 shrink-0" />

            <div className="flex-1">
              <p className="font-bold">Something needs attention</p>
              <p className="mt-1">
                {localError || error}
              </p>
            </div>

            {localError && (
              <button
                type="button"
                onClick={() => setLocalError("")}
                className="rounded-lg p-1 hover:bg-[#FCEBF1]"
                aria-label="Dismiss error"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Categories */}
        {totalPieces > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categoryData.map(({ name, count, Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => openCategory(name)}
                className="group rounded-3xl border border-[#EEEBF3] bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D9C8F0] hover:shadow-lg hover:shadow-[#5D477A]/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F0E8FF] text-[#7553C9] transition group-hover:bg-[#E8DCFF]">
                    <Icon size={23} />
                  </div>

                  <ArrowRight
                    size={17}
                    className="mt-1 text-[#B2A8BC] transition group-hover:translate-x-1 group-hover:text-[#7553C9]"
                  />
                </div>

                <h2 className="mt-5 text-sm font-extrabold text-[#392E4B]">
                  {name}
                </h2>

                <p className="mt-1 text-xs text-[#948CA3]">
                  {count} {count === 1 ? "piece" : "pieces"}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[#DCD3E5] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#F0EAF8] text-[#7553C9]">
              <Grid2X2 size={29} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-[#302640]">
              No clothes yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#968C9F]">
              Once you add your first clothing photo, your
              categories will automatically start filling up.
            </p>

            <button
              type="button"
              onClick={openAddClothing}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#5B437A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#5B437A]/15 transition hover:bg-[#4D3868]"
            >
              <Plus size={17} />
              Add clothes
            </button>
          </div>
        )}

        {/* Always-visible add button */}
        {totalPieces > 0 && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={openAddClothing}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#7553C9] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-[#6342B3]"
            >
              <Plus size={17} />
              Add clothes
            </button>
          </div>
        )}
      </section>

      {/* REAL CLOTHING UPLOAD MODAL */}
      <ClothingFormModal
        open={modalOpen}
        item={null}
        categories={availableCategories}
        onClose={closeAddClothing}
        onSubmit={handleCreateClothing}
      />
    </>
  );
}