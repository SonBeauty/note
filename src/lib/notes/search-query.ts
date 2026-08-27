/**
 * Làm sạch chuỗi người dùng gõ trước khi đưa vào websearch_to_tsquery.
 *
 * websearch_to_tsquery vốn đã chịu được input rác (không ném lỗi như to_tsquery),
 * nhưng vẫn cắt bớt để tránh chuỗi quá dài và ký tự điều khiển.
 */
export function normalizeSearchTerm(raw: string): string | null {
  const cleaned = raw
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, 200);

  return cleaned.length > 0 ? cleaned : null;
}
