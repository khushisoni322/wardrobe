import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Plus,
  Sparkles,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";

import { familyAPI, clothingAPI } from "../lib/api";

const CATEGORY_ORDER = [
  "Tops",
  "Shirts",
  "Bottoms",
  "Dresses",
  "Ethnic",
  "Outerwear",
  "Activewear",
  "Footwear",
  "Accessories",
  "Sleepwear",
  "Other",
];

function getClothingId(item) {
  return item?.id || item?._id || item?.clothingId;
}

function getImage(item) {
  return (
    item?.imageUrl ||
    item?.image ||
    item?.photoUrl ||
    item?.photos?.[0]?.url ||
    item?.photos?.[0]?.imageUrl ||
    ""
  );
}

function getCategory(item) {
  return item?.category || "Other";
}

function getName(item) {
  return item?.name || "Clothing piece";
}

/*
  IMPORTANT:
  Every logged-in account gets a separate outfit storage key.

  Example:
  wardrobe-outfits:user-id-1
  wardrobe-outfits:user-id-2
*/
function getOutfitStorageKey(user) {
  const accountId =
    user?.id ||
    user?.userId ||
    user?.email ||
    user?.username ||
    user?.name ||
    "guest";

  return `wardrobe-outfits:${String(accountId)
    .trim()
    .toLowerCase()}`;
}

