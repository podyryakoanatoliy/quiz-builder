"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { quizSchema, QuizFormData, QuizFormOutput } from "./schema";
import { createQuiz } from "@/services/api";
import { QuestionOptions } from "../../components/QuestionOptions/QuestionOptions";
import styles from "./QuizCreate.module.css";

export default function CreateQuizPage() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "", // Поле вже оголошене в дефолтних значеннях
      questions: [
        {
          question: "",
          type: "boolean",
          uiRadioAnswer: "true",
          uiInputAnswer: "",
          uiCheckboxOptions: ["", "", "", ""],
          uiCheckboxAnswers: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });
  const watchedQuestions = watch("questions");

  const onSubmit = async (data: unknown) => {
    try {
      await createQuiz(data as QuizFormOutput);

      alert("Квіз успішно створено!");
      router.push("/quizzes");
    } catch (error) {
      console.error(error);
      alert("Помилка при створенні квізу");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Створення нового квізу</h1>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Назва квізу
          </label>
          <input
            id="title"
            type="text"
            className={styles.input}
            {...register("title")}
            placeholder="Наприклад: Основи JavaScript"
          />
          {errors.title && (
            <span className={styles.error}>{errors.title.message}</span>
          )}
        </div>

        {/* Опис квізу (Нове додане поле) */}
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Опис квізу{" "}
            <span className={styles.optionalText}>(необов'язково)</span>
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            {...register("description")}
            placeholder="Короткий опис або правила проходження цього квізу..."
            rows={3}
          />
          {errors.description && (
            <span className={styles.error}>{errors.description.message}</span>
          )}
        </div>

        <h2 className={styles.sectionTitle}>Запитання</h2>

        {fields.map((field, index) => {
          const currentType = watchedQuestions[index]?.type || "boolean";
          return (
            <div key={field.id} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <span className={styles.questionNumber}>
                  Запитання №{index + 1}
                </span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    className={styles.btnDelete}
                    onClick={() => remove(index)}
                  >
                    Видалити
                  </button>
                )}
              </div>

              <div className={styles.formGroup}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Введіть текст запитання"
                  {...register(`questions.${index}.question` as const)}
                />
                {errors.questions?.[index]?.question && (
                  <span className={styles.error}>
                    {errors.questions[index]?.question?.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Тип відповіді</label>
                <select
                  className={styles.select}
                  {...register(`questions.${index}.type` as const)}
                >
                  <option value="boolean">True / False (Правда/Брехня)</option>
                  <option value="input">Текстове поле</option>
                  <option value="checkbox">Чекбокси (Мультивибір)</option>
                </select>
              </div>

              <QuestionOptions
                index={index}
                type={currentType}
                register={register}
                setValue={setValue}
                watchedQuestions={watchedQuestions}
                errors={errors.questions}
              />
            </div>
          );
        })}

        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() =>
            append({
              question: "",
              type: "boolean",
              uiRadioAnswer: "true",
              uiInputAnswer: "",
              uiCheckboxOptions: ["", "", "", ""],
              uiCheckboxAnswers: [],
            })
          }
        >
          + Додати запитання
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.btnSubmit}
        >
          {isSubmitting ? "Збереження..." : "Створити квіз"}
        </button>
      </form>
    </div>
  );
}
