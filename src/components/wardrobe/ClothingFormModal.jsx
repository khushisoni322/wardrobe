import { useEffect, useRef, useState } from "react";

import {
  Camera,
  ImagePlus,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import { compressImage } from "../../lib/imageUtils";

const EMPTY_FORM = {
  name: "",
  category: "Tops",
  color: "",
  occasion: "",
  imageUrl: "",
};

const OCCASIONS = [
  "Everyday",
  "Work",
  "College",
  "Party",
  "Wedding",
  "Festive",
  "Travel",
  "Workout",
  "Sleep",
  "Other",
];

export default function ClothingFormModal({
  open,
  item,
  categories = [],
  initialCategory = "Tops",
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const isEditing = Boolean(item);

  useEffect(() => {
    if (!open) {
      return;
    }

    const availableCategories =
      categories.length > 0 ? categories : ["Tops"];

    if (item) {
      const itemCategory = item.category || "Tops";

      setForm({
        name: item.name || "",
        category: availableCategories.includes(itemCategory)
          ? itemCategory
          : itemCategory,
        color: item.color || "",
        occasion: item.occasion || "",
        imageUrl:
          item.imageUrl ||
          item.photos?.[0]?.imageUrl ||
          "",
      });
    } else {
      const selectedCategory =
        initialCategory &&
        initialCategory !== "All" &&
        availableCategories.includes(initialCategory)
          ? initialCategory
          : availableCategories.includes("Tops")
            ? "Tops"
            : availableCategories[0];

      setForm({
        ...EMPTY_FORM,
        category: selectedCategory,
      });
    }

    setError("");
    setSaving(false);
    setImageLoading(false);
  }, [open, item, initialCategory, categories]);

  if (!open) {
    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleImage(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      event.target.value = "";
      return;
    }

    setImageLoading(true);
    setError("");

    try {
      const imageUrl = await compressImage(file);

      if (!imageUrl) {
        throw new Error("Could not process this photo.");
      }

      setForm((current) => ({
        ...current,
        imageUrl,
      }));
    } catch (err) {
      setError(
        err.message || "Could not process this photo."
      );
    } finally {
      setImageLoading(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter a clothing name.");
      return;
    }

    if (!form.category.trim()) {
      setError("Please choose a category.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSubmit({
        name: form.name.trim(),
        category: form.category.trim(),
        color: form.color.trim() || undefined,
        occasion: form.occasion.trim() || undefined,
        imageUrl: form.imageUrl || undefined,
      });

      onClose();
    } catch (err) {
      setError(
        err.message || "Could not save this clothing item."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#21182B]/45 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#EEEAF2] bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8E7AA7]">
              {isEditing
                ? "Update wardrobe"
                : "Add to wardrobe"}
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-[#302640]">
              {isEditing
                ? "Edit your clothing"
                : `Add ${form.category || "clothing"}`}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#F5F2F8] text-[#71677C] transition hover:bg-[#ECE6F2] disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-5 sm:p-7"
        >
          <div>
            <p className="mb-3 text-sm font-bold text-[#40364C]">
              Photo
            </p>

            <div className="overflow-hidden rounded-3xl border border-[#EAE5F0] bg-[#F8F6FA]">
              <div className="relative aspect-[4/3]">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt="Clothing preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-5 text-center text-[#9C91A8]">
                    <ImagePlus
                      size={40}
                      strokeWidth={1.5}
                    />

                    <p className="mt-3 text-sm font-semibold">
                      Add a photo of this clothing
                    </p>

                    <p className="mt-1 text-xs">
                      Take a picture or choose from your gallery
                    </p>
                  </div>
                )}

                {imageLoading && (
                  <div className="absolute inset-0 grid place-items-center bg-white/75 backdrop-blur-sm">
                    <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#594B69] shadow-lg">
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Processing photo...
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-[#EAE5F0] p-3">
                <button
                  type="button"
                  onClick={() =>
                    cameraInputRef.current?.click()
                  }
                  disabled={imageLoading || saving}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#7553C9] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#6645B4] disabled:opacity-50"
                >
                  <Camera size={17} />
                  Take photo
                </button>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={imageLoading || saving}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[#DDD5E8] bg-white px-4 py-3 text-sm font-bold text-[#594D67] transition hover:bg-[#FAF8FC] disabled:opacity-50"
                >
                  <Upload size={17} />
                  Gallery
                </button>
              </div>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImage}
              className="hidden"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />

            <p className="mt-2 text-xs leading-5 text-[#9A91A4]">
              Your photo is automatically resized and compressed
              before saving.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold text-[#40364C]">
                Clothing name
              </span>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Lavender kurti"
                disabled={saving}
                className="h-12 w-full rounded-2xl border border-[#E5DFEB] bg-white px-4 text-sm text-[#302640] outline-none transition placeholder:text-[#AAA1B2] focus:border-[#B9A5D5] focus:ring-4 focus:ring-[#7553C9]/10 disabled:bg-[#FAF8FC]"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-[#40364C]">
                Category
              </span>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={saving}
                className="h-12 w-full rounded-2xl border border-[#E5DFEB] bg-white px-4 text-sm text-[#302640] outline-none focus:border-[#B9A5D5] focus:ring-4 focus:ring-[#7553C9]/10 disabled:bg-[#FAF8FC]"
              >
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))
                ) : (
                  <option value="Tops">Tops</option>
                )}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-[#40364C]">
                Color
              </span>

              <input
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="e.g. Lavender"
                disabled={saving}
                className="h-12 w-full rounded-2xl border border-[#E5DFEB] bg-white px-4 text-sm text-[#302640] outline-none transition placeholder:text-[#AAA1B2] focus:border-[#B9A5D5] focus:ring-4 focus:ring-[#7553C9]/10 disabled:bg-[#FAF8FC]"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold text-[#40364C]">
                Occasion
              </span>

              <select
                name="occasion"
                value={form.occasion}
                onChange={handleChange}
                disabled={saving}
                className="h-12 w-full rounded-2xl border border-[#E5DFEB] bg-white px-4 text-sm text-[#302640] outline-none focus:border-[#B9A5D5] focus:ring-4 focus:ring-[#7553C9]/10 disabled:bg-[#FAF8FC]"
              >
                <option value="">
                  Select occasion
                </option>

                {OCCASIONS.map((occasion) => (
                  <option
                    key={occasion}
                    value={occasion}
                  >
                    {occasion}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <div className="rounded-2xl border border-[#F0D8E2] bg-[#FFF6F8] px-4 py-3 text-sm font-medium text-[#A85572]">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-2xl border border-[#E3DDE9] px-5 py-3 text-sm font-bold text-[#6C6276] transition hover:bg-[#FAF8FC] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || imageLoading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#5B437A] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#5B437A]/15 transition hover:bg-[#4E386A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {saving
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : `Add ${form.category || "to wardrobe"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}