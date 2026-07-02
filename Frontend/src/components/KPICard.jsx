import { useTheme } from "./Layout";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const TONES = {
  blue:   { bar: "bg-blue-500",    light: "text-blue-600",    dark: "text-blue-300",    dot: "bg-blue-500"    },
  green:  { bar: "bg-emerald-500", light: "text-emerald-700", dark: "text-emerald-300", dot: "bg-emerald-500" },
  red:    { bar: "bg-rose-500",    light: "text-rose-700",    dark: "text-rose-300",    dot: "bg-rose-500"    },
  amber:  { bar: "bg-amber-500",   light: "text-amber-700",   dark: "text-amber-300",   dot: "bg-amber-500"   },
  indigo: { bar: "bg-indigo-500",  light: "text-indigo-700",  dark: "text-indigo-300",  dot: "bg-indigo-500"  },
  slate:  { bar: "bg-slate-400",   light: "text-slate-700",   dark: "text-slate-300",   dot: "bg-slate-400"   },
};

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "blue",
  size = "md",
}) {
  const { isLight } = useTheme();
  const t = TONES[tone] || TONES.blue;
  const valueColor = isLight ? t.light : t.dark;
  const iconColor  = isLight ? t.light : t.dark;
  const surface    = isLight ? "border-black/10 bg-white ring-black/5" : "border-white/10 bg-[#0b1220]/55 ring-white/5";
  const textSoft   = isLight ? "text-slate-600" : "text-slate-400";
  const valueSize  = size === "sm" ? "text-[18px]" : "text-[22px]";

  return (
    <div className={cn("relative overflow-hidden rounded-[14px] border p-4 shadow-sm ring-1 transition hover:shadow-md", surface)}>
      <div className={cn("absolute inset-x-0 top-0 h-[3px]", t.bar)} />
      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="min-w-0">
          <div className={cn("text-[11px] uppercase tracking-[0.12em]", textSoft)}>{title}</div>
          <div className={cn("mt-2 font-serif font-light leading-none truncate", valueSize, valueColor)}>
            {value}
          </div>
          {subtitle && (
            <div className={cn("mt-3 flex items-center gap-2 text-[12px]", textSoft)}>
              <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", t.dot)} />
              <span className="truncate">{subtitle}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0", isLight ? "bg-slate-50" : "bg-white/5")}>
            <Icon className={cn("h-[18px] w-[18px]", iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
}
