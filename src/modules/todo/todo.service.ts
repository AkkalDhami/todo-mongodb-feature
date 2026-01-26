import { ApiError } from "@/shared/utils/api-error";
import Todo from "./todo.model";
import { ITodo } from "./todo.types";
import { UpdateTodoInputType } from "./todo.validation";

export class TodoService {
  static async createTodo({
    userId,
    title,
    description,
    completed
  }: Omit<ITodo, "createdAt" | "updatedAt" | "_id" | "_v">): Promise<ITodo> {
    return await Todo.create({
      userId,
      title,
      description,
      completed
    });
  }

  static async getTodos(userId: string): Promise<ITodo[]> {
    const todos = await Todo.find({ userId });
    return todos;
  }

  static async getTodoById(todoId: string): Promise<ITodo | null> {
    const todo = await Todo.findById(todoId);
    return todo;
  }

  static async updateTodo(
    data: UpdateTodoInputType & { todoId: string; userId: string }
  ): Promise<ITodo | null> {
    const { todoId, userId, ...updateData } = data;

    const todo = await Todo.findById(todoId);
    if (!todo) {
      throw ApiError.notFound("Todo not found");
    }

    if (!todo || todo.userId.toString() !== userId) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    return await Todo.findByIdAndUpdate(todoId, updateData, {
      new: true
    });
  }

  static async deleteTodo(
    todoId: string,
    userId: string
  ): Promise<ITodo | null> {
    const todo = await Todo.findById(todoId);
    if (!todo) {
      throw ApiError.notFound("Todo not found");
    }

    if (!todo || todo.userId.toString() !== userId) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    return await Todo.findByIdAndDelete(todoId);
  }
}
