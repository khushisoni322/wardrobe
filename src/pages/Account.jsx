import {
    ArrowLeft,
    CheckCircle2,
    LogOut,
    Mail,
    ShieldCheck,
    UserRound,
  } from "lucide-react";
  
  export default function Account({ user, onNavigate, onLogout }) {
    const name = user?.name || "Wardrobe user";
    const email = user?.email || "No email available";
    const initial = (name || email || "U").trim().charAt(0).toUpperCase();
  
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate?.("Dashboard")}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#E9E4F1] bg-white text-[#6F647B] transition hover:bg-[#F8F5FC]"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>
  
          <div>
            <p className="text-[9px] font-extrabold tracking-[1.3px] text-[#9A8CAF]">
              PERSONAL SPACE
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#302640]">
              My Account
            </h1>
          </div>
        </div>
  
        <div className="overflow-hidden rounded-3xl border border-[#EAE1FC] bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#F7F1FF] via-white to-[#FCFAFF] px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-[#E9D9FF] text-2xl font-extrabold text-[#7553C9] shadow-sm">
                {initial}
              </div>
  
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold tracking-[1.2px] text-[#9B88B4]">
                  YOUR PROFILE
                </p>
                <h2 className="mt-1 truncate text-2xl font-extrabold text-[#302640]">
                  {name}
                </h2>
                <p className="mt-1 truncate text-sm text-[#948CA3]">
                  {email}
                </p>
              </div>
            </div>
          </div>
  
          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            <div className="rounded-2xl border border-[#EEE8F5] bg-[#FCFAFF] p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#F0E7FF] text-[#7553C9]">
                <UserRound size={19} />
              </div>
              <h3 className="mt-4 text-sm font-extrabold text-[#392E4B]">
                Profile
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#948CA3]">
                Your wardrobe profile is connected to your signed-in account.
              </p>
            </div>
  
            <div className="rounded-2xl border border-[#EEE8F5] bg-[#FCFAFF] p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#F0E7FF] text-[#7553C9]">
                <Mail size={19} />
              </div>
              <h3 className="mt-4 text-sm font-extrabold text-[#392E4B]">
                Email
              </h3>
              <p className="mt-1 break-all text-xs leading-5 text-[#948CA3]">
                {email}
              </p>
            </div>
  
            <div className="rounded-2xl border border-[#E4F1E9] bg-[#FAFFFC] p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#E5F7EA] text-[#4C9A68]">
                <CheckCircle2 size={19} />
              </div>
              <h3 className="mt-4 text-sm font-extrabold text-[#392E4B]">
                Account active
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#758D7C]">
                You are currently signed in and can manage your wardrobe.
              </p>
            </div>
  
            <div className="rounded-2xl border border-[#E8E4F0] bg-[#FBFAFD] p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EEEAF7] text-[#675A79]">
                <ShieldCheck size={19} />
              </div>
              <h3 className="mt-4 text-sm font-extrabold text-[#392E4B]">
                Secure session
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#948CA3]">
                Your session is protected by the existing Wardrobe login system.
              </p>
            </div>
          </div>
  
          <div className="flex flex-col gap-3 border-t border-[#EEE8F5] bg-[#FCFBFE] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-sm font-bold text-[#392E4B]">Want to leave?</p>
              <p className="mt-1 text-xs text-[#948CA3]">
                You can safely sign out from this device.
              </p>
            </div>
  
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E7D5DF] bg-white px-4 py-3 text-xs font-bold text-[#A05272] transition hover:bg-[#FFF6F9]"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      </section>
    );
  }