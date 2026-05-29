import Navbar from "@/components/Navbar/Navbar";
import styles from "./page.module.css";
import Link from "next/link";

export default async function HomePage() {
  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <section className={styles.heroContent}>
          <h1>Вітаємо в QuizyLAND!</h1>
          <p>Керуйте своїми тестами легко та швидко.</p>

          <div className={styles.ctaButtons}>
            <Link href="/quizzes" className={styles.btnSecondary}>
              Переглянути квізи
            </Link>
            <Link href="/create" className={styles.btnPrimary}>
              Створити новий
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
