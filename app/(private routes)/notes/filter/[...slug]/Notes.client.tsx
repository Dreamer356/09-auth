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

export default function NotesClient({
  tag,
  initialPage,
  initialSearch,
}: NotesClientProps) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Скидаємо сторінку при зміні пошуку
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
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
    queryFn: () =>
      fetchNotes(page, 12, debouncedSearch, tag === "All" ? undefined : tag),
    retry: 3,
    retryDelay: 1000,
    placeholderData: (previousData) => previousData,
  });

  const hasNotes = (data?.notes?.length ?? 0) > 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <SearchBox value={search} onChange={handleSearch} />

        {hasNotes && (
          <Pagination
            page={page}
            setPage={setPage}
            pageCount={data?.totalPages ?? 1}
          />
        )}

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

      {!isLoading && !isError && (
        <>
          {hasNotes ? (
            <NoteList notes={data!.notes} />
          ) : (
            <p className={styles.empty}>Немає нотаток для відображення</p>
          )}
        </>
      )}
    </div>
  );
}
