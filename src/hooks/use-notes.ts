"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notesApi, type Note, type NoteView } from "@/lib/api-client";

type ListParams = { view: NoteView; q?: string; label?: string };

const listKey = (p: ListParams) => ["notes", p.view, p.q ?? "", p.label ?? ""];

export function useNotes(params: ListParams) {
  return useQuery({
    queryKey: listKey(params),
    queryFn: () => notesApi.list(params),
  });
}

export function useCreateNote(params: ListParams) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: listKey(params) }),
  });
}

/**
 * Cập nhật note với optimistic update.
 *
 * Ghim/đổi màu phải phản hồi tức thì — chờ round-trip mới đổi là cảm giác chậm
 * ngay lập tức. Nếu server từ chối thì rollback về bản trước đó.
 */
export function useUpdateNote(params: ListParams) {
  const qc = useQueryClient();
  const key = listKey(params);

  return useMutation({
    mutationFn: ({ id, ...input }: Partial<Note> & { id: string }) =>
      notesApi.update(id, input),

    onMutate: async (variables) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<{ notes: Note[] }>(key);

      qc.setQueryData<{ notes: Note[]; nextCursor: string | null }>(key, (old) =>
        old
          ? {
              ...old,
              notes: old.notes.map((n) =>
                n.id === variables.id ? { ...n, ...variables } : n,
              ),
            }
          : old,
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) qc.setQueryData(key, context.previous);
    },

    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useDeleteNote(params: ListParams) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permanent }: { id: string; permanent?: boolean }) =>
      notesApi.remove(id, permanent),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useRestoreNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notesApi.restore,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
}
