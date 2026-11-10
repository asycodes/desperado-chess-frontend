type SegmentedTimerProps = {
  secondsLeft: number;
  totalSeconds: number;
  segments?: number;
  dimmed?: boolean;
};

export function SegmentedTimer({ secondsLeft, totalSeconds, segments = 12, dimmed = false }: SegmentedTimerProps) {
  const filled = Math.ceil((Math.max(0, secondsLeft) / totalSeconds) * segments);

  return (
    <div
      role="progressbar"
      aria-label="Move time left"
      aria-valuemin={0}
      aria-valuemax={totalSeconds}
      aria-valuenow={secondsLeft}
      className={`flex flex-1 gap-[3px] ${dimmed ? "opacity-40" : ""}`}
    >
      {Array.from({ length: segments }, (_, i) => (
        <span key={i} className={`h-3 flex-1 ${i < filled ? "bg-main" : "border-2 border-secondary"}`} />
      ))}
    </div>
  );
}