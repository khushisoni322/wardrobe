import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Mail,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UserRound,
  LogOut,
  SlidersHorizontal,
  Sparkles,
  Shirt,
} from "lucide-react";

const STORAGE_KEY = "wardrobe-settings";

const DEFAULT_SETTINGS = {
  notifications: true,
  emailUpdates: false,
  confirmDelete: true,
  compactCards: false,
};

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(saved);

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function SettingToggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        checked ? "bg-[#7553C9]" : "bg-[#D9D3E1]"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  color = "purple",
}) {
  const iconClasses =
    color === "green"
      ? "bg-[#E8F8ED] text-[#3F9A5C]"
      : color === "rose"
        ? "bg-[#FFF0F5] text-[#C56C91]"
        : "bg-[#EEE4FF] text-[#7553C9]";

  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#EEE9F3] px-5 py-5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-4">
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${iconClasses}`}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-extrabold text-[#302640]">{title}</p>
          <p className="mt-1 text-xs leading-5 text-[#948CA3]">
            {description}
          </p>
        </div>
      </div>

      <SettingToggle
        checked={checked}
        onChange={onChange}
        label={title}
      />
    </div>
  );
}

export default function Settings({ user, onNavigate, onLogout }) {
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);

  const name = user?.name?.trim() || "Wardrobe user";
  const email = user?.email?.trim() || "No email available";
  const initial = name.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    setSaved(true);

    const timer = window.setTimeout(() => {
      setSaved(false);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [settings]);

  function updateSetting(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
  }

  function handleLogout() {
    onLogout?.();
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-[#E9E1F5] bg-gradient-to-br from-[#F8F4FF] via-white to-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#EEE3FF] text-[#7553C9]">
              <SlidersHorizontal size={27} />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9A84B8]">
                Personal space
              </p>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#302640] sm:text-3xl">
                Settings
              </h1>

              <p className="mt-1 text-sm text-[#948CA3]">
                Manage your wardrobe preferences and account.
              </p>
            </div>
          </div>

          {saved && (
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#EAF8EE] px-3 py-2 text-xs font-bold text-[#3F9157] sm:self-auto">
              <Check size={15} />
              Saved
            </div>
          )}
        </div>
      </div>

      {/* Profile */}
      <div className="overflow-hidden rounded-3xl border border-[#E7E0F0] bg-white shadow-sm">
        <div className="border-b border-[#EEE9F3] px-5 py-4 sm:px-6">
          <p className="text-sm font-extrabold text-[#302640]">
            Your account
          </p>
          <p className="mt-1 text-xs text-[#948CA3]">
            Your signed-in Wardrobe account details.
          </p>
        </div>

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#EEE3FF] text-xl font-extrabold text-[#7553C9]">
              {initial}
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-extrabold text-[#302640]">
                {name}
              </p>

              <div className="mt-1 flex items-center gap-2 text-xs text-[#948CA3]">
                <Mail size={14} />
                <span className="truncate">{email}</span>
              </div>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#F4EFFB] px-2.5 py-1 text-[10px] font-bold text-[#7553C9]">
                <ShieldCheck size={12} />
                Signed in
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.("Account")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5DDEC] bg-white px-4 py-3 text-xs font-extrabold text-[#5B4B68] transition hover:border-[#CDBDE6] hover:bg-[#FAF7FF]"
          >
            <UserRound size={16} />
            View my account
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="overflow-hidden rounded-3xl border border-[#E7E0F0] bg-white shadow-sm">
        <div className="border-b border-[#EEE9F3] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EEE4FF] text-[#7553C9]">
              <Bell size={18} />
            </div>

            <div>
              <p className="text-sm font-extrabold text-[#302640]">
                Notifications
              </p>
              <p className="mt-1 text-xs text-[#948CA3]">
                Control how Wardrobe keeps you updated.
              </p>
            </div>
          </div>
        </div>

        <SettingRow
          icon={Bell}
          title="Wardrobe notifications"
          description="Receive helpful reminders and activity updates."
          checked={settings.notifications}
          onChange={(value) => updateSetting("notifications", value)}
        />

        <SettingRow
          icon={Mail}
          title="Email updates"
          description="Allow Wardrobe to send occasional account and product updates."
          checked={settings.emailUpdates}
          onChange={(value) => updateSetting("emailUpdates", value)}
          color="green"
        />
      </div>

      {/* Wardrobe preferences */}
      <div className="overflow-hidden rounded-3xl border border-[#E7E0F0] bg-white shadow-sm">
        <div className="border-b border-[#EEE9F3] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EEE4FF] text-[#7553C9]">
              <Shirt size={18} />
            </div>

            <div>
              <p className="text-sm font-extrabold text-[#302640]">
                Wardrobe preferences
              </p>
              <p className="mt-1 text-xs text-[#948CA3]">
                Choose how your wardrobe behaves.
              </p>
            </div>
          </div>
        </div>

        <SettingRow
          icon={Trash2}
          title="Confirm before deleting"
          description="Ask for confirmation before permanently deleting a clothing item."
          checked={settings.confirmDelete}
          onChange={(value) => updateSetting("confirmDelete", value)}
          color="rose"
        />

        <SettingRow
          icon={Sparkles}
          title="Compact clothing cards"
          description="Use a tighter layout when browsing your wardrobe."
          checked={settings.compactCards}
          onChange={(value) => updateSetting("compactCards", value)}
        />
      </div>

      {/* Navigation shortcuts */}
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onNavigate?.("My Wardrobe")}
          className="group rounded-3xl border border-[#E7E0F0] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#CDBDE6] hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEE4FF] text-[#7553C9]">
              <Shirt size={19} />
            </div>

            <ChevronRight
              size={18}
              className="text-[#B0A5B8] transition group-hover:translate-x-1 group-hover:text-[#7553C9]"
            />
          </div>

          <p className="mt-4 text-sm font-extrabold text-[#302640]">
            My Wardrobe
          </p>

          <p className="mt-1 text-xs leading-5 text-[#948CA3]">
            Browse, edit and manage all your clothing pieces.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate?.("Account")}
          className="group rounded-3xl border border-[#E7E0F0] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#CDBDE6] hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEE4FF] text-[#7553C9]">
              <UserRound size={19} />
            </div>

            <ChevronRight
              size={18}
              className="text-[#B0A5B8] transition group-hover:translate-x-1 group-hover:text-[#7553C9]"
            />
          </div>

          <p className="mt-4 text-sm font-extrabold text-[#302640]">
            My Account
          </p>

          <p className="mt-1 text-xs leading-5 text-[#948CA3]">
            View your profile and signed-in account information.
          </p>
        </button>
      </div>

      {/* Reset + logout */}
      <div className="overflow-hidden rounded-3xl border border-[#E7E0F0] bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-extrabold text-[#302640]">
              Reset preferences
            </p>

            <p className="mt-1 text-xs leading-5 text-[#948CA3]">
              Restore all Settings options to their default values.
            </p>
          </div>

          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5DDEC] bg-white px-4 py-3 text-xs font-extrabold text-[#5B4B68] transition hover:border-[#CDBDE6] hover:bg-[#FAF7FF]"
          >
            <RotateCcw size={15} />
            Reset preferences
          </button>
        </div>

        <div className="border-t border-[#F0EBF4] bg-[#FFF9FB] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold text-[#7C405B]">
                Sign out
              </p>

              <p className="mt-1 text-xs leading-5 text-[#A9788C]">
                Sign out of your Wardrobe account on this device.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F0CDD9] bg-white px-4 py-3 text-xs font-extrabold text-[#B15D7E] transition hover:bg-[#FFF0F5]"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}