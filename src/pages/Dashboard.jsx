
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Heart,
  Layers3,
  Plus,
  Shirt,
  Sparkles,
} from "lucide-react";

import useWardrobe from "../hooks/useWardrobe";
import ClothingFormModal from "../components/wardrobe/ClothingFormModal";

const FALLBACK_CATEGORIES = [
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

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  onClick,
  iconClass,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-3xl border border-[#E9E3F0] bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#D8C8ED] hover:shadow-lg hover:shadow-[#5B437A]/8"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl ${iconClass}`}
        >
          <Icon size={23} />
        </div>

        <ArrowUpRight
          size={19}
          className="text-[#B5AABE] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#7553C9]"
        />
      </div>

      <p className="mt-6 text-xs font-bold text-[#948CA3]">
        {label}
      </p>

      <p className="mt-1 text-4xl font-extrabold tracking-tight text-[#302640]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#A29AAA]">
        {description}
      </p>
    </button>
  );
}

export default function Dashboard({ onNavigate, user }) {
  const {
    clothes = [],
    categories = [],
    clothesLoading,
    error,
    createClothing,
  } = useWardrobe();

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const totalPieces = clothes.length;

  const categoryCount = useMemo(() => {
    const unique = new Set(
      clothes
        .map((item) => item.category?.trim())
        .filter(Boolean)
        .map((category) => category.toLowerCase())
    );

    return unique.size;
  }, [clothes]);

  const favoriteCount = useMemo(
    () =>
      clothes.filter((item) => Boolean(item.favorite)).length,
    [clothes]
  );

  const styleMomentCount = useMemo(() => {
    const unique = new Set(
      clothes
        .map((item) => item.occasion?.trim())
        .filter(Boolean)
        .map((occasion) => occasion.toLowerCase())
    );

    return unique.size;
  }, [clothes]);

  const displayCategories =
    Array.isArray(categories) && categories.length > 0
      ? categories
      : FALLBACK_CATEGORIES;

  const displayName =
    user?.name?.trim()?.split(" ")[0] || "lovely";

  // Both dashboard buttons open the same clothing modal.
  function openAddClothing() {
    setModalError("");
    setModalOpen(true);
  }

  function closeAddClothing() {
    if (saving) return;

    setModalOpen(false);
    setModalError("");
  }

  async function handleCreateClothing(data) {
    try {
      setSaving(true);
      setModalError("");

      await createClothing(data);

      setModalOpen(false);
    } catch (err) {
      setModalError(
        err?.message || "Unable to add clothing. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-7">
      {/* Dashboard heading */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8E7AA7]">
            <Sparkles size={14} />
            Your personal dashboard
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#302640] sm:text-4xl">
            Hello, {displayName}! ✨
          </h1>

          <p className="mt-2 text-sm text-[#948CA3]">
            Your wardrobe is ready for another beautiful day.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddClothing}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#7553C9] px-5 text-sm font-extrabold text-white shadow-lg shadow-[#7553C9]/20 transition hover:bg-[#6645B4] hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Add pieces
        </button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[2rem] border border-[#E5D8F5] bg-gradient-to-br from-[#F2E7FF] via-[#FAF2FF] to-[#FFF0F4] p-7 sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7553C9]">
            <Sparkles size={15} />
            Your personal style space
          </p>

          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-[#302640] sm:text-5xl">
            Your style,
            <br />
            <span className="text-[#7553C9]">
              beautifully organized.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#887C97] sm:text-base">
            Every piece has a place. Every outfit tells your story.
            Let's make getting dressed your favorite part of the day.
          </p>

          <button
            type="button"
            onClick={openAddClothing}
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#7553C9] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#7553C9]/20 transition hover:bg-[#6645B4]"
          >
            <Shirt size={18} />
            Add your pieces
            <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[20px] border-white/50" />

        <div className="pointer-events-none absolute -bottom-24 right-20 h-64 w-64 rounded-full border border-[#DCC8F5]/70" />
      </div>

      {/* Stats */}
      <div>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#302640] sm:text-2xl">
              Your wardrobe at a glance
            </h2>

            <p className="mt-1 text-sm text-[#948CA3]">
              Little details that make life easier.
            </p>
          </div>

          <span className="hidden items-center gap-2 rounded-full border border-[#E7E0EF] bg-white px-3 py-2 text-[11px] font-bold text-[#948CA3] sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#70C49A]" />
            Your style space
          </span>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-[#F2D6DF] bg-[#FFF7F9] px-4 py-3 text-sm font-semibold text-[#B46A88]">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Shirt}
            label="Total pieces"
            value={clothesLoading ? "…" : totalPieces}
            description="Across your wardrobe"
            iconClass="bg-[#EEE3FF] text-[#7553C9]"
            onClick={() => onNavigate?.("My Wardrobe")}
          />

          <StatCard
            icon={Layers3}
            label="Categories"
            value={clothesLoading ? "…" : categoryCount}
            description="Your style collection"
            iconClass="bg-[#FFF0DD] text-[#D28A42]"
            onClick={() => onNavigate?.("Categories")}
          />

          <StatCard
            icon={Heart}
            label="Favorites"
            value={clothesLoading ? "…" : favoriteCount}
            description="Pieces you love most"
            iconClass="bg-[#FBE3EE] text-[#D46E9A]"
            onClick={() => onNavigate?.("Favorites")}
          />

          <StatCard
            icon={Sparkles}
            label="Style moments"
            value={clothesLoading ? "…" : styleMomentCount}
            description="Different occasions"
            iconClass="bg-[#E1F5EA] text-[#55A879]"
            onClick={() => onNavigate?.("Outfits")}
          />
        </div>
      </div>

      {/* Empty state */}
      {!clothesLoading && totalPieces === 0 && (
        <div className="rounded-[2rem] border border-dashed border-[#DCD3E5] bg-white px-6 py-12 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#F0EAF8] text-[#7553C9]">
            <Shirt size={28} />
          </div>

          <h3 className="mt-5 text-xl font-extrabold text-[#302640]">
            Your wardrobe is waiting for you
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#968C9F]">
            Upload your first clothing photo and start building your digital
            wardrobe.
          </p>

          <button
            type="button"
            onClick={openAddClothing}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#7553C9] px-5 py-3 text-sm font-extrabold text-white"
          >
            <Plus size={17} />
            Upload a photo
          </button>
        </div>
      )}

      {/* Add clothing modal */}
      <ClothingFormModal
        open={modalOpen}
        item={null}
        categories={displayCategories}
        onClose={closeAddClothing}
        onSubmit={handleCreateClothing}
      />

      {/* Modal submission error */}
      {modalError && (
        <div
          role="alert"
          className="fixed bottom-5 right-5 z-[150] max-w-sm rounded-2xl border border-[#F2D6DF] bg-white px-5 py-4 text-sm font-semibold text-[#B46A88] shadow-xl"
        >
          {modalError}

          <button
            type="button"
            onClick={() => setModalError("")}
            className="ml-3 font-extrabold underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </section>
  );
}
