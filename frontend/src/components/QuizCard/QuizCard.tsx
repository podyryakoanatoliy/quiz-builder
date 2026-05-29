"use client";

import { FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import styles from "./QuizCard.module.css";

interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    description?: string;
    questionsCount: number;
  };
  onDelete: (id: string) => void;
}

export default function QuizCard({ quiz, onDelete }: QuizCardProps) {
  return (
    <Link href={`/quizzes/${quiz.id}`} className={styles.card}>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{quiz.title}</h3>
        {quiz.description && (
          <p className={styles.cardDescription}>{quiz.description}</p>
        )}
        <span className={styles.questionsBadge}>
          Питань: {quiz.questionsCount}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(quiz.id);
        }}
        className={styles.deleteBtn}
        title="Видалити тест"
      >
        <FaTrashAlt />
      </button>
    </Link>
  );
}