function readOutfits(storageKey) {
  try {
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Outfits({ user }) {
  const [clothes, setClothes] = useState([]);
  const [outfits, setOutfits] = useState([]);

  const [loading, setLoading] = useState(true);
  const [outfitsLoaded, setOutfitsLoaded] = useState(false);

  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);

  const [outfitName, setOutfitName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  /*
    Validation popup
  */
  const [validationPopup, setValidationPopup] = useState({
    open: false,
    title: "",
    message: "",
  });

  const outfitStorageKey = useMemo(
    () => getOutfitStorageKey(user),
    [user?.id, user?.userId, user?.email, user?.username, user?.name]
  );

  /*
    Load only current account's outfits.
  */
  useEffect(() => {
    const accountOutfits = readOutfits(outfitStorageKey);

    setOutfits(accountOutfits);
    setOutfitsLoaded(true);

    setCreateOpen(false);
    setOutfitName("");
    setSelectedIds([]);
    setSelectedCategory("All");
    setError("");

    setValidationPopup({
      open: false,
      title: "",
      message: "",
    });
  }, [outfitStorageKey]);

  /*
    Save only current account's outfits.
  */
  useEffect(() => {
    if (!outfitsLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        outfitStorageKey,
        JSON.stringify(outfits)
      );
    } catch {
      setError("Unable to save outfits on this device.");
    }
  }, [outfits, outfitStorageKey, outfitsLoaded]);

  /*
    Load current family's wardrobe.
  */
  useEffect(() => {
    let cancelled = false;

    async function loadWardrobe() {
      try {
        setLoading(true);
        setError("");

        const familyResult = await familyAPI.list();

        const families = Array.isArray(familyResult)
          ? familyResult
          : familyResult?.families ||
            familyResult?.data ||
            [];

        const family =
          families.find(
            (item) =>
              item?.isDefault ||
              item?.default ||
              item?.ownerId === user?.id
          ) || families[0];

        if (!family?.id) {
          if (!cancelled) {
            setClothes([]);
          }

          return;
        }

        const clothingResult = await clothingAPI.list(
          family.id
        );

        const wardrobe =
          Array.isArray(clothingResult)
            ? clothingResult
            : clothingResult?.clothes ||
              clothingResult?.items ||
              clothingResult?.data ||
              [];

        if (!cancelled) {
          setClothes(wardrobe);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message ||
              "Unable to load your wardrobe."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (user) {
      loadWardrobe();
    } else {
      setLoading(false);
      setClothes([]);
    }

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.email]);

  /*
    Categories available in wardrobe.
  */
  const categories = useMemo(() => {
    const existing = new Set(
      clothes.map((item) => getCategory(item))
    );

    return [
      "All",
      ...CATEGORY_ORDER.filter((category) =>
        existing.has(category)
      ),
      ...Array.from(existing).filter(
        (category) =>
          !CATEGORY_ORDER.includes(category)
      ),
    ];
  }, [clothes]);

  /*
    Clothes shown inside outfit builder.
  */
  const filteredClothes = useMemo(() => {
    if (selectedCategory === "All") {
      return clothes;
    }

    return clothes.filter(
      (item) =>
        getCategory(item) === selectedCategory
    );
  }, [clothes, selectedCategory]);

  /*
    Currently selected clothes.
  */
  const selectedClothes = useMemo(
    () =>
      clothes.filter((item) =>
        selectedIds.includes(
          getClothingId(item)
        )
      ),
    [clothes, selectedIds]
  );

  function openValidationPopup(title, message) {
    setValidationPopup({
      open: true,
      title,
      message,
    });
  }

  function closeValidationPopup() {
    setValidationPopup({
      open: false,
      title: "",
      message: "",
    });
  }

  function openCreate() {
    setError("");
    setOutfitName("");
    setSelectedIds([]);
    setSelectedCategory("All");

    setCreateOpen(true);
  }

  function closeCreate() {
    setCreateOpen(false);
    setOutfitName("");
    setSelectedIds([]);
    setSelectedCategory("All");
    setError("");
  }

  function toggleClothing(item) {
    const id = getClothingId(item);

    if (!id) {
      return;
    }

    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter(
            (itemId) => itemId !== id
          )
        : [...current, id]
    );
  }

  function saveOutfit() {
    const cleanName = outfitName.trim();

    /*
      FIRST VALIDATION:
      Outfit name required.
    */
    if (!cleanName) {
      openValidationPopup(
        "Give your outfit a name",
        "Please enter a name for your outfit before saving it."
      );

      return;
    }

    /*
      SECOND VALIDATION:
      At least one clothing item required.
    */
    if (selectedClothes.length === 0) {
      openValidationPopup(
        "Choose some clothes",
        "Please select at least one clothing piece for this outfit."
      );

      return;
    }

    const newOutfit = {
      id: `outfit-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

      name: cleanName,

      createdAt: new Date().toISOString(),

      items: selectedClothes.map((item) => ({
        id: getClothingId(item),
        name: getName(item),
        category: getCategory(item),
        color: item?.color || "",
        imageUrl: getImage(item),
      })),
    };

    setOutfits((current) => [
      newOutfit,
      ...current,
    ]);

    setError("");

    closeCreate();
  }

  function deleteOutfit(id) {
    const confirmed = window.confirm(
      "Delete this outfit?"
    );

    if (!confirmed) {
      return;
    }

    setOutfits((current) =>
      current.filter(
        (outfit) => outfit.id !== id
      )
    );
  }

  return (
    <section className="space-y-7">
      {/* HEADER */}
      <div className="rounded-3xl border border-[#EEEBF3] bg-white p-7 sm:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEE3FF] text-[#7553C9]">
              <Sparkles size={25} />
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#302640]">
              Outfits
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#948CA3]">
              Create and organize your favorite
              outfit combinations from the clothes
              already in your wardrobe.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7553C9] px-5 text-sm font-extrabold text-white shadow-lg shadow-[#7553C9]/20 transition hover:bg-[#6747B5] active:scale-[0.98]"
          >
            <Plus size={18} />
            Create outfit
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-[#F4D5DE] bg-[#FFF7F9] px-4 py-3 text-sm font-semibold text-[#B85D79]">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-3 rounded-lg p-1 hover:bg-white"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* MY OUTFITS */}
      <div>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#302640]">
              My outfits
            </h2>

            <p className="mt-1 text-xs text-[#948CA3]">
              {outfits.length === 0
                ? "Your saved outfit combinations will appear here."
                : `${outfits.length} saved ${
                    outfits.length === 1
                      ? "outfit"
                      : "outfits"
                  }`}
            </p>
          </div>
        </div>

        {outfits.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#DCCEF0] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E7FF] text-[#7553C9]">
              <Sparkles size={28} />
            </div>

            <h3 className="mt-5 text-lg font-extrabold text-[#302640]">
              No outfits yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#948CA3]">
              Pick pieces from your wardrobe and
              create your first outfit combination.
            </p>

            <button
              type="button"
              onClick={openCreate}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7553C9] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#7553C9]/20 transition hover:bg-[#6747B5]"
            >
              <Plus size={17} />
              Create your first outfit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {outfits.map((outfit) => (
              <div
                key={outfit.id}
                className="overflow-hidden rounded-3xl border border-[#E9E3F0] bg-white shadow-sm"
              >
                {/* IMAGES */}
                <div className="grid h-56 grid-cols-2 gap-1 bg-[#F7F4FA]">
                  {outfit.items
                    .slice(0, 4)
                    .map((item, index) => (
                      <div
                        key={`${outfit.id}-${item.id}-${index}`}
                        className="relative overflow-hidden bg-[#F4F0F8]"
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-full place-items-center px-3 text-center">
                            <span className="text-xs font-bold text-[#9A91A5]">
                              {item.name}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                  {outfit.items.length === 1 && (
                    <div className="hidden bg-[#F4F0F8] sm:block" />
                  )}
                </div>

                {/* INFO */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-extrabold text-[#302640]">
                        {outfit.name}
                      </h3>

                      <p className="mt-1 text-xs text-[#948CA3]">
                        {outfit.items.length}{" "}
                        {outfit.items.length === 1
                          ? "piece"
                          : "pieces"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteOutfit(outfit.id)
                      }
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#F0DCE3] text-[#B96A85] transition hover:bg-[#FFF5F8]"
                      aria-label={`Delete ${outfit.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {outfit.items.map((item) => (
                      <span
                        key={`${outfit.id}-${item.id}`}
                        className="rounded-full bg-[#F3EDFF] px-2.5 py-1 text-[10px] font-bold text-[#7553C9]"
                      >
                        {item.category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE OUTFIT MODAL */}
      {createOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#241B30]/45 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeCreate();
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-[#E7E0EF] bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#EEE9F3] px-5 py-4 sm:px-7">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9A83BC]">
                  Outfit builder
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-[#302640]">
                  Create an outfit
                </h2>
              </div>

              <button
                type="button"
                onClick={closeCreate}
                className="grid h-10 w-10 place-items-center rounded-xl bg-[#F6F2FA] text-[#766B82] transition hover:bg-[#EEE8F5]"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {/* BODY */}
            <div className="max-h-[calc(92vh-145px)] overflow-y-auto p-5 sm:p-7">
              {/* OUTFIT NAME */}
              <label className="block">
                <span className="mb-2 block text-xs font-extrabold text-[#4C4058]">
                  Outfit name
                </span>

                <input
                  type="text"
                  value={outfitName}
                  onChange={(event) =>
                    setOutfitName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Sunday brunch"
                  className="h-12 w-full rounded-xl border border-[#E5DDEC] bg-white px-4 text-sm font-medium text-[#302640] outline-none transition placeholder:text-[#AAA1B3] focus:border-[#BFA7DE] focus:ring-4 focus:ring-[#F1E9FC]"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      saveOutfit();
                    }
                  }}
                />
              </label>

              {/* CATEGORY FILTER */}
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#302640]">
                      Choose your pieces
                    </h3>

                    <p className="mt-1 text-xs text-[#948CA3]">
                      Select as many clothes as you want.
                    </p>
                  </div>

                  <span className="rounded-full bg-[#F0E7FF] px-3 py-1.5 text-[10px] font-extrabold text-[#7553C9]">
                    {selectedIds.length} selected
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        setSelectedCategory(
                          category
                        )
                      }
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition ${
                        selectedCategory === category
                          ? "bg-[#7553C9] text-white"
                          : "bg-[#F4F0F8] text-[#766B82] hover:bg-[#ECE5F5]"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* CLOTHING */}
              <div className="mt-4">
                {loading ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({
                      length: 8,
                    }).map((_, index) => (
                      <div
                        key={index}
                        className="h-52 animate-pulse rounded-2xl bg-[#F2EEF6]"
                      />
                    ))}
                  </div>
                ) : filteredClothes.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#DDD3E8] px-5 py-12 text-center">
                    <p className="text-sm font-extrabold text-[#4D4159]">
                      No clothes in this category
                    </p>

                    <p className="mt-1 text-xs text-[#948CA3]">
                      Add clothes to your wardrobe
                      first.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredClothes.map((item) => {
                      const id = getClothingId(item);

                      const selected =
                        selectedIds.includes(id);

                      const image = getImage(item);

                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() =>
                            toggleClothing(item)
                          }
                          className={`group relative overflow-hidden rounded-2xl border-2 bg-white text-left transition ${
                            selected
                              ? "border-[#7553C9] shadow-lg shadow-[#7553C9]/15"
                              : "border-[#EEE8F3] hover:border-[#CDBBE5]"
                          }`}
                        >
                          <div className="aspect-[4/5] overflow-hidden bg-[#F5F1F8]">
                            {image ? (
                              <img
                                src={image}
                                alt={getName(item)}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="grid h-full place-items-center p-4 text-center">
                                <span className="text-xs font-bold text-[#9A91A5]">
                                  {getName(item)}
                                </span>
                              </div>
                            )}
                          </div>

                          {selected && (
                            <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-[#7553C9] text-white shadow-lg">
                              <Check
                                size={17}
                                strokeWidth={3}
                              />
                            </span>
                          )}

                          <div className="p-3">
                            <p className="truncate text-xs font-extrabold text-[#302640]">
                              {getName(item)}
                            </p>

                            <p className="mt-1 truncate text-[10px] text-[#948CA3]">
                              {getCategory(item)}
                              {item?.color
                                ? ` • ${item.color}`
                                : ""}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col-reverse gap-2 border-t border-[#EEE9F3] bg-[#FCFAFE] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">
              <button
                type="button"
                onClick={closeCreate}
                className="h-11 rounded-xl border border-[#E5DDEC] bg-white px-5 text-sm font-extrabold text-[#6C6075] transition hover:bg-[#F8F5FB]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveOutfit}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7553C9] px-6 text-sm font-extrabold text-white shadow-lg shadow-[#7553C9]/20 transition hover:bg-[#6747B5]"
              >
                <Check size={17} />
                Save outfit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VALIDATION POPUP */}
      {validationPopup.open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#241B30]/50 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E7E0EF] bg-white shadow-2xl"
          >
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FFF1F5] text-[#C45E80]">
                    <AlertCircle size={22} />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-[#302640]">
                      {validationPopup.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#948CA3]">
                      One small thing is missing.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeValidationPopup}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F7F3FA] text-[#766B82] transition hover:bg-[#EEE8F5]"
                  aria-label="Close popup"
                >
                  <X size={17} />
                </button>
              </div>

              <p className="mt-5 text-sm leading-6 text-[#5E526A]">
                {validationPopup.message}
              </p>

              <button
                type="button"
                autoFocus
                onClick={closeValidationPopup}
                className="mt-6 w-full rounded-xl bg-[#7553C9] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#7553C9]/20 transition hover:bg-[#6747B5]"
              >
                Okay, got it
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}