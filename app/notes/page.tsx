// app/notes/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox"; // Імпортуй компонент пошуку
import { fetchNotes } from "@/lib/api";
import css from "./NotesPage.module.css";

export default function NotesPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // Стан для пошуку

  const { data: response, isLoading } = useQuery({
    // searchQuery в масиві залежностей змусить useQuery робити новий запит при зміні пошуку
    queryKey: ['notes', currentPage, searchQuery],
    // Передаємо page та search у функцію API
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
            pageCount={response?.totalPages || 0} // Беремо реальну кількість сторінок з бекенду
            onPageChange={handlePageChange} 
            forcePage={currentPage} 
          />
        )}
      </div>
    </main>
  );
}