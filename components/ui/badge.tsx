import { cn } from "@/lib/cn";

export function Badge({ label, color = "blue", className }: { label: string; color?: "blue"|"green"|"gray"|"red"|"indigo"; className?: string }) {
  const map: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    green: "bg-green-50 text-green-700 ring-green-200",
    gray: "bg-gray-100 text-gray-700 ring-gray-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1", map[color], className)}>{label}</span>;
}
