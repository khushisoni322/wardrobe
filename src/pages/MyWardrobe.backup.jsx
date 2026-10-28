import { useEffect, useMemo, useState } from "react";

import {
  CloudOff,
  Loader2,
  Plus,
  RefreshCw,
  Shirt,
  Sparkles,
} from "lucide-react";

import useWardrobe from "../hooks/useWardrobe";
import ClothingCard from "../components/wardrobe/ClothingCard";
import ClothingFormModal from "../components/wardrobe/ClothingFormModal";
import WardrobeToolbar from "../components/wardrobe/WardrobeToolbar";

const ALL_CATEGORY = "All";

export default function MyWardrobe() {
  const {
    families,
    activeFamily,
    activeFamilyId,
    setActiveFamilyId,
    clothes,
    categories,
    familiesLoading,
    clothesLoading,
    error,
    reloadClothes,
    createClothing,
    updateClothing,
    deleteClothing,
    toggleFavorite,
  } = useWardrobe();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORY);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [busyId, setBusyId] = useState("");

  // --------------------------------------------------
  // Restore category from Categories page
  // --------------------------------------------------

  useEffect(() => {
    const savedCategory = sessionStorage.getItem("wardrobe-category");

    if (savedCategory) {
      setCategory(savedCategory);
      sessionStorage.removeItem("wardrobe-category");
    }
  }, []);

  // --------------------------------------------------
  // Global search from Topbar
  // --------------------------------------------------

  useEffect(() => {
    const savedSearch = sessionStorage.getItem("wardrobe-search");

    if (savedSearch !== null) {
      setSearch(savedSearch);
      sessionStorage.removeItem("wardrobe-search");
    }

    function handleGlobalSearch(event) {
      const value = event?.detail || "";

      setSearch(String(value));

      // If user searched from another page,
      // the search should always show all categories.
      if (String(value).trim()) {
        setCategory(ALL_CATEGORY);
      }
    }

    window.addEventListener(
      "wardrobe-global-search",
      handleGlobalSearch
    );

    return () => {
      window.removeEventListener(
        "wardrobe-global-search",
        handleGlobalSearch
      );
    };
  }, []);

  // --------------------------------------------------
  // Filter clothes
  // --------------------------------------------------

  const visibleClothes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return clothes.filter((item) => {
      const itemCategory = String(item?.category || "").trim();

      const matchesCategory =
        category === ALL_CATEGORY ||
        itemCategory.toLowerCase() === category.toLowerCase();

      if (!matchesCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableValues = [
        item?.name,
        item?.category,
        item?.color,
        item?.occasion,
        item?.owner?.name,
      ];

      return searchableValues
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        );
    });
  }, [clothes, search, category]);

  // --------------------------------------------------
  // Stats
  // --------------------------------------------------

  const favoriteCount = clothes.filter(
    (item) => Boolean(item?.favorite)
  ).length;

  const categoryCount = new Set(
    clothes
      .map((item) => item?.category)
      .filter(Boolean)
  ).size;

  // --------------------------------------------------
  // Add
  // --------------------------------------------------

  function openAdd() {
    setEditingItem(null);
    setModalOpen(true);
  }

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  function openEdit(item) {
    setEditingItem(item);
    setModalOpen(true);
  }

  // --------------------------------------------------
  // Close modal
  // --------------------------------------------------

  function closeModal() {
    setModalOpen(false);
    setEditingItem(null);
  }

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Delete "${item?.name || "this item"}" from your wardrobe?`
    );

    if (!confirmed) {
      return;
    }

    if (!item?.id) {
      return;
    }

    setBusyId(item.id);

    try {
      await deleteClothing(item.id);
    } catch (err) {
      window.alert(
        err?.message || "Could not delete this item."
      );
    } finally {
      setBusyId("");
    }
  }

  // --------------------------------------------------
  // Favorite
  // --------------------------------------------------

  async function handleFavorite(item) {
    if (!item?.id) {
      return;
    }

    setBusyId(item.id);

    try {
      await toggleFavorite(item.id);
    } catch (err) {
      window.alert(
        err?.message || "Could not update favorite."
      );
    } finally {
      setBusyId("");
    }
  }

  // --------------------------------------------------
  // Submit add / edit
  // --------------------------------------------------

  async function handleSubmit(data) {
    if (editingItem?.id) {
      await updateClothing(editingItem.id, data);
    } else {
      await createClothing(data);
    }
  }

  // --------------------------------------------------
  // Clear search + category
  // --------------------------------------------------

  function showEverything() {
    setSearch("");
    setCategory(ALL_CATEGORY);

    sessionStorage.removeItem("wardrobe-search");
    sessionStorage.removeItem("wardrobe-category");
  }

  // --------------------------------------------------
  // Loading families
  // --------------------------------------------------

  if (familiesLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-[#665A72] shadow-sm">
          <Loader2
            size={18}
            className="animate-spin text-[#7553C9]"
          />

          Loading your wardrobe...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // No family
  // --------------------------------------------------

  if (!activeFamily && families.length === 0) {
    return (
      <section className="rounded-[2rem] border border-[#EEEBF3] bg-white p-8 shadow-sm sm:p-12">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#EEE6FF] text-[#7553C9]">
          <Shirt size={29} />
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-[#302640] sm:text-3xl">
          Your digital wardrobe is ready.
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#8E8498]">
          Create a family first, then you can start photographing
          your clothes and keeping your whole wardrobe here.
        </p>

        {error && (
          <div className="mt-6 rounded-2xl bg-[#FFF5F7] px-4 py-3 text-sm text-[#A85572]">
            {error}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* ------------------------------------------------
          HEADER
      ------------------------------------------------ */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F1EBFA] px-3 py-1.5 text-[11px] font-bold text-[#7553C9]">
            <Sparkles size={13} />
            Digital wardrobe
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#302640] sm:text-4xl">
            My Wardrobe
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#948CA3]">
            Keep photos of every piece you own, organized and
            ready when you are deciding what to wear.
          </p>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-2xl border border-[#EEEBF3] bg-white px-4 py-3 text-center shadow-sm">
            <p className="text-xl font-extrabold text-[#302640]">
              {clothes.length}
            </p>

            <p className="mt-0.5 text-[10px] font-semibold text-[#948CA3]">
              Pieces
            </p>
          </div>

          <div className="rounded-2xl border border-[#EEEBF3] bg-white px-4 py-3 text-center shadow-sm">
            <p className="text-xl font-extrabold text-[#D46E9A]">
              {favoriteCount}
            </p>

            <p className="mt-0.5 text-[10px] font-semibold text-[#948CA3]">
              Favorites
            </p>
          </div>

          <div className="rounded-2xl border border-[#EEEBF3] bg-white px-4 py-3 text-center shadow-sm">
            <p className="text-xl font-extrabold text-[#7553C9]">
              {categoryCount}
            </p>

            <p className="mt-0.5 text-[10px] font-semibold text-[#948CA3]">
              Categories
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------
          TOOLBAR
      ------------------------------------------------ */}

      <WardrobeToolbar
        families={families}
        activeFamilyId={activeFamilyId}
        onFamilyChange={setActiveFamilyId}
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        onAdd={openAdd}
      />

      {/* ------------------------------------------------
          ERROR
      ------------------------------------------------ */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#F0D8E2] bg-[#FFF7F9] px-4 py-3 text-sm text-[#A85572]">
          <CloudOff
            size={18}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1">
            <p className="font-bold">
              Something went wrong
            </p>

            <p className="mt-1">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={reloadClothes}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#765F85] shadow-sm transition hover:bg-[#FAF7FF]"
          >
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      )}

      {/* ------------------------------------------------
          FAMILY LABEL
      ------------------------------------------------ */}

      {activeFamily && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-[#958A9E]">
            Showing{" "}
            <span className="font-extrabold text-[#5C5066]">
              {activeFamily.name}
            </span>
            's wardrobe
          </p>

          {category !== ALL_CATEGORY && (
            <button
              type="button"
              onClick={() => setCategory(ALL_CATEGORY)}
              className="text-xs font-bold text-[#7553C9] hover:underline"
            >
              Clear category
            </button>
          )}
        </div>
      )}

      {/* ------------------------------------------------
          CLOTHES
      ------------------------------------------------ */}

      {clothesLoading ? (
        <div className="grid place-items-center rounded-3xl border border-[#EEEBF3] bg-white py-20">
          <div className="flex items-center gap-3 text-sm font-semibold text-[#786D82]">
            <Loader2
              size={18}
              className="animate-spin text-[#7553C9]"
            />

            Loading clothes...
          </div>
        </div>
      ) : visibleClothes.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
          {/* Existing clothing */}

          {visibleClothes.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              busy={busyId === item.id}
              onFavorite={handleFavorite}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}

          {/* ------------------------------------------------
              ADD MORE CARD
          ------------------------------------------------ */}

          <button
            type="button"
            onClick={openAdd}
            className="group flex min-h-[420px] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#DED3EF] bg-white px-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-[#7650C9] hover:bg-[#FBF8FF] hover:shadow-lg hover:shadow-[#7650C9]/10"
          >
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#F0E7FF] text-[#7650C9] transition-transform duration-200 group-hover:scale-110">
              <Plus
                size={30}
                strokeWidth={2}
              />
            </span>

            <span className="mt-5 text-base font-extrabold text-[#302640]">
              Add more
            </span>

            <span className="mt-2 max-w-[220px] text-xs leading-5 text-[#9A91A5]">
              Add another piece to your wardrobe
              {category !== ALL_CATEGORY
                ? ` in ${category}`
                : ""}
            </span>
          </button>
        </div>
      ) : (
        /* ------------------------------------------------
           EMPTY / NO RESULTS
        ------------------------------------------------ */

        <div className="rounded-[2rem] border border-dashed border-[#DCD3E5] bg-white px-6 py-16 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#F0EAF8] text-[#7553C9]">
            {search || category !== ALL_CATEGORY ? (
              <SearchIcon />
            ) : (
              <Shirt size={29} />
            )}
          </div>

          <h2 className="mt-5 text-xl font-extrabold text-[#302640]">
            {search || category !== ALL_CATEGORY
              ? "No clothes found"
              : "Your wardrobe is empty"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#968C9F]">
            {search || category !== ALL_CATEGORY
              ? `No ${
                  category !== ALL_CATEGORY
                    ? category.toLowerCase()
                    : "matching"
                } clothes found. Add one now and it will appear here.`
              : "Take a photo of your clothes and add them here. Next time you wonder what to wear, your whole wardrobe will be right here."}
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {/* ADD MORE */}

            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#5B437A] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#5B437A]/15 transition hover:-translate-y-0.5 hover:bg-[#4F396B]"
            >
              <Plus size={17} />
              {category !== ALL_CATEGORY
                ? `Add ${category}`
                : "Add More"}
            </button>

            {/* SHOW EVERYTHING */}

            {(search || category !== ALL_CATEGORY) && (
              <button
                type="button"
                onClick={showEverything}
                className="rounded-2xl border border-[#E4DCEE] bg-white px-6 py-3 text-sm font-bold text-[#5B437A] transition hover:bg-[#FAF7FF]"
              >
                Show everything
              </button>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------
          ADD / EDIT MODAL
      ------------------------------------------------ */}

      <ClothingFormModal
        open={modalOpen}
        item={editingItem}
        categories={categories}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

/* ----------------------------------------------------
   Search Icon
---------------------------------------------------- */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
      />

      <path d="m16 16 4 4" />
    </svg>
  );
}