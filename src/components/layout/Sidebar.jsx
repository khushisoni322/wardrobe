
import {
  LayoutDashboard,
  Shirt,
  Grid2X2,
  Heart,
  Sparkles,
  Settings,
  X,
  ChevronRight,
} from "lucide-react";

const navigationGroups = [
  {
    title: "WORKSPACE",
    items: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "My Wardrobe", icon: Shirt },
      { label: "Categories", icon: Grid2X2 },
      { label: "Favorites", icon: Heart },
    ],
  },
  {
    title: "PERSONAL",
    items: [
      { label: "Outfits", icon: Sparkles },
      { label: "Settings", icon: Settings },
    ],
  },
];

export default function Sidebar({
  activePage,
  onNavigate,
  isOpen,
  onClose,
}) {
  function navigate(label) {
    onNavigate(label);
    onClose();
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-[70] bg-[#21182F]/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[80] flex h-dvh w-[270px] flex-col overflow-y-auto border-r border-[#EEEBF3] bg-white px-[18px] py-6 transition-transform duration-200 lg:w-[260px] lg:translate-x-0 ${
          isOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-1">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#7553C9] text-white shadow-lg shadow-violet-200">
            <Shirt size={24} />
          </div>

          <div>
            <h1 className="text-[23px] font-extrabold leading-tight tracking-[-1.2px] text-[#302743]">
              wardrobe<span className="text-[#8C69DF">.</span>
            </h1>

            <p className="mt-1 text-[9px] font-bold tracking-[1.4px] text-[#A09AAC]">
              YOUR PERSONAL SPACE
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="ml-auto grid h-9 w-9 place-items-center rounded-xl text-[#716781] hover:bg-[#F7F4FC] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Personal Wardrobe */}
        <button
          type="button"
          onClick={() => navigate("Dashboard")}
          className="mt-8 flex w-full items-center gap-3 rounded-[14px] border border-[#F0ECF7] bg-[#F8F6FC] p-3 text-left"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E9DFFF] font-bold text-[#6745B6]">
            K
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-extrabold tracking-widest text-[#968DA9]">
              YOUR SPACE
            </p>

            <p className="mt-1 text-[13px] font-bold text-[#393047]">
              My Wardrobe
            </p>
          </div>

          <ChevronRight size={17} className="text-[#9187A5]" />
        </button>

        {/* Navigation */}
        <nav className="mt-8 flex flex-col gap-7">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-3 ml-3 text-[10px] font-extrabold tracking-[1.2px] text-[#AAA4B6]">
                {group.title}
              </p>

              <div className="flex flex-col gap-1">
                {group.items.map(({ label, icon: Icon }) => {
                  const active = activePage === label;

                  return (
                    <button
                      type="button"
                      key={label}
                      onClick={() => navigate(label)}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-[45px] items-center gap-3 rounded-xl border px-3 text-left text-[13px] transition ${
                        active
                          ? "border-transparent bg-[#F0EAFF] font-bold text-[#704BBD]"
                          : "border-transparent text-[#81798F] hover:bg-[#F8F6FC] hover:text-[#5E419C]"
                      }`}
                    >
                      <Icon size={19} strokeWidth={1.8} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Empty flexible space */}
        <div className="flex-1" />

        {/* Personal wardrobe footer */}
        <div className="mt-8 flex items-center gap-3 border-t border-[#F0EDF4] pt-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#F7F0DD] text-[#B18B3C]">
            <Shirt size={18} />
          </div>

          <div>
            <p className="text-[11px] font-bold text-[#514761]">
              Your wardrobe
            </p>

            <p className="mt-1 text-[10px] text-[#9C95A8]">
              Made for everyday life
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
