export function difficultyColor(d: string): string {
  const map: Record<string, string> = {
    Easy: 'bg-green-100 text-green-700',
    Moderate: 'bg-amber-100 text-amber-700',
    Challenging: 'bg-red-100 text-red-700',
  };
  return map[d] ?? 'bg-slate-100 text-slate-700';
}
