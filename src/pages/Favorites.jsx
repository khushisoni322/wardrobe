import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Loader2,
  Sparkles,
} from "lucide-react";

import useWardrobe from "../hooks/useWardrobe";
import ClothingCard from "../components/wardrobe/ClothingCard";

export default function Favorites({ onNavigate }) {
  const {
    clothes,
    familiesLoading,
    clothesLoading,
    error,
    toggleFavorite,
    deleteClothing,
  } = useWardrobe();

  const [busyId, setBusyId] = useState("");

  const favorites = useMemo(
    () => clothes.filter((item) => item.favorite),
    [clothes]
  );

  const handleFavorite = async (item) => {
    setBusyId(item.id);

    try {
      await toggleFavorite(item.id);
    } catch (err) {
      window.alert(err.message || "Could not update favorite.");
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.name}" from your wardrobe?`
    );

    if (!confirmed) return;

    setBusyId(item.id);

    try {
      await deleteClothing(item.id);
    } catch (err) {
      window.alert(err.message || "Could not delete this item.");
    } finally {
      setBusyId("");
    }
  };

  if (familiesLoading || clothesLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-[#665A72] shadow-sm">
          <Loader2 size={18} className="animate-spin text-[#D46E9A]" />
          Finding your favorites...
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-[#EEEBF3] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FFF0F5] px-3 py-1.5 text-[11px] font-bold text-[#C05D84]">
              <Heart size={13} fill="currentColor" />
              Your loved pieces
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#302640]">
              Favorites
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#948CA3]">
              Your go-to clothes, saved in one place for those days when
              you don't want to think too much.
            </p>
          </div>

          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#FFF0F5] text-[#D46E9A]">
            <Heart size={28} fill="currentColor" />
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-[#F0D8E2] bg-[#FFF7F9] px-4 py-3 text-sm font-medium text-[#A85572]">
            {error}
          </div>
        )}
      </div>

      {favorites.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#655A70]">
              {favorites.length}{" "}
              {favorites.length === 1 ? "favorite piece" : "favorite pieces"}
            </p>

            <button
              type="button"
              onClick={() => onNavigate?.("My Wardrobe")}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#7553C9] hover:underline"
            >
              <ArrowLeft size={14} />
              Back to wardrobe
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
            {favorites.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                busy={busyId === item.id}
                onFavorite={handleFavorite}
                onDelete={handleDelete}
                onEdit={() => {
                  onNavigate?.("My Wardrobe");
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-[#E4D9E1] bg-white px-6 py-16 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#FFF0F5] text-[#D46E9A]">
            <Sparkles size={29} />
          </div>

          <h2 className="mt-5 text-xl font-extrabold text-[#302640]">
            No favorites yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#968C9F]">
            Tap the heart on clothes you love. They'll show up here so
            your favorite pieces are always easy to find.
          </p>

          <button
            type="button"
            onClick={() => onNavigate?.("My Wardrobe")}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#5B437A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#5B437A]/15"
          >
            <Heart size={16} />
            Explore my wardrobe
          </button>
        </div>
      )}
    </section>
  );
}