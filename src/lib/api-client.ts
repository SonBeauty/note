import type { ChecklistItem, NoteColor } from "@/types/note";

export type Attachment = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  kind: string;
  status: string;
  errorMessage: string | null;
  createdAt: string;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  checklist: ChecklistItem[] | null;
  color: NoteColor;
  isPinned: boolean;
  isArchived: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  labels: { id: string; name: string }[];
  attachments: Attachment[];
};

export type NoteView = "active" | "archived" | "trash";

class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? `Lỗi ${res.status}`);
  }

  return res.json() as Promise<T>;
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const notesApi = {
  list: (params: { view: NoteView; q?: string; label?: string }) => {
    const search = new URLSearchParams({ view: params.view });
    if (params.q) search.set("q", params.q);
    if (params.label) search.set("label", params.label);
    return request<{ notes: Note[]; nextCursor: string | null }>(
      `/api/notes?${search}`,
    );
  },

  create: (input: { title?: string; body?: string }) =>
    request<Note>("/api/notes", json("POST", input)),

  update: (id: string, input: Partial<Note> & { expectedUpdatedAt?: string }) =>
    request<Note>(`/api/notes/${id}`, json("PATCH", input)),

  remove: (id: string, permanent = false) =>
    request<{ deleted: string }>(
      `/api/notes/${id}${permanent ? "?permanent=true" : ""}`,
      { method: "DELETE" },
    ),

  restore: (id: string) =>
    request<Note>(`/api/notes/${id}/restore`, { method: "POST" }),

  upload: async (noteId: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<Attachment>(`/api/notes/${noteId}/attachments`, {
      method: "POST",
      body: form,
    });
  },
};

export const attachmentsApi = {
  content: (id: string) =>
    request<{
      id: string;
      fileName: string;
      kind: string;
      status: string;
      errorMessage: string | null;
      html: string;
    }>(`/api/attachments/${id}/content`),

  remove: (id: string) =>
    request<{ deleted: boolean }>(`/api/attachments/${id}`, { method: "DELETE" }),

  downloadUrl: (id: string) => `/api/attachments/${id}/download`,
};

export const renderMarkdown = (text: string) =>
  request<{ html: string }>("/api/render-markdown", json("POST", { text }));
