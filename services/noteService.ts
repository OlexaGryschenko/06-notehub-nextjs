import axios from "axios";
import type { Note } from "@/types/note";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

// ++++++++++++++  GET +++++++++++++++++++

const NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!NOTEHUB_TOKEN) {
  throw new Error("NoteHub token is missing");
}

// Setting up a basic instance
const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const fetchNotes = async (
  page: number = 1,
  search: string = "",
  perPage: number = 12,
): Promise<NotesResponse> => {
  const response = await api.get<NotesResponse>(`/notes`, {
    params: {
      page,
      perPage,
      search: search || undefined,
    },
  });
  return response.data;
};

//  ============== NEW NOTE ==================

export type NewNote = Omit<Note, "id" | "createdAt" | "updatedAt">;

export const createNote = async (noteData: NewNote): Promise<Note> => {
  const response = await api.post<Note>(`/notes`, noteData);
  return response.data;
};

// <<<<<<<<<<<<<<<<<<<<<  DELETE >>>>>>>>>>>>>>>>>>>>>>>>>

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);

  return response.data;
};
