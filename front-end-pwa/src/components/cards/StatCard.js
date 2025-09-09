export function StatCard({ iconSrc, value, suffix = "", subtitle }) {
  return (
    <div className="rounded-2xl bg-blue-300/40 text-centaurus-oxford-blue px-3 py-3 shadow-sm border border-centaurus-oxford-blue/20 flex items-center gap-3">
      {iconSrc ? (
        <img src={iconSrc} alt="" className="w-7 h-7 shrink-0" />
      ) : null}
      <div>
        <div className="text-2xl font-semibold">
          {value}
          {suffix && ` ${suffix}`}
        </div>
        <div className="text-xs opacity-80">{subtitle}</div>
      </div>
    </div>
  );
}