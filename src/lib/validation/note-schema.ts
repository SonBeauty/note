import { z } from "zod";
import { NOTE_COLORS } from "@/types/note";

export const checklistItemSchema = z.object({
  id: z.string().min(1).max(64),
  text: z.string().max(2000),
  checked: z.boolean(),
  order: z.number().int().min(0),
});

export const createNoteSchema = z.object({
  title: z.string().max(500).optional(),
  body: z.string().max(1_000_000).optional(),
});

export const updateNoteSchema = z
  .object({
    title: z.string().max(500),
    body: z.string().max(1_000_000),
    checklist: z.array(checklistItemSchema).max(500).nullable(),
    color: z.enum(NOTE_COLORS),
    isPinned: z.boolean(),
    isArchived: z.boolean(),
    /// Bản updatedAt client đang giữ — dùng để phát hiện ghi đè (optimistic concurrency).
    expectedUpdatedAt: z.string().datetime(),
  })
  .partial();

export const listNotesQuerySchema = z.object({
  q: z.string().max(200).optional(),
  view: z.enum(["active", "archived", "trash"]).default("active"),
  label: z.string().max(100).optional(),
  cursor: z.string().max(64).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const createLabelSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type ListNotesQuery = z.infer<typeof listNotesQuerySchema>;
