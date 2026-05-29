import { z } from "zod";

export const questionSchema = z
  .object({
    question: z
      .string()
      .min(3, { message: "Запитання має бути довшим за 3 символи" }),
    type: z.enum(["boolean", "input", "checkbox"]),

    uiRadioAnswer: z.string().optional(),
    uiInputAnswer: z.string().optional(),
    uiCheckboxOptions: z.array(z.string()).optional(),
    uiCheckboxAnswers: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "input" && !data.uiInputAnswer?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["uiInputAnswer"],
        message: "Введіть правильну відповідь",
      });
    }
    if (data.type === "checkbox") {
      const filledOptions =
        data.uiCheckboxOptions?.filter((opt) => opt.trim() !== "") || [];
      if (filledOptions.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["uiCheckboxOptions"],
          message: "Додайте мінімум 2 варіанти",
        });
      }
      if (!data.uiCheckboxAnswers || data.uiCheckboxAnswers.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["uiCheckboxAnswers"],
          message: "Оберіть хоча б одну правильну відповідь",
        });
      }
    }
  })
  .transform((data) => {
    let correctAnswer = "";
    let options: string[] = [];

    if (data.type === "boolean") {
      correctAnswer = data.uiRadioAnswer || "true";
      options = ["true", "false"];
    } else if (data.type === "input") {
      correctAnswer = data.uiInputAnswer || "";
      options = [];
    } else if (data.type === "checkbox") {
      correctAnswer = data.uiCheckboxAnswers
        ? data.uiCheckboxAnswers.join(", ")
        : "";
      options = data.uiCheckboxOptions
        ? data.uiCheckboxOptions.filter((opt) => opt.trim() !== "")
        : [];
    }

    return {
      type: data.type,
      question: data.question,
      correctAnswer,
      options,
    };
  });

export const quizSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Назва квізу має бути не менше 3 символів" }),
  description: z.string().optional().default(""),
  questions: z
    .array(questionSchema)
    .min(1, { message: "Додайте хоча б одне запитання" }),
});

export type QuizFormData = z.input<typeof quizSchema>;
export type QuizFormOutput = z.output<typeof quizSchema>;
