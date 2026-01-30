import { Response, NextFunction } from "express";
import { TodoInputType, UpdateTodoInputType } from "./todo.validation";
import { UserRequest } from "@/types/global";
import { TodoService } from "./todo.service";
import { AsyncHandler } from "@/shared/utils/async-handler";
import { ApiError } from "@/shared/utils/api-error";
import { ApiResponse } from "@/shared/utils/api-response";
import mongoose from "mongoose";
import { TodoFilterType } from "./todo.types";

//? CREATE NEW TODO
export const createTodo = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { completed, title, description }: TodoInputType = req.body;
    const userId = req?.user?._id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const todo = await TodoService.createTodo({
      userId: new mongoose.Types.ObjectId(userId),
      title,
      description,
      completed
    });

    return ApiResponse.created(res, "Todo created successfully", {
      todo
    });
  }
);

//? GET ALL TODOS FOR A USER
export const getTodos = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?._id;

    const filters: TodoFilterType = req.query;

    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const todos = await TodoService.getTodos(userId.toString(), {
      limit: filters.limit || '10', page: filters.page || '1', search: filters.search || '', sortBy: filters.sortBy || 'desc'
    });
    return ApiResponse.ok(res, "Todos fetched successfully", { todos });
  }
);

//? GET A TODO BY ID
export const getTodoById = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const todoId = req.params.id;
    const todo = await TodoService.getTodoById(todoId as string);
    if (!todo) {
      return next(ApiError.notFound("Todo not found"));
    }
    return ApiResponse.ok(res, "Todo fetched successfully", { todo });
  }
);

//? UPDATE A TODO BY ID
export const updateTodo = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const data: UpdateTodoInputType = req.body;
    const todoId = req.params.id;
    if (!todoId) {
      return next(ApiError.badRequest("Todo ID is required"));
    }

    const userId = req?.user?._id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const todo = await TodoService.updateTodo({
      ...data,
      userId: userId.toString(),
      todoId: todoId as string
    });

    if (!todo) {
      return next(ApiError.server("Failed to update todo"));
    }

    return ApiResponse.ok(res, "Todo updated successfully", { todo });
  }
);

//? DELETE A TODO BY ID
export const deleteTodo = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const todoId = req.params.todoId;
    console.log({ todoId });
    const userId = req?.user?._id;
    if (!userId) {
      return next(ApiError.unauthorized("Unauthorized access"));
    }

    const todo = await TodoService.deleteTodo(
      todoId as string,
      userId.toString()
    );

    if (!todo) {
      return next(ApiError.server("Failed to delete todo"));
    }

    return ApiResponse.ok(res, "Todo deleted successfully");
  }
);
