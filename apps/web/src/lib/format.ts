const whole = new Intl.NumberFormat("en-IE", { maximumFractionDigits: 0 });

/** 25,899,207,211 */
export const km = (n: number) => whole.format(n);

/** 23h 59m 50.46s */
export function hms(seconds: number, decimals = 2): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = (seconds % 60).toFixed(decimals).padStart(decimals ? decimals + 3 : 2, "0");
  return `${h}h ${String(m).padStart(2, "0")}m ${s}s`;
}

/** Wed 19 Nov, 06:16:07 GMT, in the visitor's own time zone */
export const when = (ms: number) =>
  new Date(ms).toLocaleString("en-IE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });