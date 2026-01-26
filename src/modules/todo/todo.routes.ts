import { Router } from "express";
import { verifyAuthentication } from "@/shared/middlewares/verify-auth";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo
} from "./todo.controller";
import { validateRequest } from "@/shared/middlewares/validate-request";
import { TodoSchema, UpdateTodoSchema } from "./todo.validation";
import { checkUserAccountRestriction } from "@/shared/middlewares/user-account-restriction";
import { validateObjectId } from "@/shared/middlewares/validate-id";
const router = Router();

router.post(
  "/",
  verifyAuthentication,
  checkUserAccountRestriction,
  validateRequest(TodoSchema),
  createTodo
);

router.get("/", verifyAuthentication, checkUserAccountRestriction, getTodos);

router.get(
  "/:todoId",
  verifyAuthentication,
  checkUserAccountRestriction,
  validateObjectId("todoId"),
  getTodoById
);

router.patch(
  "/:todoId",
  verifyAuthentication,
  checkUserAccountRestriction,
  validateObjectId("todoId"),
  validateRequest(UpdateTodoSchema),
  updateTodo
);

router.delete(
  "/:todoId",
  verifyAuthentication,
  checkUserAccountRestriction,
  validateObjectId("todoId"),
  deleteTodo
);

export default router;
