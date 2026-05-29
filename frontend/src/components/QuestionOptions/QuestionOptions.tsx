import React from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { QuizFormData } from "../../app/create/schema";
import styles from "./QuestionOptions.module.css";

interface QuestionOptionsProps {
  index: number;
  type: "boolean" | "input" | "checkbox";
  register: UseFormRegister<QuizFormData>;
  setValue: UseFormSetValue<QuizFormData>;
  watchedQuestions: any[];
  errors: any;
}

export const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  index,
  type,
  register,
  setValue,
  watchedQuestions,
  errors,
}) => {
  if (type === "boolean") {
    return (
      <div className={styles.optionsGroup}>
        <span className={styles.optionsTitle}>Правильна відповідь:</span>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            value="true"
            {...register(`questions.${index}.uiRadioAnswer` as const)}
          />
          True (Правда)
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            value="false"
            {...register(`questions.${index}.uiRadioAnswer` as const)}
          />
          False (Брехня)
        </label>
      </div>
    );
  }

  if (type === "input") {
    return (
      <div className={styles.formGroup}>
        <label className={styles.label}>Правильна текстова відповідь:</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Введіть точну відповідь"
          {...register(`questions.${index}.uiInputAnswer` as const)}
        />
        {errors?.[index]?.uiInputAnswer && (
          <span className={styles.error}>
            {errors[index].uiInputAnswer.message}
          </span>
        )}
      </div>
    );
  }

  if (type === "checkbox") {
    const currentAnswers = watchedQuestions[index]?.uiCheckboxAnswers || [];
    return (
      <div className={styles.optionsGroup}>
        <label className={styles.label}>
          Варіанти відповідей (відмітьте правильні):
        </label>
        {[0, 1, 2, 3].map((optIndex) => {
          const optionValue =
            watchedQuestions[index]?.uiCheckboxOptions?.[optIndex] || "";
          return (
            <div key={optIndex} className={styles.checkboxRow}>
              <input
                type="checkbox"
                disabled={!optionValue}
                checked={
                  optionValue !== "" && currentAnswers.includes(optionValue)
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue(`questions.${index}.uiCheckboxAnswers`, [
                      ...currentAnswers,
                      optionValue,
                    ]);
                  } else {
                    setValue(
                      `questions.${index}.uiCheckboxAnswers`,
                      currentAnswers.filter(
                        (ans: string) => ans !== optionValue,
                      ),
                    );
                  }
                }}
              />
              <input
                type="text"
                className={styles.input}
                placeholder={`Варіант ${optIndex + 1}`}
                {...register(
                  `questions.${index}.uiCheckboxOptions.${optIndex}` as const,
                )}
              />
            </div>
          );
        })}
        {errors?.[index]?.uiCheckboxOptions && (
          <span className={styles.error}>
            {errors[index].uiCheckboxOptions.message}
          </span>
        )}
        {errors?.[index]?.uiCheckboxAnswers && (
          <span className={styles.error}>
            {errors[index].uiCheckboxAnswers.message}
          </span>
        )}
      </div>
    );
  }

  return null;
};
