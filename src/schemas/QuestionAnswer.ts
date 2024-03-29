import { z } from "zod";

const QuestionAnswer = z.object({
  answer: z.string().max(1000),
});

export default QuestionAnswer;
