import {
  Shirt,
  Heart,
  Layers3,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    label: "Total pieces",
    value: "44",
    description: "Across your wardrobe",
    icon: Shirt,
    theme: "bg-[#EEE6FF] text-[#815CC7]",
  },
  {
    label: "Categories",
    value: "06",
    description: "Your style collection",
    icon: Layers3,
    theme: "bg-[#FFF0E3] text-[#D69561]",
  },
  {
    label: "Favorites",
    value: "12",
    description: "Pieces you love most",
    icon: Heart,
    theme: "bg-[#FBE6EF] text-[#C9759C]",
  },
  {
    label: "Style moments",
    value: "08",
    description: "Looks ready to wear",
    icon: Sparkles,
    theme: "bg-[#E3F5EB] text-[#62A784]",
  },
];

export default function StatsCards() {
  return (
    <section
      aria-label="Wardrobe statistics"
      className="mb-9 grid grid-cols-2 gap-3 xl:grid-cols-4"
    >
      {stats.map(({ label, value, description, icon: Icon, theme }) => (
        <article
          key={label}
          className="min-w-0 rounded-2xl border border-[#EEEBF3] bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-950/5 sm:p-5"
        >
          <div className="flex items-center justify-between">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${theme}`}>
              <Icon size={20} strokeWidth={1.9} />
            </div>
            <ArrowUpRight size={17} className="text-[#B5ADC1]" />
          </div>

          <p className="mt-4 text-[11px] font-semibold text-[#92899F]">
            {label}
          </p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-[#392E4B]">
            {value}
          </p>
          <p className="mt-1 text-[9px] text-[#AAA2B4] sm:text-[10px]">
            {description}
          </p>
        </article>
      ))}
    </section>
  );
}