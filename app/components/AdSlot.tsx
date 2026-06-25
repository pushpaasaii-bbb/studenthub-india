type AdSlotProps = {
  type?: "banner" | "rectangle" | "leaderboard";
  className?: string;
};

export default function AdSlot({
  type = "banner",
  className = "",
}: AdSlotProps) {
  const sizes = {
    banner: "h-24",
    rectangle: "h-[250px]",
    leaderboard: "h-[90px]",
  };

  return (
    <div
      className={`
        ${sizes[type]}
        ${className}
        w-full
        rounded-lg
        border-2
        border-dashed
        border-slate-300
        dark:border-slate-700
        bg-slate-100
        dark:bg-slate-900
        flex
        items-center
        justify-center
        text-sm
        text-slate-500
        dark:text-slate-400
      `}
    >
      Google AdSense ({type})
    </div>
  );
}