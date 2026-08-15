// components/NoteList/NoteList.tsx

"use client";

import Pagination from "@/components/Pagination/Pagination";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from "./NoteList.module.css"

import Link from "next/link";

interface NoteListProps {
  notes: Note[];
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  forcePage: number;
}


export default function NoteList ({ notes, pageCount, onPageChange, forcePage }: NoteListProps) {
const queryClient = useQueryClient();

const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });


if (!notes || notes.length === 0) {
  return null;
}

return (
<>
  {pageCount > 1 && (
        <Pagination 
          pageCount={pageCount} 
          onPageChange={onPageChange} 
          forcePage={forcePage} 
        />
      )};
<ul className={css.list}>
  {notes.map((note) => (
    <li key={note.id} className={css.listItem}>
      <h2 className={css.title}>{note.title}</h2>
      <p className={css.content}>{note.content}</p>
      <div className={css.footer}>
        <span className={css.tag}>{note.tag}</span>

<Link href={`/notes/${note.id}`} className={css.link}>
  View details
</Link>

        <button
          className={css.button}
          onClick={() => mutation.mutate(note.id)}
          disabled={mutation.isPending && mutation.variables === note.id}
        >
          {mutation.isPending && mutation.variables === note.id ?
           'Deleting...' : 'Delete'}
        </button>
      </div>
    </li>
  ))}
</ul>

 </>
);
}