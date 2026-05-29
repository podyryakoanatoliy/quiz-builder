"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchQuizById } from "@/services/api";
import styles from "./QuizDetails.module.css";

interface Question {
  id: string;
  type: "boolean" | "input" | "checkbox";
  question: string;
  options: string[];
  correctAnswers: string[];
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export default function QuizDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    fetchQuizById(id as string)
      .then((data) => setQuiz(data))
      .catch((err) => {
        console.error("Помилка завантаження квізу:", err);
        alert("Не вдалося знайти такий квіз");
        router.push("/quizzes");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading)
    return <div className={styles.loading}>Завантаження деталей квізу...</div>;
  if (!quiz) return <div className={styles.errorState}>Квіз не знайдено</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => router.push("/quizzes")}
          className={styles.backBtn}
        >
          ← Назад до списку
        </button>
        <h1 className={styles.quizTitle}>{quiz.title}</h1>
        {quiz.description && (
          <p className={styles.quizDescription}>{quiz.description}</p>
        )}
        <span className={styles.metaBadge}>
          Всього запитань: {quiz.questions.length}
        </span>
      </div>

      <div className={styles.questionsList}>
        {quiz.questions.map((q, index) => (
          <div key={q.id} className={styles.questionCard}>
            <div className={styles.questionHeader}>
              <span className={styles.questionNumber}>
                Запитання {index + 1}
              </span>
              <span className={`${styles.typeBadge} ${styles[q.type]}`}>
                {q.type}
              </span>
            </div>

            <h3 className={styles.questionText}>{q.question}</h3>

            <div className={styles.answersSection}>
              {q.type === "boolean" && (
                <div className={styles.optionsGroup}>
                  {["true", "false"].map((opt) => {
                    const isCorrect = Array.isArray(q.correctAnswers)
                      ? q.correctAnswers.includes(opt)
                      : q.correctAnswers === opt; // фолбек якщо в БД лежить просто рядок

                    return (
                      <div
                        key={opt}
                        className={`${styles.readOnlyOption} ${isCorrect ? styles.correct : ""}`}
                      >
                        <input type="radio" disabled checked={isCorrect} />
                        <span className={styles.optionText}>
                          {opt === "true" ? "True (Правда)" : "False (Брехня)"}
                        </span>
                        {isCorrect && (
                          <span className={styles.correctLabel}>
                            ✓ Правильно
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {q.type === "input" && (
                <div className={styles.inputGroup}>
                  <label className={styles.nestedLabel}>
                    Очікувана текстова відповідь:
                  </label>
                  <div className={styles.correctInputPreview}>
                    {Array.isArray(q.correctAnswers)
                      ? q.correctAnswers[0]
                      : (q.correctAnswers as string) || "Порожня відповідь"}
                  </div>
                </div>
              )}

              {q.type === "checkbox" && (
                <div className={styles.optionsGroup}>
                  {q.options?.map((opt, optIdx) => {
                    const answers = q.correctAnswers as unknown;

                    const isCorrect = Array.isArray(answers)
                      ? answers.includes(opt)
                      : typeof answers === "string"
                        ? answers.split(", ").includes(opt)
                        : false;

                    return (
                      <div
                        key={optIdx}
                        className={`${styles.readOnlyOption} ${isCorrect ? styles.correct : ""}`}
                      >
                        <input type="checkbox" disabled checked={isCorrect} />
                        <span className={styles.optionText}>{opt}</span>
                        {isCorrect && (
                          <span className={styles.correctLabel}>
                            ✓ Правильно
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
