import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Band } from "../graphql/generated/graphql";

/**
 * Merge Tailwind classes without conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  if (date === undefined || date === null) {
    return "";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>( // Should/could this be any instead of unknown?
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Group bands by bandNumber and technology, combining multiple
 * dlBandClass and ulBandClass values with slashes.
 *
 * @param bands Array of bands to group
 * @returns Array of grouped bands with combined band classes
 */
export function groupBandsByNumberAndTechnology(
  bands: Band[] | null | undefined
): Band[] {
  if (!bands || bands.length === 0) {
    return [];
  }

  const groups = new Map<
    string,
    {
      bandNumber: string;
      technology: string;
      dlBandClasses: Set<string>;
      ulBandClasses: Set<string>;
      id: string;
    }
  >();

  bands.forEach((band) => {
    if (!band.bandNumber || !band.technology) return;

    const key = `${band.bandNumber}-${band.technology}`;
    const existing = groups.get(key);

    if (existing) {
      if (band.dlBandClass) {
        existing.dlBandClasses.add(band.dlBandClass);
      }
      if (band.ulBandClass) {
        existing.ulBandClasses.add(band.ulBandClass);
      }
    } else {
      groups.set(key, {
        bandNumber: band.bandNumber,
        technology: band.technology,
        dlBandClasses: new Set(band.dlBandClass ? [band.dlBandClass] : []),
        ulBandClasses: new Set(band.ulBandClass ? [band.ulBandClass] : []),
        id: band.id ?? key,
      });
    }
  });

  return Array.from(groups.values()).map((group) => ({
    id: group.id,
    bandNumber: group.bandNumber,
    technology: group.technology,
    dlBandClass: Array.from(group.dlBandClasses).sort().join("/") || "-",
    ulBandClass: Array.from(group.ulBandClasses).sort().join("/") || "-",
  }));
}
