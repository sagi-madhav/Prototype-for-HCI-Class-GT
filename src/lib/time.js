// Utility functions for time manipulation and formatting

/**
 * Converts a "HH:MM" 24h string to minutes from midnight
 */
export function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Converts minutes from midnight to a 12-hour formatted string: "07:30 AM"
 */
export function minutesToTimeString12(mins) {
  const normMins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(normMins / 60);
  const m = normMins % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * Converts minutes from midnight to 24-hour "HH:MM" string for inputs
 */
export function minutesToTimeString24(mins) {
  const normMins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(normMins / 60);
  const m = normMins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Formats a duration in minutes into e.g. "58 mins" or "1 hr 10 mins"
 */
export function formatDuration(mins) {
  if (mins < 60) return `${mins} mins`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} hr ${m} mins` : `${h} hr`;
}
