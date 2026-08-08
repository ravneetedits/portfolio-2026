// Detects low-end devices/browsers at module load time (no re-render needed).
// Signals: prefers-reduced-motion, ≤2 CPU cores, ≤2 GB RAM.
// navigator.hardwareConcurrency and deviceMemory are Chrome/Edge only — fine,
// those are exactly the browsers that expose the data we need.
const isLite =
  typeof window !== 'undefined' &&
  (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    (navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 2) ||
    (navigator.deviceMemory != null && navigator.deviceMemory <= 2));

export default function usePrefersLite() {
  return isLite;
}
