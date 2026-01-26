import { Router } from "express";
import healthRoutes from "@/modules/health/health.routes";
import authRoutes from "@/modules/auth/auth.routes";
import oauthRoutes from "@/modules/oauth/oauth.routes";
import todoRoutes from "@/modules/todo/todo.routes";

const router = Router();

router.use("/v1/health", healthRoutes);
router.use("/v1/auth", authRoutes);
router.use("/auth", oauthRoutes);

router.use("/v1/todos", todoRoutes);

export default router;
