import { ApiError } from "@/shared/utils/api-error";
import Todo from "./todo.model";
import { IPagination, ITodo, TodoFilterType } from "./todo.types";
import { UpdateTodoInputType } from "./todo.validation";
import mongoose from "mongoose";

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

  static async getTodos(userId: string, filters: TodoFilterType):
    Promise<{
      todos: ITodo[],
      pagination: IPagination
    }> {

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const search = filters.search || "";
    const sortBy = filters.sortBy || "desc";

    const skip = (page - 1) * limit;

    const todos = await Todo.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
          ]
        }
      },
      {
        $sort: {
          createdAt: sortBy === "asc" ? 1 : -1
        }
      },
      {
        $skip: skip

      },
      {
        $limit: limit

      },

    ])

    const total = await Todo.countDocuments({ userId });
    const pages = Math.ceil(total / limit);

    return {
      todos,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
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
