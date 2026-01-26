import z from "zod";

export const TodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  completed: z.boolean().optional().default(false)
});

export const UpdateTodoSchema = TodoSchema.partial();

export type TodoInputType = z.infer<typeof TodoSchema>;
export type UpdateTodoInputType = z.infer<typeof UpdateTodoSchema>;
