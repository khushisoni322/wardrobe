import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings2,
  UserRound,
  X,
} from "lucide-react";

const pageLabels = {
  Dashboard: "Dashboard",
  "My Wardrobe": "My Wardrobe",
  Categories: "Categories",
  Favorites: "Favorites",
  Outfits: "Outfits",
  Settings: "Settings",
  Family: "Family",
  Account: "My Account",
};

export default function Topbar({
  activePage,
  onMenuClick,
  user,
  onNavigate,
  onLogout,
}) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const accountRef = useRef(null);
  const searchInputRef = useRef(null);

  const name = user?.name || "Wardrobe user";
  const email = user?.email || "No email available";
  const initial =
    (name || email || "U").trim().charAt(0).toUpperCase() || "U";

  useEffect(() => {
    function handlePointerDown(event) {
      if (!accountRef.current?.contains(event.target)) {
        setAccountOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }

      // ⌘ K / Ctrl K → focus wardrobe search
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function goTo(page) {
    setAccountOpen(false);
    onNavigate?.(page);
  }

  function handleLogout() {
    setAccountOpen(false);
    onLogout?.();
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) {
      goTo("My Wardrobe");
      return;
    }

    // Search term ko My Wardrobe ke liye save karo.
    sessionStorage.setItem("wardrobe-search", query);

    // Category filter clear karo, taaki search kisi bhi category me kaam kare.
    sessionStorage.removeItem("wardrobe-category");

    goTo("My Wardrobe");
  }

  function clearSearch() {
    setSearchValue("");
    sessionStorage.removeItem("wardrobe-search");
    searchInputRef.current?.focus();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#ECE8F2] bg-[#F8F7FB]/95 backdrop-blur lg:static">
      <div className="flex min-h-[74px] items-center gap-3 px-4 sm:px-6 lg:px-9">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E8E3EE] bg-white text-[#675C72] transition hover:bg-[#FAF8FD] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>

        {/* Breadcrumb */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-[#A29AAA] sm:text-xs">
            <span>Workspace</span>
            <span>/</span>

            <span className="truncate font-bold text-[#453953]">
              {pageLabels[activePage] || activePage}
            </span>
          </div>
        </div>

        {/* Global wardrobe search */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden w-[310px] shrink-0 lg:block"
        >
          <div className="relative">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A91A5]"
            />

            <input
              ref={searchInputRef}
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search your wardrobe..."
              aria-label="Search your wardrobe"
              className="h-11 w-full rounded-xl border border-[#E7E1EF] bg-white pl-10 pr-20 text-xs text-[#302640] outline-none transition placeholder:text-[#A29AAA] focus:border-[#C9B7E6] focus:ring-4 focus:ring-[#F0E8FF]"
            />

            {searchValue ? (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-12 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-[#9A91A5] transition hover:bg-[#F5F1FA] hover:text-[#7553C9]"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            ) : null}

            <button
              type="submit"
              className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-lg border border-[#E7E1EF] bg-[#FAF8FD] px-2 py-1 text-[9px] font-bold text-[#A29AAA] transition hover:border-[#D8C9ED] hover:text-[#7553C9] xl:block"
              aria-label="Search"
            >
              ⌘ K
            </button>
          </div>
        </form>

        {/* Notifications */}
        <button
          type="button"
          className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#E7E1EF] bg-white text-[#675C72] transition hover:bg-[#FAF8FD]"
          aria-label="Notifications"
        >
          <Bell size={18} />

          <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-[#D46E9A]" />
        </button>

        {/* Account */}
        <div className="relative shrink-0" ref={accountRef}>
          <button
            type="button"
            onClick={() => setAccountOpen((open) => !open)}
            aria-expanded={accountOpen}
            aria-haspopup="menu"
            className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition sm:gap-3 ${
              accountOpen
                ? "border-[#CDBDE6] bg-[#FAF7FF]"
                : "border-transparent bg-transparent hover:border-[#E7E1EF] hover:bg-white"
            }`}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EEE3FF] text-sm font-extrabold text-[#7553C9]">
              {initial}
            </span>

            <span className="hidden min-w-0 sm:block">
              <span className="block max-w-28 truncate text-xs font-extrabold text-[#302640]">
                {name}
              </span>

              <span className="block text-[10px] text-[#9A91A5]">
                Personal space
              </span>
            </span>

            <ChevronDown
              size={16}
              className={`hidden text-[#9A91A5] transition sm:block ${
                accountOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {accountOpen && (
            <div
              role="menu"
              aria-label="Account menu"
              className="absolute right-0 top-[calc(100%+10px)] w-[290px] overflow-hidden rounded-2xl border border-[#E7E1EF] bg-white shadow-xl shadow-[#4A3A5F]/10"
            >
              {/* Account information */}
              <div className="border-b border-[#EEE9F3] bg-[#FBF9FE] p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#EEE3FF] font-extrabold text-[#7553C9]">
                    {initial}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-[#302640]">
                      {name}
                    </p>

                    <p className="truncate text-[11px] text-[#948CA3]">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account actions */}
              <div className="p-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => goTo("Account")}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold text-[#4F445B] transition hover:bg-[#F8F5FC]"
                >
                  <UserRound size={17} className="text-[#7553C9]" />

                  <span>
                    <span className="block">My account</span>

                    <span className="mt-0.5 block text-[10px] font-normal text-[#9A91A5]">
                      View your profile
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => goTo("Settings")}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold text-[#4F445B] transition hover:bg-[#F8F5FC]"
                >
                  <Settings2 size={17} className="text-[#7553C9]" />

                  <span>
                    <span className="block">Settings</span>

                    <span className="mt-0.5 block text-[10px] font-normal text-[#9A91A5]">
                      Manage preferences
                    </span>
                  </span>
                </button>

                <div className="my-1 border-t border-[#EEE9F3]" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold text-[#B46A88] transition hover:bg-[#FFF5F8]"
                >
                  <LogOut size={17} />

                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}