// app/notes/Notes.client.tsx
"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import { NoteForm } from "@/components/NoteForm/NoteForm";
import { fetchNotes } from "@/lib/api";
import css from "./NotesPage.module.css";

export default function NotesClient() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [debouncedSearch] = useDebounce(searchQuery, 300);

  const { data: response, isLoading } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () => fetchNotes(currentPage, debouncedSearch),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (selectedItem: { selected: number }): void => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handleSearchChange = (value: string): void => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>My Notes</h1>

        <div className={css.controls}>
          <SearchBox value={searchQuery} onChange={handleSearchChange} />
          <button
            type="button"
            className={css.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            Create Note
          </button>
        </div>

        {isLoading ? (
          <p>Loading notes...</p>
        ) : (
          <>
            <NoteList notes={response?.notes || []} />
            <Pagination
              pageCount={response?.totalPages || 1}
              onPageChange={handlePageChange}
              forcePage={currentPage - 1}
            />
          </>
        )}

        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <NoteForm onClose={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </div>
    </main>
  );
}
