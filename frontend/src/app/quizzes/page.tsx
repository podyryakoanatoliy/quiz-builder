"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; // Імпортуємо Link для навігації
import { fetchQuizzes, deleteQuiz } from "@/services/api";
import QuizCard from "@/components/QuizCard/QuizCard";
import styles from "./quizzes.module.css";

interface Quiz {
  id: string;
  title: string;
  description?: string;
  questionsCount: number;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Завантажуємо квізи при монтуванні сторінки
  useEffect(() => {
    fetchQuizzes()
      .then((data) => setQuizzes(data))
      .catch((err) => console.error("Не вдалося завантажити квізи:", err))
      .finally(() => setLoading(false));
  }, []);

  // Функція для миттєвого видалення квізу зі стейту
  const handleDeleteQuiz = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цей квіз?")) return;

    try {
      await deleteQuiz(id);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
    } catch (error) {
      console.error("Помилка при видаленні:", error);
      alert("Не вдалося видалити квіз");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Завантаження квізів...</div>;
  }

  return (
    <main className={styles.container}>
      <div className={styles.pageHeader}>
        <Link href="/" className={styles.homeBtn}>
          ← На головну
        </Link>
        <h1 className={styles.pageTitle}>Доступні тести</h1>
      </div>

      {quizzes.length === 0 ? (
        <p className={styles.emptyState}>У вас поки немає створених тестів.</p>
      ) : (
        <div className={styles.grid}>
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} onDelete={handleDeleteQuiz} />
          ))}
        </div>
      )}
    </main>
  );
}
