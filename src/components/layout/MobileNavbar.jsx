import {
  LayoutDashboard,
  Shirt,
  Heart,
  Sparkles,
  Grid2X2,
} from "lucide-react";

const items = [
  { label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard },
  { label: "My Wardrobe", shortLabel: "Wardrobe", icon: Shirt },
  { label: "Categories", shortLabel: "Categories", icon: Grid2X2 },
  { label: "Favorites", shortLabel: "Favorites", icon: Heart },
  { label: "Outfits", shortLabel: "Outfits", icon: Sparkles },
];

export default function MobileNavbar({ activePage, onNavigate }) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-[60] flex min-h-[68px] items-center justify-around border-t border-[#EEEBF3] bg-white/95 px-1 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden"
    >
      {items.map(({ label, shortLabel, icon: Icon }) => {
        const active = activePage === label;

        return (
          <button
            type="button"
            key={label}
            onClick={() => onNavigate(label)}
            aria-current={active ? "page" : undefined}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2 transition ${
              active ? "text-[#7553C9]" : "text-[#9991A9]"
            }`}
          >
            <Icon size={21} strokeWidth={active ? 2.2 : 1.8} />
            <span
              className={`max-w-full truncate text-[9px] ${
                active ? "font-extrabold" : "font-medium"
              }`}
            >
              {shortLabel}
            </span>
          </button>
        );
      })}
    </nav>
  );
}