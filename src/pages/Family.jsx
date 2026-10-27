import { useEffect, useState } from "react";
import {
  UsersRound,
  Plus,
  X,
  LoaderCircle,
  CheckCircle2,
  ArrowRight,
  Crown,
} from "lucide-react";

import { familyAPI } from "../lib/api";

export default function Family({ onNavigate }) {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadFamilies() {
    setLoading(true);
    setError("");

    try {
      const result = await familyAPI.list();

      if (!result?.success) {
        throw new Error(
          result?.message || "Could not load your family spaces."
        );
      }

      setFamilies(Array.isArray(result.families) ? result.families : []);
    } catch (err) {
      setError(
        err.message || "Could not load your family spaces."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFamilies();
  }, []);

  function openCreateModal() {
    setError("");
    setSuccess("");
    setFamilyName("");
    setShowCreateModal(true);
  }

  function closeCreateModal() {
    if (creating) return;

    setShowCreateModal(false);
    setFamilyName("");
    setError("");
  }

  async function handleCreateFamily(event) {
    event.preventDefault();

    const name = familyName.trim();

    if (!name) {
      setError("Please enter a family name.");
      return;
    }

    if (name.length > 100) {
      setError("Family name must be 100 characters or fewer.");
      return;
    }

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const result = await familyAPI.create(name);

      if (!result?.success || !result?.family) {
        throw new Error(
          result?.message || "Family could not be created."
        );
      }

      setFamilies((current) => {
        const createdFamily = {
          id: result.family.id,
          name: result.family.name,
          createdAt: result.family.createdAt,
          role: result.membership?.role || "ADMIN",
          membershipId: result.membership?.id,
        };

        return [createdFamily, ...current];
      });

      setSuccess(
        `"${result.family.name}" was created successfully!`
      );

      setFamilyName("");

      setTimeout(() => {
        setShowCreateModal(false);

        // My Wardrobe will mount fresh and load the new family
        // from the backend.
        onNavigate?.("My Wardrobe");
      }, 700);
    } catch (err) {
      setError(
        err.message || "Could not create the family."
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <section className="space-y-6">
        {/* Header */}
        <div className="rounded-[2rem] border border-[#EAE1FC] bg-gradient-to-br from-[#F8F4FF] to-white p-7 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#E9DFFF] text-[#7553C9]">
                <UsersRound size={28} />
              </div>

              <h1 className="mt-5 text-2xl font-extrabold text-[#302640] sm:text-3xl">
                Family Wardrobe
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#948CA3]">
                Create a shared family space and keep everyone's
                clothing collection beautifully organized.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#7553C9] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-[#6342B3]"
            >
              <Plus size={18} />
              Create family space
            </button>
          </div>
        </div>

        {/* Error */}
        {error && !showCreateModal && (
          <div className="rounded-2xl border border-[#F0D8E2] bg-[#FFF7F9] px-5 py-4 text-sm text-[#A85572]">
            <p className="font-bold">Something went wrong</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid min-h-[280px] place-items-center rounded-[2rem] border border-[#EEE9F4] bg-white">
            <div className="flex items-center gap-3 text-sm font-semibold text-[#7D7189]">
              <LoaderCircle
                size={20}
                className="animate-spin text-[#7553C9]"
              />
              Loading your family spaces...
            </div>
          </div>
        ) : families.length > 0 ? (
          /* Existing families */
          <div className="grid gap-4 sm:grid-cols-2">
            {families.map((family) => (
              <article
                key={family.id}
                className="rounded-[2rem] border border-[#EEE9F4] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F0E8FF] text-[#7553C9]">
                    <UsersRound size={23} />
                  </div>

                  {family.role === "ADMIN" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF7D9] px-3 py-1.5 text-[10px] font-bold text-[#9A7620]">
                      <Crown size={12} />
                      ADMIN
                    </span>
                  )}
                </div>

                <h2 className="mt-5 text-lg font-extrabold text-[#302640]">
                  {family.name}
                </h2>

                <p className="mt-1 text-xs text-[#948CA3]">
                  Your family wardrobe space
                </p>

                <button
                  type="button"
                  onClick={() => onNavigate?.("My Wardrobe")}
                  className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#7553C9] hover:text-[#563A9B]"
                >
                  Open wardrobe
                  <ArrowRight size={15} />
                </button>
              </article>
            ))}

            {/* Create another */}
            <button
              type="button"
              onClick={openCreateModal}
              className="min-h-[190px] rounded-[2rem] border border-dashed border-[#D8CBEA] bg-[#FCFAFF] p-6 text-left transition hover:border-[#BFA7DD] hover:bg-[#F8F3FF]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#7553C9] shadow-sm">
                <Plus size={23} />
              </div>

              <h2 className="mt-5 text-sm font-extrabold text-[#493B59]">
                Create another family
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#948CA3]">
                Make another shared wardrobe space.
              </p>
            </button>
          </div>
        ) : (
          /* No family */
          <div className="rounded-[2rem] border border-dashed border-[#D8CBEA] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#F0E8FF] text-[#7553C9]">
              <UsersRound size={30} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-[#302640]">
              Create your family space
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#948CA3]">
              Create a family space first. Then you can start
              adding clothes, organizing categories, and building
              your digital wardrobe.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#7553C9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-[#6342B3]"
            >
              <Plus size={18} />
              Create family space
            </button>
          </div>
        )}
      </section>

      {/* Create Family Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-[#261A36]/45 p-5 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !creating) {
              closeCreateModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-family-title"
            className="w-full max-w-[460px] rounded-[2rem] border border-[#EEE6F7] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F0E8FF] text-[#7553C9]">
                  <UsersRound size={24} />
                </div>

                <h2
                  id="create-family-title"
                  className="mt-5 text-xl font-extrabold text-[#302640]"
                >
                  Create family space
                </h2>

                <p className="mt-2 text-xs leading-6 text-[#948CA3]">
                  Give your shared wardrobe a name. You can start
                  adding clothes right after this.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={creating}
                className="grid h-9 w-9 place-items-center rounded-xl text-[#8F849A] transition hover:bg-[#F7F4FA] hover:text-[#302640] disabled:opacity-40"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreateFamily}
              className="mt-6 space-y-5"
            >
              <div>
                <label
                  htmlFor="family-name"
                  className="mb-2 block text-xs font-bold text-[#493B59]"
                >
                  Family name
                </label>

                <input
                  id="family-name"
                  type="text"
                  value={familyName}
                  onChange={(event) => {
                    setFamilyName(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="e.g. Soni Family"
                  maxLength={100}
                  autoFocus
                  disabled={creating}
                  className="h-12 w-full rounded-xl border border-[#E6E0ED] bg-white px-4 text-sm text-[#302640] outline-none transition placeholder:text-[#B0A7B7] focus:border-[#BDA6DF] focus:ring-4 focus:ring-[#7553C9]/10 disabled:bg-[#F7F5F9]"
                />

                <p className="mt-2 text-[10px] text-[#A097A9]">
                  {familyName.length}/100 characters
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#F0D8E2] bg-[#FFF7F9] px-4 py-3 text-xs leading-5 text-[#A85572]"
                >
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-xl border border-[#D8ECDD] bg-[#F3FBF5] px-4 py-3 text-xs font-semibold text-[#3E8053]">
                  <CheckCircle2 size={16} />
                  {success}
                </div>
              )}

              <div className="flex gap-3 border-t border-[#EEE9F2] pt-5">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={creating}
                  className="flex-1 rounded-xl border border-[#E5DFEA] bg-white px-4 py-3 text-xs font-bold text-[#675C72] transition hover:bg-[#FAF8FC] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating || !familyName.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#7553C9] px-4 py-3 text-xs font-bold text-white shadow-md shadow-violet-200 transition hover:bg-[#6342B3] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating ? (
                    <>
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Create family
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}