import { ArrowUpRight, Sparkles, Shirt } from "lucide-react";

export default function WelcomeBanner({ onAddClothing }) {
  return (
    <section className="relative mb-8 grid overflow-hidden rounded-3xl border border-[#E7DCF8] bg-gradient-to-br from-[#F0E8FF] via-[#F9EFF7] to-[#FCECE9] md:min-h-[310px] md:grid-cols-[1.15fr_0.85fr]">
      <div className="relative z-10 self-center p-6 sm:p-8 lg:p-9">
        <div className="flex items-center gap-2 text-[9px] font-extrabold tracking-[1.3px] text-[#8061BB]">
          <Sparkles size={14} />
          YOUR PERSONAL STYLE SPACE
        </div>

        <h1 className="mt-4 text-[32px] font-extrabold leading-[1.12] tracking-[-1.7px] text-[#38294C] sm:text-4xl lg:text-[42px]">
          Your style,
          <br />
          <span className="text-[#8663C7]">
            beautifully organized.
          </span>
        </h1>

        <p className="mt-4 max-w-[370px] text-xs leading-7 text-[#82748F]">
          Every piece has a place. Every outfit tells your story.
          Let's make getting dressed your favorite part of the day.
        </p>

        <button
          type="button"
          onClick={onAddClothing}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7553C9] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-[#6342B3]"
        >
          <Shirt size={17} />
          Add your first piece
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="relative grid min-h-[220px] place-items-center md:min-h-[310px]">
        <div className="absolute h-60 w-60 rounded-full border border-violet-300/30" />
        <div className="absolute h-48 w-48 rounded-full border border-violet-300/30" />

        <div className="relative z-10 w-36 rotate-3 rounded-2xl border border-white/80 bg-white p-2 shadow-2xl shadow-purple-900/10 sm:w-40 lg:w-48">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85"
            alt="Fashion inspiration"
            className="h-28 w-full rounded-xl object-cover sm:h-32 lg:h-40"
          />

          <div className="flex items-center justify-between gap-2 px-1 pb-1 pt-3 text-[#9471CE]">
            <div>
              <p className="text-[7px] font-extrabold tracking-wider text-[#9C91AE]">
                YOUR STYLE JOURNAL
              </p>
              <p className="mt-1 text-[10px] font-bold text-[#4D3B61]">
                Little things, lovely looks.
              </p>
            </div>
            <Sparkles size={18} />
          </div>
        </div>

        <div className="absolute bottom-4 right-3 z-20 flex items-center gap-2 rounded-xl border border-[#F0E9F5] bg-white p-3 shadow-lg sm:right-6">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#F8E9F2] text-[#C77CA4]">
            ✦
          </span>
          <div>
            <p className="text-[10px] font-bold text-[#50405E]">Made for you</p>
            <p className="mt-1 text-[9px] text-[#A096AD]">Your own little world</p>
          </div>
        </div>
      </div>
    </section>
  );
}