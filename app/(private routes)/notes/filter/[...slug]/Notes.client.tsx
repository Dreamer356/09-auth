"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../../../../lib/api/clientApi";
import NoteList from "../../../../../components/NoteList/NoteList";
import SearchBox from "../../../../../components/SearchBox/SearchBox";
import Pagination from "../../../../../components/Pagination/Pagination";
import Link from "next/link";
import styles from "./NotesPage.module.css";

interface NotesClientProps {
  tag: string;
  initialPage: number;
  initialSearch: string;
}

export default function NotesClient({ tag, initialPage, initialSearch }: NotesClientProps) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Скидаємо сторінку одразу при зміні пошуку
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Скидаємо на першу сторінку одразу
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () => fetchNotes(page, 12, debouncedSearch, tag === "All" ? undefined : tag),
    retry: 3,
    retryDelay: 1000,
    placeholderData: (previousData) => previousData,
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <SearchBox value={search} onChange={handleSearch} />
        <Pagination
          page={page}
          setPage={setPage}
          pageCount={data?.totalPages || 1}
        />
        <Link href="/notes/action/create" className={styles.createButton}>
          Create note +
        </Link>
      </header>

      {isLoading && (
        <div className={styles.loading}>
          <p>Завантаження нотаток...</p>
        </div>
      )}

      {isError && (
        <div className={styles.error}>
          <p>Помилка завантаження нотаток. Спробуйте ще раз.</p>
        </div>
      )}

      {!isLoading && !isError && data && (
        <NoteList notes={data.notes || []} />
      )}
    </div>
  );
} 