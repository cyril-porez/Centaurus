export function ProfileHeaderCard({ initials, name, lastUpdated }) {
  return (
    <div className="rounded-2xl bg-centaurus-oxford-blue text-white px-4 py-3 shadow-md shadow-black/10 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-semibold">
        {initials}
      </div>
      <div className="leading-tight">
        <div className="font-semibold">{name}</div>
        <div className="text-xs opacity-80">
          Dernière mise à jour le {lastUpdated}
        </div>
      </div>
    </div>
  );
}