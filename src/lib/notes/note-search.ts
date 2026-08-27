import { db } from "@/lib/db";
import { normalizeSearchTerm } from "./search-query";

type SearchArgs = {
  userId: string;
  term: string;
  view: "active" | "archived" | "trash";
  limit: number;
};

/**
 * Full-text search bỏ dấu trên searchableText (body + nội dung file đính kèm).
 *
 * public.immutable_unaccent là hàm do migration init tạo — bọc unaccent() lại
 * cho IMMUTABLE để dùng được trong index GIN "note_search_idx".
 * Phải schema-qualify, nếu không search_path của connection sẽ không resolve nổi.
 */
export async function searchNoteIds({
  userId,
  term,
  view,
  limit,
}: SearchArgs): Promise<string[]> {
  const normalized = normalizeSearchTerm(term);
  if (!normalized) return [];

  const archived = view === "archived";

  const rows =
    view === "trash"
      ? await db.$queryRaw<{ id: string }[]>`
          SELECT "id" FROM "Note"
          WHERE "userId" = ${userId}
            AND "deletedAt" IS NOT NULL
            AND to_tsvector('simple', public.immutable_unaccent("searchableText"))
                @@ websearch_to_tsquery('simple', public.immutable_unaccent(${normalized}))
          ORDER BY "isPinned" DESC, "updatedAt" DESC
          LIMIT ${limit}
        `
      : await db.$queryRaw<{ id: string }[]>`
          SELECT "id" FROM "Note"
          WHERE "userId" = ${userId}
            AND "deletedAt" IS NULL
            AND "isArchived" = ${archived}
            AND to_tsvector('simple', public.immutable_unaccent("searchableText"))
                @@ websearch_to_tsquery('simple', public.immutable_unaccent(${normalized}))
          ORDER BY "isPinned" DESC, "updatedAt" DESC
          LIMIT ${limit}
        `;

  return rows.map((r) => r.id);
}
