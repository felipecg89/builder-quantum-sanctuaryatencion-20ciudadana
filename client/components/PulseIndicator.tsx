interface PulseIndicatorProps {
  show: boolean;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export default function PulseIndicator({
  show,
  color = "blue",
  size = "md",
}: PulseIndicatorProps) {
  if (!show) return null;

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colorClasses = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="absolute -top-1 -right-1 flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-ping`}
      />
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full absolute`}
      />
    </div>
  );
}
