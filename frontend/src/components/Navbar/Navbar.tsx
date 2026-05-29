import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>QuizyLand</div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/">Головна</Link>
        </li>
        <li>
          <Link href="/quizzes">Усі квізи</Link>
        </li>
        <li>
          <Link href="/create" className={styles.createBtn}>
            Створити квіз
          </Link>
        </li>
      </ul>
    </nav>
  );
}
