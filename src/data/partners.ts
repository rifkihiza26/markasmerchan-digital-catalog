/**
 * OUR PARTNER. No partner names/logos were extractable from the supplied
 * source — keep these as empty slots until the real logos are provided.
 */
export type Partner = { id: string; name: string | null; logo: string | null };

export const partners: Partner[] = Array.from({ length: 8 }, (_, i) => ({
  id: `partner-${i + 1}`,
  name: null,
  logo: null,
}));
