export function fmt(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}
