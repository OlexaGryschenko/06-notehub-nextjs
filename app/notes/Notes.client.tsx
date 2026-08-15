// app/notes/Notes.client.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api";
import css from "./NotesPage.module.css";

export default function NotesClient() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ['notes', currentPage, searchQuery],
    queryFn: () => fetchNotes(currentPage + 1, searchQuery),
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>My Notes</h1>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />

        {isLoading ? (
          <p>Loading notes...</p>
        ) : (
          <NoteList 
            notes={response?.notes || []} 
            pageCount={response?.totalPages || 0} 
            onPageChange={handlePageChange} 
            forcePage={currentPage} 
          />
        )}
      </div>
    </main>
  );
}