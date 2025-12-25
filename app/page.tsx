import styles from "./home.module.css";

export default function Home() {
  return (
    <main>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to NoteHub</h1>
        <p className={styles.description}>
          NoteHub is a simple and efficient application designed for managing
          personal notes. It helps keep your thoughts organized and accessible
          in one place, whether you are at home or on the go.
        </p>
        <p className={styles.description}>
          The app provides a clean interface for writing, editing, and browsing
          notes. With support for keyword search and structured organization,
          NoteHub offers a streamlined experience for anyone who values clarity
          and productivity.
        </p>
      </div>
    </main>
  );
}
