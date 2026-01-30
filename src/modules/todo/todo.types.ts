import mongoose from "mongoose";

export interface ITodo {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;

  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export type TodoFilterType = {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: "asc" | "desc"
};